export type JwtPayload = {
  email: string;
  userId: string;
  exp?: number;
  iat?: number;
};
