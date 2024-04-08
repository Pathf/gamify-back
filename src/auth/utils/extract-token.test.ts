import { extractBasicToken, extractBearerToken } from "./extract-token";

describe("extract-token", () => {
  it("should extract the Basic token", () => {
    expect(extractBasicToken("Basic 123")).toEqual("123");
    expect(extractBasicToken("Test 123")).toEqual(null);
    expect(extractBasicToken("123")).toEqual(null);
    expect(extractBasicToken("")).toEqual(null);
  });

  it("should extract the Bearer token", () => {
    expect(extractBearerToken("Bearer 123")).toEqual("123");
    expect(extractBearerToken("Test 123")).toEqual(null);
    expect(extractBearerToken("123")).toEqual(null);
    expect(extractBearerToken("")).toEqual(null);
  });
});
