import { FirestoreDataConverter, WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { BaseDocument } from "@/types/firestore";
import { serverTimestampNow } from "./timestamps";

export const genericConverter = <T extends BaseDocument>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    const { id, ...rest } = data;
    const now = serverTimestampNow();
    return {
      ...rest,
      updatedAt: now,
      createdAt: (data as any).createdAt || now,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T => {
    const data = snapshot.data(options) as T;
    return {
      ...data,
      id: snapshot.id,
    } as T;
  },
});
