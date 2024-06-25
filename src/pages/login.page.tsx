import { TPageLink } from "@/modules/layout";

export const LinkData: TPageLink = {
  label: "Log In",
  href: "/login",
  alwaysShow: true,
  horizontalClassName: "btn btn-primary",
};

export default function Page() {
  return <div>login.page</div>;
}
