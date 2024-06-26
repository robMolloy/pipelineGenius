import { db } from "@/firebase-config";
import { getAllSafeDocsFromFirestore } from "@/utils";
import { doc, setDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { z } from "zod";

export const commentSchema = z.object({ id: z.string(), content: z.string(), uid: z.string() });
type TComment = z.infer<typeof commentSchema>;
type TCommentTree = (TComment & { children?: undefined | TCommentTree })[];

export const getAllSafeComments = async () => {
  return getAllSafeDocsFromFirestore({
    collectionName: "comments",
    schema: commentSchema,
  });
};

export async function createCommentFromFormData(p: { data: z.infer<typeof commentSchema> }) {
  try {
    await setDoc(doc(db, "comments", p.data.id), p.data); // returns undefined
    return { success: true, data: p.data } as const;
  } catch (e) {
    const error = e as ErrorEvent;
    console.error(error);

    return { success: false, error: { message: error.message } } as const;
  }
}

export const commentsToCommentsTree = (initComments: TComment[]) => {
  const commentsTree: TCommentTree = [];
  const sortedComments = cloneDeep(initComments).sort((a, b) =>
    a.id > b.id ? 1 : -1,
  ) as TCommentTree;

  sortedComments.forEach((comment) => {
    const parentId = comment.id.split("_").slice(0, -1).join("_");
    const parent = sortedComments.find((x) => x.id === parentId);
    if (!parent) return commentsTree.push(comment);

    parent.children = parent.children === undefined ? [comment] : [...parent.children, comment];
  });

  return commentsTree;
};
