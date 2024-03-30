import { startDocker } from "./docker-manger";

const setup = async () => {
  console.log("\n--- START setup ---");
  await startDocker();
  console.log("--- END setup ---");
};

export default setup;
