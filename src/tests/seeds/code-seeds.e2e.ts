import { testCodes } from "../../users/tests/code-seeds";
import { CodeFixture } from "../fixtures/code-fixture";

export const e2eCodes = {
  registerUser: new CodeFixture(testCodes.CreationCode),
};
