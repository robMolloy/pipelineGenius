import { db } from "@/firebase-config";
import { getAllSafeDocsFromFirestore, getSafeDocFromFirestore } from "@/utils/firestoreUtils";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { z } from "zod";
import { v4 as uuid, v4 } from "uuid";

export const scriptSchema = z.object({
  id: z.string(),
  uid: z.string(),
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

export const createScriptSeedSchema = scriptSchema
  .omit({ id: true, content: true, createdAt: true, updatedAt: true })
  .merge(z.object({ content: z.string() }));

export const createScriptFormDataSchema = createScriptSeedSchema.omit({ uid: true });

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
  data: z.infer<typeof createScriptSeedSchema>;
}) {
  try {
    const initData = createScriptSeedSchema.parse(p.data);
    const data = {
      id: v4(),
      ...initData,
      content: initData.content.split("\n"),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "scripts", data.id), data); // returns undefined
    return { success: true, data } as const;
  } catch (e) {
    const error = e as ErrorEvent;
    console.error(error);

    return { success: false, error: { message: error.message } } as const;
  }
}
