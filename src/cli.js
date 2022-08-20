import inquirer from "inquirer";
import generator from "./generator.js";

async function createCLI(params) {
  const questions = [
    { type: "input", name: "name", message: "Informe o nome do projeto" },
    {
      type: "list",
      name: "startTool",
      message:
        "Informe a ferramenta que deseja utilizar para iniciar o projeto",
      choices: ["node", "nodemon"],
      default: "node",
    },
    {
      type: "list",
      name: "codeFormat",
      message: "Informe o formato de escrita de código",
      choices: ["ecmascript", "commonjs"],
      default: "ecmascript",
    },
    {
      type: "confirm",
      name: "git",
      message: "Deseja iniciar o git?",
      default: false,
    },
  ];

  return await inquirer.prompt(questions);
}

async function cli() {
  const options = await createCLI();
  await generator(options);
  console.log(options);
}
export default cli;
