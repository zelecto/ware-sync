import type { Person } from "./person";

export interface User {
  personId: string;
  person: Person;
  password: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "ADMIN",
  WORKER = "WORKER",
}
