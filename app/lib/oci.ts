import * as oci from "oci-sdk";
import path from "path";

const ociConfigPath = path.join(process.cwd(), ".oci", "config");
const provider = new oci.common.ConfigFileAuthenticationDetailsProvider(
  ociConfigPath
);

export const ObjectStorageClient = new oci.objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

export const getNamespace = async () => {
  const namespaceResponse = await ObjectStorageClient.getNamespace({});
  return namespaceResponse.value;
};