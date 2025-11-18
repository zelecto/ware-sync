export interface BaseEntity {
  id: string;
  creatAt: Date;
  updateAt: Date;
  deletedAt?: Date;
}
