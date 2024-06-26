import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { getAllSafeScripts, scriptSchema } from "@/modules/db";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

export const LinkData = {
  label: "View Scripts",
  href: "/view-scripts",
};

export const NavLink = () => {
  const router = useRouter();

  return (
    <div
      role="link"
      onClick={() => router.push(LinkData.href)}
      className={`${router.route === LinkData.href ? "active" : ""}`}
    >
      {LinkData.label}
    </div>
  );
};

export const SideMenuLink = () => {
  const router = useRouter();

  return (
    <div
      role="link"
      onClick={() => router.push(LinkData.href)}
      className={`${router.route === LinkData.href ? "active" : ""}`}
    >
      {LinkData.label}
    </div>
  );
};

export default function Page() {
  const [safeScripts, setSafeScripts] = useState<z.infer<typeof scriptSchema>[]>([]);
  const getAndSetSafeScripts = async () => {
    setSafeScripts(await getAllSafeScripts());
  };
  useEffect(() => {
    getAndSetSafeScripts();
  }, []);
  return (
    <Typography fullPage>
      <div className="not-prose grid grid-cols-1 gap-4">
        {safeScripts.map((script) => (
          <Link
            href={`/scripts/${script.id}`}
            key={script.id}
            className="card card-compact cursor-pointer bg-base-200 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-base-300"
          >
            <div className="card-body">
              <h2 className="card-title">{script.name}</h2>
              <CodeBlock className="h-56" interactive={false}>
                {script.content.join("\n")}
              </CodeBlock>
            </div>
          </Link>
        ))}
      </div>
    </Typography>
  );
}
