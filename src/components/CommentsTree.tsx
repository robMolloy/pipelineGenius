import { createCommentFromFormData } from "@/modules/db/dbComments";
import { CommentsForm } from "@/modules/forms/CommentsForm";
import React, { useState } from "react";
import { v4 } from "uuid";
import { z } from "zod";

const commentSchema = z.object({ id: z.string(), content: z.string() });
type TComment = z.infer<typeof commentSchema>;
type TCommentTree = (TComment & { children?: undefined | TCommentTree })[];

export const CommentsTree = (p: {
  data: TCommentTree;
  first?: boolean;
  onAddComment: (p: TComment) => void;
}) => {
  const { first = true } = p;
  const [showReplyInputIds, setShowReplyInputIds] = useState<string[]>([]);

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
              <CommentsForm
                placeholder="Reply..."
                onSubmit={async (e) => {
                  const data = { id: `${x.id}_${v4()}`, content: e };
                  const createCommentResponse = await createCommentFromFormData({ data });
                  if (createCommentResponse.success && p.onAddComment)
                    p.onAddComment(createCommentResponse.data);
                }}
              />
            )}
          </div>

          {x.children && (
            <li>
              <details>
                <summary className="opacity-50">
                  <span className="">See replies</span>
                </summary>
                <CommentsTree
                  first={false}
                  data={x.children}
                  onAddComment={(data) => {
                    if (p.onAddComment) p.onAddComment(data);
                  }}
                />
              </details>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};
