export enum Scheme {
  Basic = "Basic",
  Bearer = "Bearer",
}

export const extractToken = (
  authorization: string,
  scheme: Scheme,
): string | null => {
  const [tokenType, token] = authorization.split(" ");
  return tokenType !== scheme ? null : token;
};
