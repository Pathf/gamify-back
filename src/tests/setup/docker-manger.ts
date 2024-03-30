import * as path from "node:path";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname);
  const compileFile = "docker-compose.yml";
  instance = await new DockerComposeEnvironment(
    composeFilePath,
    compileFile,
  ).up();
};

export const stopDocker = async () => {
  if (!instance) {
    return;
  }

  try {
    await instance.down();
    instance = null;
  } catch (error) {
    console.error("Error stopping docker", error);
  }
};

export const getDockerComposeInstance = (): StartedDockerComposeEnvironment => {
  if (!instance) {
    throw new Error("Docker compose instance not started");
  }
  return instance;
};
