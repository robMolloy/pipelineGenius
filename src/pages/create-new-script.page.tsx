import { Typography } from "@/components";
import { CreateNewScriptForm } from "@/modules/scripts";
import { useRouter } from "next/router";
import { LinkData as ViewScriptsLinkData } from "@/pages/view-scripts.page";
import { useNotifyStore } from "@/modules/notify";
import { v4 as uuid } from "uuid";

export const LinkData = {
  label: "Create New Script",
  href: "/create-new-script",
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
  const router = useRouter();
  const notifyStore = useNotifyStore();
  return (
    <Typography fullPage>
      <h1>Create New Script</h1>

      <CreateNewScriptForm
        onSubmitSuccess={() => {
          notifyStore.push({
            id: uuid(),
            type: "alert-success",
            text: "New script submitted successfully",
            duration: 4000,
          });
          router.push(ViewScriptsLinkData.href);
        }}
      />
    </Typography>
  );
}
