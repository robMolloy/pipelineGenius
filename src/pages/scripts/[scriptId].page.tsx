import { CommentsForm } from "@/modules/forms/CommentsForm";
import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { db } from "@/firebase-config";
import { getSafeScript } from "@/modules/db";
import { getAllSafeDocsFromFirestore } from "@/utils";
import { doc, setDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { z } from "zod";
import { createDrawer } from "@/modules/createDrawer/createDrawer";
import { CommentsTree } from "@/components/CommentsTree";
type TScriptResponse = Awaited<ReturnType<typeof getSafeScript>>;

const { OpenDrawerWrapper, Drawer } = createDrawer({
  directionClass: "drawer-end",
  id: "right-drawer",
});

const commentSchema = z.object({ id: z.string(), content: z.string() });
type TComment = z.infer<typeof commentSchema>;
type TCommentTree = (TComment & { children?: undefined | TCommentTree })[];

const commentsToCommentsTree = (initComments: TComment[]) => {
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

export const getAllSafeComments = async () => {
  return getAllSafeDocsFromFirestore({
    collectionName: "comments",
    schema: commentSchema,
  });
};

export default function Page() {
  const router = useRouter();
  const [scriptResponse, setScriptResponse] = useState<undefined | TScriptResponse>();
  const [scriptId, setScriptId] = useState<string | undefined>();
  const [scriptLineId, setScriptLineId] = useState<number>(0);
  const [comments, setComments] = useState<TComment[]>([]);

  const currentLineId = scriptResponse?.data?.id
    ? `${scriptResponse.data.id}_${scriptLineId}`
    : undefined;

  const currentLineComments = comments.filter((comment) => {
    return currentLineId ? comment.id.startsWith(currentLineId) : false;
  });

  useEffect(() => {
    const scriptIdParseResponse = z.string().safeParse(router.query.scriptId);
    if (scriptIdParseResponse.success) setScriptId(scriptIdParseResponse.data);
  }, [router.query]);

  useEffect(() => {
    if (!scriptId) return;
    getSafeScript({ id: scriptId }).then((x) => setScriptResponse(x));
    setScriptLineId(0);
  }, [scriptId]);

  useEffect(() => {
    getAllSafeComments().then((x) => {
      if (x) setComments(x);
    });
  }, [scriptLineId]);

  return (
    <Typography fullPage>
      {scriptResponse === undefined && <h2>Loading...</h2>}
      {scriptResponse?.status === "item_not_found" && <h2>Item not found</h2>}
      {scriptResponse?.status === "failed" && <h2>Something has gone wrong</h2>}
      {scriptResponse?.status === "success" && (
        <>
          <Drawer>
            <div className="rounded bg-white p-2 text-slate-600">
              {scriptResponse.data.content[scriptLineId]}
            </div>

            <h2>Comments</h2>
            {currentLineComments.length === 0 && <div>Seems like there's no comments yet</div>}
            {currentLineComments.length > 0 && (
              <CommentsTree
                data={commentsToCommentsTree(currentLineComments)}
                onAddComment={(data) => setComments([...comments, data])}
              />
            )}

            <CommentsForm
              placeholder={comments.length === 0 ? "Be the first to reply" : "Reply..."}
              onSubmit={async (e) => {
                const data = { id: `${currentLineId}_${v4()}`, content: e };
                const createCommentResponse = await createCommentFromFormData({ data });

                if (createCommentResponse.success) setComments([...comments, data]);
              }}
            />
          </Drawer>
          <div className="not-prose grid grid-cols-1 gap-4">
            <div key={scriptResponse.data.id} className="card card-compact bg-base-300 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{scriptResponse.data.name}</h2>
                <OpenDrawerWrapper>
                  <CodeBlock
                    onLineClick={(x) => {
                      setScriptLineId(x);
                      console.log({ x });
                    }}
                  >
                    {scriptResponse.data.content.join("\n")}
                  </CodeBlock>
                </OpenDrawerWrapper>
              </div>
            </div>
          </div>
        </>
      )}
    </Typography>
  );
}
