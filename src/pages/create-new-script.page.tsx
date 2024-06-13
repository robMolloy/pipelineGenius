import { Typography } from "@/components";
import { CreateNewScriptForm } from "@/modules/scripts";

export const LinkData = {
  label: "Create New Script",
  href: "/create-new-script",
};

export default function Page() {
  return (
    <Typography fullPage>
      <h1>Create New Script</h1>
      <CreateNewScriptForm />
    </Typography>
  );
}
