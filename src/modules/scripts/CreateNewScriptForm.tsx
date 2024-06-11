import { RadioInput, TextInput, Textarea } from "@/components/inputs";
import React, { useState } from "react";
import { z } from "zod";
import { scriptFormDataSchema, scriptSchema } from "../db";

type TScript = z.infer<typeof scriptSchema>;

export type TCreateNewScriptFormProps = {
  children: React.ReactNode;
};

export const CreateNewScriptForm = (p: {
  onSubmitSuccess: (data: TScript) => void;
  onSubmitFail: (data: TScript) => void;
}) => {
  const [formData, setFormData] = useState<z.infer<typeof scriptFormDataSchema>>({
    language: "",
    name: "",
    content: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const script = { ...formData, content: formData.content.split("\n") } as TScript;
        const parseResponse = scriptSchema.safeParse(script);
        if (parseResponse.success) p.onSubmitSuccess(script);
        else p.onSubmitFail(script);
      }}
    >
      <RadioInput
        options={[
          { value: "yaml", label: "yaml" },
          { value: "golang", label: "golang" },
        ]}
        value={formData.language}
        onSelect={(x) => setFormData({ ...formData, language: x })}
      />
      <br />
      <TextInput
        value={formData.name}
        onInput={(x) => setFormData({ ...formData, name: x })}
        label="What is the script name?"
        placeholder="Script name"
      />
      <br />
      <Textarea
        value={formData.content}
        onInput={(x) => setFormData({ ...formData, content: x })}
        label="What is the script content?"
        placeholder={"Script content"}
      />
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};
