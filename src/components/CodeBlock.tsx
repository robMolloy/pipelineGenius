import hljs from "highlight.js";
import { useEffect, useRef, useState } from "react";
import xss from "xss";

export type TCodeBlockProps = {
  children: string;
  language?: "typescript" | "golang" | "go" | "yaml";
};

export const CodeBlock = ({ children, language = "yaml" }: TCodeBlockProps) => {
  const htmlCodeElmRef = useRef<HTMLElement>(null);

  const [escapedHtml, setEscapedHtml] = useState(xss(children));

  useEffect(() => setEscapedHtml(xss(children)), [children]);
  useEffect(() => {
    if (htmlCodeElmRef.current) {
      htmlCodeElmRef.current.setAttribute("data-highlighted", "");
      hljs.highlightElement(htmlCodeElmRef.current);
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

        <code ref={htmlCodeElmRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </>
  );
};
