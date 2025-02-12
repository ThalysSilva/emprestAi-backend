export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string;
  };
}
