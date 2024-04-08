export const extractBasicToken = (header: string): string | null => {
  const parts = header.split(" ");

  if (parts[0] !== "Basic") {
    return null;
  }
  return parts[1];
};

export const extractBearerToken = (authorization: string): string | null => {
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") {
    return null;
  }
  return token;
};
