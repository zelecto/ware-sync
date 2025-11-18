import type { BaseEntity } from "./base-entity";
import type { Contact } from "./contact";
import type { User } from "./user";

export interface Person extends BaseEntity {
  fullName: string;
  cedula: string;
  phone: string;
  email?: string;
  address?: string;
  user?: User;
  contact?: Contact;
}
