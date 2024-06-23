import { CommentsForm } from "@/modules/forms/CommentsForm";
import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { Textarea } from "@/components/inputs";
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
type TScriptResponse = Awaited<ReturnType<typeof getSafeScript>>;

const { OpenDrawerWrapper, Drawer } = createDrawer({
  directionClass: "drawer-end",
  id: "right-drawer",
});

type TComment = { id: string; content: string };
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

const DisplayCommentsTree = ({ first = true, ...p }: { data: TCommentTree; first?: boolean }) => {
  const [showReplyInputIds, setShowReplyInputIds] = useState<string[]>([]);
  const [replies, setReplies] = useState<{ [key: string]: string }>({});
  return (
    <ul className={first ? "not-prose menu border-l border-white/10 p-0" : ""}>
      {p.data.map((x) => (
        <React.Fragment key={`scriptLineComment-${x.id}`}>
          <div className="text-wrap px-4 pb-0 pt-4">
            <div>{x.content}</div>
            {!showReplyInputIds.includes(x.id) && (
              <div
                className="flex justify-end"
                onClick={() => setShowReplyInputIds([...showReplyInputIds, x.id])}
              >
                <button className="btn btn-ghost btn-xs opacity-50">Click to reply</button>
              </div>
            )}
            {showReplyInputIds.includes(x.id) && (
              <>
                <Textarea
                  placeholder=""
                  heightClass="min-h-[1rem]"
                  className="mt-2"
                  value={replies[x.id] ?? ""}
                  onInput={(e) => setReplies({ ...replies, [x.id]: e })}
                />

                <div className="flex justify-end">
                  <button
                    className="btn btn-neutral btn-xs mt-2"
                    onClick={() => setReplies({ ...replies, [x.id]: "" })}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>

          {x.children && (
            <li>
              <details>
                <summary className="opacity-50">
                  <span className="">See replies</span>
                </summary>
                <DisplayCommentsTree first={false} data={x.children} />
              </details>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

const commentSchema = z.object({ id: z.string(), content: z.string() });

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
  const parseResponse = await getAllSafeDocsFromFirestore({
    collectionName: "comments",
    schema: commentSchema,
  });

  return commentsToCommentsTree(parseResponse);
};

export default function Page() {
  const router = useRouter();
  const [scriptResponse, setScriptResponse] = useState<undefined | TScriptResponse>();
  const [scriptId, setScriptId] = useState<string | undefined>();
  const [scriptLineId, setScriptLineId] = useState<number>(0);
  const [scriptLineCommentsResponse, setScriptLineCommentsResponse] = useState<
    Awaited<ReturnType<typeof getAllSafeComments>> | undefined
  >();

  const currentLineId = scriptResponse?.data?.id
    ? `${scriptResponse.data.id}_${scriptLineId}`
    : undefined;

  const scriptLineCommentTree = (scriptLineCommentsResponse ?? []).filter((x) => {
    return currentLineId ? x.id.startsWith(currentLineId) : false;
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
    setScriptLineCommentsResponse(undefined);
    getAllSafeComments().then((x) => setScriptLineCommentsResponse(x));
  }, [scriptLineId]);

  return (
    <Typography fullPage>
      {scriptResponse === undefined && <h2>Loading...</h2>}
      {scriptResponse?.status === "item_not_found" && <h2>Item not found</h2>}
      {scriptResponse?.status === "failed" && <h2>Something has gone wrong</h2>}
      {scriptResponse?.status === "success" && (
        <>
          <Drawer>
            <div>ID: {currentLineId}</div>
            <div className="rounded bg-white p-2 text-slate-600">
              {scriptResponse.data.content[scriptLineId]}
            </div>

            <h2>Comments</h2>
            {scriptLineCommentTree.length > 0 && (
              <DisplayCommentsTree data={scriptLineCommentTree} />
            )}
            {scriptLineCommentTree.length === 0 && (
              <div>Seems like there&apos;s no comments yet</div>
            )}

            <CommentsForm
              placeholder="Be the first to reply"
              onSubmit={async (e) => {
                const data = { id: `${currentLineId}_${v4()}`, content: e };
                const createCommentResponse = await createCommentFromFormData({ data });
                if (createCommentResponse.success && scriptLineCommentsResponse) {
                  setScriptLineCommentsResponse([...scriptLineCommentsResponse, data]);
                }
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
