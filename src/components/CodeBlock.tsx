import hljs from "highlight.js";
import { useEffect, useRef, useState } from "react";

export type TCodeBlockProps = {
  children: string;
  language?: "typescript" | "golang" | "yaml";
};

export const CodeBlock = ({ children, language = "yaml" }: TCodeBlockProps) => {
  const htmlCodeElmRef = useRef<HTMLDivElement>(null);

  const [escapedHtml, setEscapedHtml] = useState("");

  useEffect(() => {
    const rtn = children;
    setEscapedHtml(rtn);
  }, [children]);

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
      <pre className="relative border-2 p-0">
        <span className="absolute right-0 top-0">
          <button
            className="btn btn-ghost bg-white opacity-70"
            onClick={() => navigator.clipboard.writeText(children)}
          >
            copy
          </button>
        </span>

        <code ref={htmlCodeElmRef} className="hljs overflow-x-scroll">
          {escapedHtml.split(`\n`).map((x, j) => (
            <code
              key={`whatever-${j}`}
              className={`language-${language} overflow-none block cursor-pointer rounded-box font-mono hover:bg-slate-300 hover:font-bold`}
              style={{ padding: "0 8px", borderRadius: "4px", overflow: "unset" }}
            >
              {x}
            </code>
          ))}
        </code>
      </pre>
    </>
  );
};
