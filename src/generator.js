import { mkdir, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import copy from "recursive-copy";
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const execPromise = promisify(exec);

function showError(error, exception) {
  console.log("\n", chalk.red("⚠️", error), "\n");
  console.error(exception);
  process.exit(1);
}

async function createProjectFolder(name) {
  const folderPath = resolve(process.cwd(), name);

  try {
    await mkdir(folderPath);
  } catch (error) {
    showError("Não foi possivel criar um diretorio com este nome", error);
  }
}

async function createPackageJson(projectName, startTool, codeFormat) {
  let packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "My first node service project",
    main: "src/index.js",
    license: "MIT",
    scripts: {
      start: "node src/index.js",
    },
  };

  if (startTool === "nodemon") {
    packageJson = {
      ...packageJson,
      scripts: { start: "nodemon src/index.js" },
      devDependencies: { nodemon: "^2.0.19" },
    };
  }

  if (codeFormat === "ecmascript") {
    packageJson = {
      ...packageJson,
      type: "module",
    };
  }

  const packageJsonPath = resolve(process.cwd(), projectName, "package.json");
  const dataPackageJson = JSON.stringify(packageJson, null, 2);

  try {
    await writeFile(packageJsonPath, dataPackageJson);
  } catch (error) {
    showError("Não foi possivel criar o arquivo package.json", error);
  }
}

async function copySrcTemplate(projectName, codeFormat) {
  const originPath = resolve(__dirname, "..", "templates", `src-${codeFormat}`);
  const destinyPath = resolve(process.cwd(), projectName, "src");

  try {
    await copy(originPath, destinyPath);
  } catch (error) {
    showError("Não foi possível criar a pasta src", error);
  }
}

async function initGit(projectName) {
  const gitignorePath = resolve(process.cwd(), projectName, ".gitignore");

  try {
    await execPromise("git init", {
      cwd: resolve(process.cwd(), projectName),
    });
    await writeFile(gitignorePath, "node_modules");
  } catch (error) {
    showError("Não foi possível iniciar o git", error);
  }
}

async function installPackages(projectName) {
  try {
    await execPromise("npm install", {
      cwd: resolve(process.cwd(), projectName),
    });
  } catch (error) {
    showError("Não foi possível instalar os pacotes", error);
  }
}

async function generator(options) {
  const { name, startTool, codeFormat, git } = options;

  await createProjectFolder(name);
  await createPackageJson(name, startTool, codeFormat);
  await copySrcTemplate(name, codeFormat);

  if (git) {
    initGit(name);
  }

  await installPackages(name);

  console.log(
    "\n",
    chalk.green("✔️ ", "Sucesso ao criar o projeto: ", name),
    "\n"
  );
}

export default generator;
