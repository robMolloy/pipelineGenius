import { Textarea } from "@/components/inputs";
import React, { useState } from "react";

export const CommentsForm = (p: { onSubmit: (str: string) => void; placeholder: string }) => {
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
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
