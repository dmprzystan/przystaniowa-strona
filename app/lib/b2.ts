import {
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "./prisma";

if (
  !process.env.B2_ENDPOINT ||
  !process.env.B2_REGION ||
  !process.env.B2_BUCKET ||
  !process.env.B2_APP_KEY ||
  !process.env.B2_APP_SECRET
) {
  throw new Error("Missing B2 credentials");
}

let b2Client: S3Client;

declare global {
  var b2Client: S3Client;
}

const b2Config: S3ClientConfig = {
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APP_KEY,
    secretAccessKey: process.env.B2_APP_SECRET,
  },
  profile: "b2",
};

if (process.env.NODE_ENV === "production") {
  b2Client = new S3Client(b2Config);
} else {
  if (!(global as any).b2Client) {
    global.b2Client = new S3Client(b2Config);
  }
  b2Client = global.b2Client;
}

type B2Authorization = {
  authorizationToken: string;
  apiUrl: string;
};
const authorizeAccount: () => Promise<B2Authorization> = async () => {
  const cached = await prisma.config.findUnique({
    where: {
      key: "b2_authorization",
    },
  });

  try {
    if (cached) {
      const { authorizationToken, expirationTimestamp, apiUrl } = JSON.parse(
        cached.value as string
      );

      if (!authorizationToken || !expirationTimestamp || !apiUrl) {
        throw new Error("Invalid cache data");
      }

      // Check the type of the cached data
      if (
        typeof authorizationToken !== "string" ||
        typeof expirationTimestamp !== "number" ||
        typeof apiUrl !== "string"
      ) {
        throw new Error("Invalid cache data");
      }

      // Check if the token is still valid for at least 15 minutes
      if (expirationTimestamp - Date.now() > 15 * 60 * 1000) {
        return { authorizationToken, apiUrl };
      }
    }
  } catch (error: any) {
    console.error(error.message);
  }

  const response = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.B2_APP_KEY}:${process.env.B2_APP_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  const data = await response.json();
  const cacheData = {
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiInfo.storageApi.apiUrl,
    expirationTimestamp: Date.now() + 24 * 60 * 60 * 1000,
  };

  await prisma.config.upsert({
    where: {
      key: "b2_authorization",
    },
    create: {
      key: "b2_authorization",
      value: JSON.stringify(cacheData),
    },
    update: {
      value: JSON.stringify(cacheData),
    },
  });

  return {
    authorizationToken: cacheData.authorizationToken as string,
    apiUrl: cacheData.apiUrl as string,
  };
};

export const readFile = async (path: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path.normalize("NFC"),
  });

  try {
    const response = await b2Client.send(getCommand);

    if (!response.Body) {
      throw new Error("File not found");
    }

    const content = response.Body.transformToString("utf-8");

    return content;
  } catch (error: any) {
    console.error(error.Code);
  }

  return "";
};

export const writeFile = async (path: string, content: string) => {
  const putCommand = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path.normalize("NFC"),
    Body: content,
  });

  await b2Client.send(putCommand);
};

export const deleteFile = async (path: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path.normalize("NFC"),
  });

  await b2Client.send(deleteCommand);
};

export const renameFile = async (oldPath: string, newPath: string) => {
  const content = new CopyObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: newPath.normalize("NFC"),
    CopySource: `${process.env.B2_BUCKET}/${encodeURIComponent(
      oldPath.normalize("NFC")
    )}`,
  });

  await b2Client.send(content);

  await deleteFile(oldPath);
};

export const getBucketSize = async () => {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.B2_BUCKET,
  });

  const response = await b2Client.send(listCommand);

  return response.Contents?.reduce((acc, file) => {
    return acc + (file.Size ? Number(file.Size) : 0);
  }, 0);
};

export const createPresignedUrl = async (path: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path.normalize("NFC"),
  });

  const url = await getSignedUrl(b2Client, command, {
    expiresIn: 15 * 60, // 15 minutes
  });

  return url;
};

export const getDownloadUrl = async (path: string) => {
  const { authorizationToken, apiUrl } = await authorizeAccount();

  return {
    url: `${apiUrl}/file/${process.env.B2_BUCKET}/${path}`,
    authorization: authorizationToken,
  };
};

export default b2Client;
