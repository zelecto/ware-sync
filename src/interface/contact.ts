import type { BaseEntity } from "./base-entity";
import type { Person } from "./person";

export interface Contact extends BaseEntity {
  personId: string;
  person: Person;
  type: ContactType;
}

export enum ContactType {
  PROVIDER = "PROVIDER",
}
