import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { CommentsTree } from "@/components/CommentsTree";
import { createDrawer } from "@/modules/createDrawer/createDrawer";
import { getSafeScript } from "@/modules/db";
import { commentSchema, commentsToCommentsTree, getAllSafeComments } from "@/modules/db/dbComments";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const { OpenDrawerWrapper, Drawer } = createDrawer({
  directionClass: "drawer-end",
  id: "right-drawer",
});

type TScriptResponse = Awaited<ReturnType<typeof getSafeScript>>;

export default function Page() {
  const router = useRouter();
  const [scriptResponse, setScriptResponse] = useState<undefined | TScriptResponse>();
  const [scriptId, setScriptId] = useState<string | undefined>();
  const [scriptLineId, setScriptLineId] = useState<number>();
  const [comments, setComments] = useState<z.infer<typeof commentSchema>[]>([]);

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
    setScriptLineId(undefined);
  }, [scriptId]);

  useEffect(() => {
    getAllSafeComments().then((x) => setComments(x));
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
              {scriptLineId && scriptResponse.data.content[scriptLineId]}
            </div>

            <h2>Comments</h2>

            {currentLineId && (
              <CommentsTree
                parentId={currentLineId}
                data={commentsToCommentsTree(currentLineComments)}
                onAddComment={(data) => setComments([...comments, data])}
              />
            )}
          </Drawer>
          <div className="not-prose grid grid-cols-1 gap-4">
            <div key={scriptResponse.data.id} className="card card-compact bg-base-300 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{scriptResponse.data.name}</h2>
                <OpenDrawerWrapper>
                  <CodeBlock onLineClick={(x) => setScriptLineId(x)}>
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
