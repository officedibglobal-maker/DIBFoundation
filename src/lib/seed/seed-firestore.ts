
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { SEED_REGISTRY } from "./seed-registry";
import type {
  SeedOptions,
  SeedResult,
  SeedRegistryEntry,
  SeedDocument,
  SchemaDocument,
} from "./seed-types";

async function seedCollection(
  db: Firestore,
  entry: SeedRegistryEntry,
  options: SeedOptions
): Promise<SeedResult> {
  const result: SeedResult = {
    collection: entry.collectionPath,
    status: "pending",
    mode: options.mode,
  };

  try {
    if (options.mode === "seed") {
      const batch = writeBatch(db);
      const documents = Array.isArray(entry.documents) ? entry.documents : [];

      if (entry.supportsContentSeed && documents.length > 0) {
        documents.forEach((item: SeedDocument) => {
          const docRef = doc(db, entry.collectionPath, item._id);
          batch.set(docRef, { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
        });
        result.count = documents.length;
      } else if (entry.supportsSchemaSeed) {
        const schemaDoc: SchemaDocument = {
          isSystem: true,
          recordType: "schema",
          description: `Schema definition for the ${entry.label} collection.`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        batch.set(doc(db, entry.collectionPath, "_schema"), schemaDoc);
        result.count = 1;
        result.status = "schema-created";
        result.message = `Created _schema document; no fake ${entry.label.toLowerCase()} records were seeded.`;
      }
      await batch.commit();
    }

    if (result.status === "pending") {
      result.status = "success";
      if (!result.count) {
        const documents = Array.isArray(entry.documents) ? entry.documents : [];
        result.count = documents.length;
      }
    }
  } catch (e: any) {
    result.status = "error";
    result.error = e.message || "Unknown error";
  }
  return result;
}

async function seedSubcollections(
  db: Firestore,
  parentEntry: SeedRegistryEntry,
  options: SeedOptions
): Promise<SeedResult[]> {
  const results: SeedResult[] = [];
  if (!parentEntry.subcollections || !Array.isArray(parentEntry.documents)) return results;

  for (const subcollectionDef of parentEntry.subcollections) {
    for (const parentDoc of parentEntry.documents) {
      const subcollectionPath = `${parentEntry.collectionPath}/${parentDoc._id}/${subcollectionDef.collectionPath}`;
      const subcollectionDocs = subcollectionDef.documents(parentDoc);
      if (subcollectionDocs.length > 0) {
        const subcollectionResult: SeedResult = {
          collection: subcollectionPath,
          status: "pending",
          mode: options.mode,
          count: subcollectionDocs.length,
        };

        try {
          if (options.mode === "seed") {
            const batch = writeBatch(db);
            subcollectionDocs.forEach((docData) => {
              const docRef = doc(db, subcollectionPath, docData._id);
              batch.set(docRef, { ...docData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
            });
            await batch.commit();
          }
          subcollectionResult.status = "success";
          results.push(subcollectionResult);
        } catch (e: any) {
          subcollectionResult.status = "error";
          subcollectionResult.error = e.message || "Unknown error";
          results.push(subcollectionResult);
        }
      }
    }
  }
  return results;
}

export async function seedFirestore(
  db: Firestore,
  options: SeedOptions
): Promise<SeedResult[]> {
  const { collection: collectionKey } = options;
  const results: SeedResult[] = [];

  const entriesToSeed = collectionKey
    ? SEED_REGISTRY.filter((entry) => entry.key === collectionKey)
    : SEED_REGISTRY;

  for (const entry of entriesToSeed) {
    const collectionResult = await seedCollection(db, entry, options);
    results.push(collectionResult);
    if (collectionResult.status !== "error") {
      const subcollectionResults = await seedSubcollections(db, entry, options);
      results.push(...subcollectionResults);
    }
  }

  return results;
}
