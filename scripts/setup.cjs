const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const env = path.join(root, ".env");
const example = path.join(root, ".env.example");

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
