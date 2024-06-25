import { db } from "@/firebase-config";
import { getAllSafeDocsFromFirestore, getSafeDocFromFirestore } from "@/utils/firestoreUtils";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const scriptSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: z.string(),
  content: z.array(z.string()),
  createdAt: z.union([
    z.object({ seconds: z.number() }).transform((x) => new Date(x.seconds * 1000)),
    z.date(),
  ]),
  updatedAt: z.union([
    z.object({ seconds: z.number() }).transform((x) => new Date(x.seconds * 1000)),
    z.date(),
  ]),
});
export const createScriptFormDataSchema = scriptSchema
  .omit({ id: true, content: true, createdAt: true, updatedAt: true })
  .merge(z.object({ content: z.string() }));

export const createScriptFromFormDataTransformationSchema = createScriptFormDataSchema.merge(
  z.object({
    id: z
      .unknown()
      .nullish()
      .transform(() => uuid()),
    content: z.string().transform((x) => x.split("\n")),
    createdAt: z
      .unknown()
      .nullish()
      .transform(() => serverTimestamp()),
    updatedAt: z
      .unknown()
      .nullish()
      .transform(() => serverTimestamp()),
  }),
);

export const getSafeScript = async (p: { id: string }) =>
  getSafeDocFromFirestore({
    id: p.id,
    collectionName: "scripts",
    schema: scriptSchema,
  });

export const getAllSafeScripts = async () =>
  getAllSafeDocsFromFirestore({ collectionName: "scripts", schema: scriptSchema });

export async function createScriptFromFormData(p: {
  data: z.infer<typeof createScriptFormDataSchema>;
}) {
  try {
    const data = createScriptFromFormDataTransformationSchema.parse(p.data);

    await setDoc(doc(db, "scripts", data.id), data); // returns undefined
    return { success: true, data } as const;
  } catch (e) {
    const error = e as ErrorEvent;
    console.error(error);

    return { success: false, error: { message: error.message } } as const;
  }
}
