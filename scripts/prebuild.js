const { config } = require("dotenv")
const { writeFileSync, mkdirSync } = require("fs")
const { join } = require("path")

config({path: `.env`})

const oci_key = process.env.OCI_PRIVATE_KEY
const oci_key_file = process.env.OCI_PRIVATE_KEY_FILE

if (!oci_key || !oci_key_file) {
  throw new Error("OCI_PRIVATE_KEY and OCI_PRIVATE_KEY_FILE must be defined")
}

const key_path = join(__dirname, "..", oci_key_file)
const key_dir = join(__dirname, "..", oci_key_file.split("/").slice(0, -1).join("/"))

mkdirSync(key_dir, {recursive: true})
writeFileSync(key_path, oci_key, {encoding: "utf-8"})

const oci_config = {
    user: process.env.OCI_USER,
    fingerprint: process.env.OCI_FINGERPRINT,
    tenancy: process.env.OCI_TENANCY,
    region: process.env.OCI_REGION,
    key_file: key_path,
}

if (!oci_config.user || !oci_config.fingerprint || !oci_config.tenancy || !oci_config.region) {
  throw new Error("OCI_USER, OCI_FINGERPRINT, OCI_TENANCY, and OCI_REGION must be defined")
}

const config_path = join(__dirname, "..", ".oci", "config")

writeFileSync(config_path, `[DEFAULT]\n`)

for (const [key, value] of Object.entries(oci_config)) {
    writeFileSync(config_path, `${key}=${value}\n`, {flag: "a"})
}

console.log(`Wrote OCI config to ${config_path}`)