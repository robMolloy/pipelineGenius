import { Textarea } from "@/components/inputs";
import React, { useState } from "react";
import { useNotifyStore } from "../notify";
import { v4 } from "uuid";

export const CommentsForm = (p: {
  onSubmit: (p: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
  placeholder: string;
}) => {
  const [content, setContent] = useState("");
  const notifyStore = useNotifyStore();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const isError = content === "";
        if (!isError) p.onSubmit({ content, setContent });
        else
          notifyStore.push({
            id: v4(),
            type: "alert-error",
            text: "Your comment cannot be blank",
            duration: 3000,
          });
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
