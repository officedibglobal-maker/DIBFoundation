import { FieldValue, Timestamp } from "firebase/firestore";

export type InitiativeStatus = "draft" | "published";

export interface Initiative {
  docId: string;
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  order: number;
  status: InitiativeStatus;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}
