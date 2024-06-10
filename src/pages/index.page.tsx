import { Typography } from "@/components";
import { CodeBlock } from "@/components/CodeBlock";
import { useState } from "react";

const str = `console.log(123);
`;

export const LinkData = {
  label: "Home",
  href: "/",
};

export default function Home() {
  const [count, setCount] = useState(2);
  return (
    <Typography fullPage>
      <p className="cursor-pointer font-mono hover:font-bold">
        name: Deploy to Firebase Hosting on merge
      </p>

      <button onClick={() => setCount((x) => x + 1)}>click me</button>
      <CodeBlock>{str.repeat(count)}</CodeBlock>
    </Typography>
  );
}
