import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { Textarea } from "@/components/inputs";
import { getSafeScript } from "@/modules/db";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { z } from "zod";
const schema = z.string();
type TScriptResponse = Awaited<ReturnType<typeof getSafeScript>>;

const OpenDrawerWrapper = (p: { children: React.ReactNode }) => (
  <label htmlFor="my-drawer-4">{p.children}</label>
);

const CloseDrawerWrapper = (p: { children?: React.ReactNode }) => (
  <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay opacity-0">
    {p.children}
  </label>
);
const DrawerOverlay = (p: { children?: React.ReactNode }) => (
  <div className="drawer-side z-[11]">{p.children}</div>
);
const Drawer = (p: { children?: React.ReactNode }) => (
  <div className="min-h-full w-96 max-w-[400px] bg-base-200 p-4 text-base-content">
    {p.children}
  </div>
);

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

type TComment = {
  id: string;
  content: string;
  parent: string;
};

type TCommentTree = (TComment & { children: undefined | TCommentTree })[];

const mockComplexComments: TComment[] = [
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
    content: "this is the first comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3",
    content: "this is the third comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4",
    content: "this is the fourth comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id6",
    content: "this is the 6th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id3_id4_id7",
    content: "this is the 7th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1_id5",
    content: "this is the 5th comment",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id2",
    content:
      "this is the second comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
  },
  {
    id: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id8",
    content:
      "this is the 8th comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "",
  },
];

/*
const mockCommentTree: TCommentTree = [
  {
    id: "id1",
    content: "this is the first comment",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: [
      {
        id: "id3",
        content: "this is the third comment",
        parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
        children: undefined,
      },
      {
        id: "id4",
        content: "this is the fourth comment",
        parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
        children: [
          {
            id: "id6",
            content: "this is the 6th comment",
            parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
            children: undefined,
          },
          {
            id: "id7",
            content: "this is the 7th comment",
            parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
            children: undefined,
          },
        ],
      },
      {
        id: "id5",
        content: "this is the 5th comment",
        parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15_id1",
        children: undefined,
      },
    ],
  },
  {
    id: "id2",
    content:
      "this is the second comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
  {
    id: "id8",
    content:
      "this is the 8th comment, wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot. wow haven't they said a lot.",
    parent: "2f41e604-65e7-4590-94f3-1f6a50d28c84_15",
    children: undefined,
  },
];
*/
const commentsToCommentsTree = (initComments: TComment[]) => {
  const comments = cloneDeep(initComments) as typeof initComments;
  const commentsTree: TCommentTree = [];

  const sortedComments = comments.sort((a, b) => (a.id > b.id ? 1 : -1));
  const commentTreeComments = sortedComments.map((x) => ({
    ...x,
    children: undefined as TCommentTree | undefined,
  }));

  commentTreeComments.forEach((comment) => {
    const parentId = comment.id.split("_").slice(0, -1).join("_");
    const parent = commentTreeComments.find((x) => x.id === parentId);
    if (!parent) return commentsTree.push(comment);

    // parent.children = parent.children === undefined ? [comment] : [...parent.children, comment]
    if (parent.children === undefined) parent.children = [comment];
    else parent.children.push(comment);
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
          <div className="px-4">
            <div>{x.content}</div>
            {!showReplyInputIds.includes(x.id) && (
              <div
                className="flex justify-end"
                onClick={() => setShowReplyInputIds([...showReplyInputIds, x.id])}
              >
                <button className="btn btn-ghost btn-sm opacity-50">Click to reply</button>
              </div>
            )}
            {showReplyInputIds.includes(x.id) && (
              <div>
                <Textarea
                  placeholder=""
                  heightClass="min-h-[1rem]"
                  value={replies[x.id] ?? ""}
                  onInput={(e) => setReplies({ ...replies, [x.id]: e })}
                />

                <div className="flex justify-end">
                  <button
                    className="btn btn-sm mt-1"
                    onClick={() => setReplies({ ...replies, [x.id]: "" })}
                  >
                    Submit
                  </button>
                </div>
              </div>
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
          <div className="h-[1rem]"></div>
        </React.Fragment>
      ))}
    </ul>
  );
};

const getSafeScriptComments = async (): Promise<
  { success: true; status: "success"; data: TCommentTree } | { success: false; status: "error" }
> => {
  await delay(450);
  if (Math.random() > 0.05)
    return {
      success: true,
      status: "success",
      data: commentsToCommentsTree(mockComplexComments),
    };
  return { success: false, status: "error" };
};

export default function Page() {
  const router = useRouter();
  const [scriptResponse, setScriptResponse] = useState<undefined | TScriptResponse>();
  const [scriptLineId, setScriptLineId] = useState<number>(0);
  const [scriptLineCommentsResponse, setScriptLineCommentsResponse] = useState<
    Awaited<ReturnType<typeof getSafeScriptComments>> | undefined
  >();

  useEffect(() => {
    const scriptIdParseResponse = schema.safeParse(router.query.scriptId);
    if (scriptIdParseResponse.success) {
      const scriptId = scriptIdParseResponse.data;
      getSafeScript({ id: scriptId }).then((x) => setScriptResponse(x));
      setScriptLineId(0);
    }
  }, [router.query]);

  useEffect(() => {
    setScriptLineCommentsResponse(undefined);
    getSafeScriptComments().then((x) => setScriptLineCommentsResponse(x));
  }, [scriptLineId]);

  return (
    <Typography fullPage>
      {scriptResponse === undefined && <h2>Loading...</h2>}
      {scriptResponse?.status === "item_not_found" && <h2>Item not found</h2>}
      {scriptResponse?.status === "failed" && <h2>Something has gone wrong</h2>}
      {scriptResponse?.status === "success" && (
        <>
          <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <DrawerOverlay>
              <CloseDrawerWrapper />
              <Drawer>
                <div>
                  ID: {scriptResponse.data.id}_{scriptLineId}
                </div>
                <div className="rounded bg-white p-2 text-slate-600">
                  {scriptResponse.data.content[scriptLineId]}
                </div>

                {scriptLineCommentsResponse === undefined && <div>Loading...</div>}
                {scriptLineCommentsResponse?.status === "error" && <div>Something went wrong!</div>}
                {scriptLineCommentsResponse?.status === "success" && (
                  <>
                    <h2>Comments</h2>
                    <DisplayCommentsTree data={scriptLineCommentsResponse.data} />
                  </>
                )}
              </Drawer>
            </DrawerOverlay>
          </div>
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
