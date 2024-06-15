import { db } from "@/firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ZodType, z } from "zod";

export async function getSafeDocFromFirestore<T extends ZodType<any, any, any>>(p: {
  id: string;
  collectionName: string;
  schema: T;
}) {
  const docRef = doc(db, p.collectionName, p.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists())
    return {
      success: false,
      status: "item_not_found",
      error: { message: `doc from ${p.collectionName} collection with id "${p.id}" not found` },
    } as const;

  const parseResponse = p.schema.safeParse({ id: p.id, ...docSnap.data() });

  return parseResponse.success
    ? ({ success: true, data: parseResponse.data as z.infer<T>, status: "success" } as const)
    : ({ ...parseResponse, status: "failed" } as const);
}
export async function getAllSafeDocsFromFirestore<T extends ZodType<any, any, any>>(p: {
  collectionName: string;
  schema: T;
}) {
  const querySnapshot = await getDocs(collection(db, p.collectionName));
  const documents = querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .map((doc) => {
      const parseResponse = p.schema.safeParse(doc);
      if (parseResponse.success) return parseResponse.data;
    })
    .filter((x) => !!x) as z.infer<typeof p.schema>[];

  return documents;
}
