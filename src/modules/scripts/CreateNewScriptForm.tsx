import { RadioInput, TextInput, Textarea } from "@/components/inputs";
import React, { useState } from "react";
import { z } from "zod";
import { createScriptFormDataSchema, createScriptFromFormData } from "../db";
import { useUserStore } from "@/stores/useUserStore";

export const CreateNewScriptForm = (p: { onSubmitSuccess?: () => void }) => {
  const userStore = useUserStore();
  const [formData, setFormData] = useState<z.infer<typeof createScriptFormDataSchema>>({
    language: "",
    name: "",
    content: "",
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const parseResponse = createScriptFormDataSchema.safeParse(formData);
        if (parseResponse.success && userStore.safeUser.status === "signedIn") {
          console.log({ x: userStore.safeUser.user });

          const data = { ...parseResponse.data, uid: userStore.safeUser.user.uid };
          const submitResponse = await createScriptFromFormData({ data });

          if (submitResponse.success && p.onSubmitSuccess) p.onSubmitSuccess();
        }
      }}
    >
      <RadioInput
        options={[
          { value: "yaml", label: "yaml" },
          { value: "golang", label: "golang" },
        ]}
        label="What is the script language?"
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
