import type { FieldValue } from "firebase/firestore";

export interface SeedOptions {
  mode: "dry-run" | "seed";
  collection?: string;
  overwrite?: boolean;
}

export interface SeedResult {
  collection: string;
  status: "pending" | "success" | "error" | "schema-created";
  mode: "dry-run" | "seed";
  count?: number;
  error?: string;
  message?: string;
}

export interface SeedDocument {
  _id: string;
  [key: string]: any;
}

export interface SeedSubcollectionDefinition {
  collectionPath: string;
  documents: (parentDoc: SeedDocument) => SeedDocument[];
}

export interface SeedRegistryEntry {
  key: string;
  collectionPath: string;
  category: string;
  label: string;
  supportsContentSeed: boolean;
  supportsSchemaSeed: boolean;
  documents: SeedDocument[];
  subcollections?: SeedSubcollectionDefinition[];
}

export interface SchemaDocument {
  isSystem: true;
  recordType: "schema";
  description: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}