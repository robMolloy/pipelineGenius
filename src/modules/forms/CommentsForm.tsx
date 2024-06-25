import { Textarea } from "@/components/inputs";
import React, { useState } from "react";
import { useNotifyStore } from "../notify";
import { v4 } from "uuid";

export const CommentsForm = (p: { onSubmit: (str: string) => void; placeholder: string }) => {
  const [content, setContent] = useState("");
  const notifyStore = useNotifyStore();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log({ content });

        if (content === "")
          return notifyStore.push({
            id: v4(),
            type: "alert-warning",
            text: "Something has gone wrong - your form seems to be blank",
            duration: 3000,
          });
        p.onSubmit(content);
        setContent("");
      }}
    >
      <Textarea
        value={content}
        onInput={(e) => setContent(e)}
        placeholder={p.placeholder}
        heightClass="min-h-[1rem]"
      />
      <div className="flex justify-end">
        <button className="btn btn-neutral btn-xs mt-2" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
