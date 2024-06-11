import { Typography } from "@/components";
import { fetchSafeScript, scriptSchema } from "@/modules/db";
import { CreateNewScriptForm } from "@/modules/scripts";

import { useEffect, useState } from "react";
import { z } from "zod";

export const LinkData = {
  label: "Create New Script",
  href: "/create-new-script",
};

export default function Page() {
  const [script, setScript] = useState<z.infer<typeof scriptSchema> | undefined>(undefined);

  const getAndSetScriptById = async (p: { id: string }) => {
    const response = await fetchSafeScript({ id: p.id });
    if (response.success) setScript(response.data);
  };
  useEffect(() => {
    getAndSetScriptById({ id: "ZGdPZaTGZVOERoy86Rkp" });
  }, []);
  return (
    <Typography fullPage>
      <h1>Input</h1>
      <h2>New data</h2>
      <pre>{JSON.stringify({ script }, undefined, 2)}</pre>
      <CreateNewScriptForm
        onSubmitSuccess={(e) => console.log("success", e)}
        onSubmitFail={(e) => console.log("fail", e)}
      />
    </Typography>
  );
}
