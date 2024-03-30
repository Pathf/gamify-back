import { stopDocker } from "./docker-manger";

const teardown = async () => {
  await stopDocker();
  console.log("--- END Teardown ---");
};

export default teardown;
