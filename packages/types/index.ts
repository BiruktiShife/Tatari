export interface IUser {
  id: string;
  email: string;
  role: "CLIENT" | "SP" | "ADMIN";
}

export interface IJob {
  id: string;
  title: string;
  description: string;
}
