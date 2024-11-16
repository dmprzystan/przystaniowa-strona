import { common, objectstorage } from "oci-sdk";
if (
  !process.env.OCI_TENANCY ||
  !process.env.OCI_USER ||
  !process.env.OCI_FINGERPRINT ||
  !process.env.OCI_PRIVATE_KEY
) {
  throw new Error("Missing OCI credentials");
}

const simpleProvider = new common.SimpleAuthenticationDetailsProvider(
  process.env.OCI_TENANCY,
  process.env.OCI_USER,
  process.env.OCI_FINGERPRINT,
  process.env.OCI_PRIVATE_KEY,
  null,
  common.Region.EU_FRANKFURT_1
);

export const ObjectStorageClient = new objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: simpleProvider,
});

export const getNamespace = async () => {
  const namespaceResponse = await ObjectStorageClient.getNamespace({});
  return namespaceResponse.value;
};

export const getStatute = async () => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.GetObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: "regulamin/regulamin.html",
  };

  try {
    const response = await ObjectStorageClient.getObject(request);

    const reader = (response.value as ReadableStream).getReader();

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      result += new TextDecoder().decode(value);
    }

    return result;
  } catch (error) {
    console.error(error);
  }

  return "";
};
export const getConfirmation = async () => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.GetObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: "bierzmowanie/bierzmowanie.html",
  };

  try {
    const response = await ObjectStorageClient.getObject(request);

    const reader = (response.value as ReadableStream).getReader();

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      result += new TextDecoder().decode(value);
    }

    return result;
  } catch (error) {
    console.error(error);
  }

  return "";
};

export const putStatute = async (statute: string) => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.PutObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: "regulamin/regulamin.html",
    putObjectBody: statute,
  };

  await ObjectStorageClient.putObject(request);
};
export const putConfirmation = async (confirmation: string) => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.PutObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: "bierzmowanie/bierzmowanie.html",
    putObjectBody: confirmation,
  };

  await ObjectStorageClient.putObject(request);
};

export const createPAR = async (path: string, folder = false) => {
  const namespace = await getNamespace();

  const par = await ObjectStorageClient.createPreauthenticatedRequest({
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    createPreauthenticatedRequestDetails: {
      name: `par-${path}-${Date.now()}`,
      timeExpires: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
      objectName: path,
      accessType: folder
        ? objectstorage.models.CreatePreauthenticatedRequestDetails.AccessType
            .AnyObjectWrite
        : objectstorage.models.CreatePreauthenticatedRequestDetails.AccessType
            .ObjectWrite,
    },
  });

  if (folder) {
    return par.preauthenticatedRequest.fullPath + path;
  }

  return par.preauthenticatedRequest.fullPath;
};

export const uploadFile = async (file: File, path: string) => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.PutObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: path,
    putObjectBody: file.stream(),
  };

  await ObjectStorageClient.putObject(request);
};

export const deleteFile = async (path: string) => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.DeleteObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: path,
  };

  await ObjectStorageClient.deleteObject(request);
};

export const renameFile = async (oldPath: string, newPath: string) => {
  const namespace = await getNamespace();

  const request: objectstorage.requests.RenameObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    renameObjectDetails: {
      sourceName: oldPath,
      newName: newPath,
    },
  };

  await ObjectStorageClient.renameObject(request);
};

export const removeExpiredPARs = async () => {
  const namespace = await getNamespace();

  const parList = await ObjectStorageClient.listPreauthenticatedRequests({
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
  });

  const expiredPARs = parList.items.filter(
    (par) => new Date(par.timeExpires) < new Date()
  );

  await Promise.all(
    expiredPARs.map((par) =>
      ObjectStorageClient.deletePreauthenticatedRequest({
        bucketName: "przystaniowa-strona",
        namespaceName: namespace,
        parId: par.id,
      })
    )
  );
};
