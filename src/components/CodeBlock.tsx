import hljs from "highlight.js";
import { useEffect, useRef, useState } from "react";

export type TCodeBlockProps = {
  children: string;
  language?: "typescript" | "golang" | "yaml";
  interactive?: boolean;
  className?: HTMLElement["className"];
  onLineClick?: (j: number) => void;
};

export const CodeBlock = ({ language = "yaml", interactive = true, ...p }: TCodeBlockProps) => {
  const htmlCodeElmRef = useRef<HTMLDivElement>(null);

  const [escapedHtml, setEscapedHtml] = useState("");

  useEffect(() => {
    const rtn = p.children;
    setEscapedHtml(rtn);
  }, [p.children]);

  useEffect(() => {
    if (htmlCodeElmRef.current) {
      const codeElms = Array.from(htmlCodeElmRef.current.querySelectorAll("*")) as HTMLElement[];
      codeElms.forEach((codeElm) => {
        codeElm.setAttribute("data-highlighted", "");
        hljs.highlightElement(codeElm);
      });
    }
  }, [escapedHtml]);

  return (
    <>
      <pre className="relative rounded border-2 p-0">
        <span className="absolute right-0 top-0">
          <button
            className="btn btn-ghost bg-white text-slate-600 opacity-70"
            onClick={() => navigator.clipboard.writeText(p.children)}
          >
            copy
          </button>
        </span>

        <code ref={htmlCodeElmRef} className={`hljs overflow-x-scroll ${p.className}`}>
          {escapedHtml.split(`\n`).map((x, j) => (
            <code
              key={`whatever-${j}`}
              className={`language-${language} overflow-none block rounded-box font-mono ${interactive ? "cursor-pointer hover:bg-slate-300 hover:font-bold" : ""} `}
              style={{ padding: "0 8px", borderRadius: "4px", overflow: "unset" }}
              onClick={() => {
                if (p.onLineClick) p.onLineClick(j);
              }}
            >
              {x}
            </code>
          ))}
        </code>
      </pre>
    </>
  );
};
