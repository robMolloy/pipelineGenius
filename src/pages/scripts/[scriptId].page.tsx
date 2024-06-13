import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { getSafeScript } from "@/modules/db";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
const schema = z.string();
type TScriptResponse = Awaited<ReturnType<typeof getSafeScript>>;

export default function Page() {
  const router = useRouter();
  const [scriptResponse, setScriptResponse] = useState<undefined | TScriptResponse>();

  useEffect(() => {
    const scriptIdParseResponse = schema.safeParse(router.query.scriptId);
    if (scriptIdParseResponse.success)
      getSafeScript({ id: scriptIdParseResponse.data }).then((x) => setScriptResponse(x));
  }, [router.query]);

  return (
    <Typography fullPage>
      {scriptResponse?.status === "item_not_found" && <h2>Item not found</h2>}
      {scriptResponse?.status === "failed" && <h2>Something has gone wrong</h2>}
      {scriptResponse?.status === "success" && (
        <div className="not-prose grid grid-cols-1 gap-4 md:grid-cols-2">
          <div key={scriptResponse.data.id} className="card card-compact bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{scriptResponse.data.name}</h2>
              <CodeBlock
                onLineClick={(x) => {
                  console.log({
                    x,
                    NEXT_PUBLIC_FIREBASE_apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
                  });
                }}
              >
                {scriptResponse.data.content.join("\n")}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}
    </Typography>
  );
}
