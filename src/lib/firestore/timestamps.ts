
import { Timestamp } from "firebase/firestore";

export function safeFirestoreTimestamp(value: any): string | null {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return null;
}
