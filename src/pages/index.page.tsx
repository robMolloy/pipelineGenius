import { Typography } from "@/components";
import { useRouter } from "next/router";

export const LinkData = {
  label: "Home",
  href: "/",
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

export default function Home() {
  return (
    <Typography fullPage>
      <h1>welcome 12</h1>
    </Typography>
  );
}
