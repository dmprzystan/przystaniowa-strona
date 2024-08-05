import * as oci from "oci-sdk";
import path from "path";
import { readFileSync } from "fs";

const ociConfigPath = path.join(process.cwd(), ".oci", "config");
const provider = new oci.common.ConfigFileAuthenticationDetailsProvider(
  ociConfigPath
);

console.log("OCI config path: ", ociConfigPath);
const config = readFileSync(ociConfigPath, "utf8");
console.log("OCI config: ", config);
const keyPath = config.split("key_file=")[1].replace("\n", "") || "";
if (!keyPath) {
  throw new Error("OCI_PRIVATE_KEY_PATH is not defined");
}
console.log("OCI private key path: ", keyPath);
console.log("OCI private key: ", readFileSync(keyPath, "utf8"));

export const ObjectStorageClient = new oci.objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

export const getNamespace = async () => {
  const namespaceResponse = await ObjectStorageClient.getNamespace({});
  return namespaceResponse.value;
};

export const getStatute = async () => {
  const namespace = await getNamespace();

  const request: oci.objectstorage.requests.GetObjectRequest = {
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

export const putStatute = async (statute: string) => {
  const namespace = await getNamespace();

  const request: oci.objectstorage.requests.PutObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespace,
    objectName: "regulamin/regulamin.html",
    putObjectBody: statute,
  };

  await ObjectStorageClient.putObject(request);
};
