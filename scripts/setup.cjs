const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const env = path.join(root, ".env");
const example = path.join(root, ".env.example");

function assertNode() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 20 || (major === 20 && minor < 19)) {
    console.error(
      `Node ${process.version} é velho demais.\nInstale 20.19 ou 22: https://nodejs.org/`,
    );
    process.exit(1);
  }
  console.log(`Node ${process.version} ok`);
}

function ensureEnv() {
  if (!fs.existsSync(example)) {
    console.error("faltou .env.example");
    process.exit(1);
  }
  if (!fs.existsSync(env)) {
    fs.copyFileSync(example, env);
    console.log("criei .env a partir do .env.example");
  } else {
    console.log(".env já existe — não mexi");
  }
}

assertNode();
ensureEnv();
