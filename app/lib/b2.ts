import {
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

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

export const readFile = async (path: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path,
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
    Key: path,
    Body: content,
  });

  await b2Client.send(putCommand);
};

export const deleteFile = async (path: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: path,
  });

  await b2Client.send(deleteCommand);
};

export const renameFile = async (oldPath: string, newPath: string) => {
  const content = new CopyObjectCommand({
    Bucket: process.env.B2_BUCKET,
    Key: newPath,
    CopySource: oldPath,
  });

  await b2Client.send(content);

  await deleteFile(oldPath);
};

export default b2Client;
