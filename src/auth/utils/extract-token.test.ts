import { Scheme, extractToken } from "./extract-token";

describe("extract-token", () => {
  it("should extract the Basic token", () => {
    expect(extractToken("Basic 123", Scheme.Basic)).toEqual("123");
    expect(extractToken("Test 123", Scheme.Basic)).toEqual(null);
    expect(extractToken("123", Scheme.Basic)).toEqual(null);
    expect(extractToken("", Scheme.Basic)).toEqual(null);
  });

  it("should extract the Bearer token", () => {
    expect(extractToken("Bearer 123", Scheme.Bearer)).toEqual("123");
    expect(extractToken("Test 123", Scheme.Bearer)).toEqual(null);
    expect(extractToken("123", Scheme.Bearer)).toEqual(null);
    expect(extractToken("", Scheme.Bearer)).toEqual(null);
  });
});
