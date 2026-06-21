import { Timestamp, serverTimestamp } from "firebase/firestore";

export const serverTimestampNow = () => serverTimestamp() as Timestamp;
