import { Footer } from "./Footer";
import { NavBar } from "./NavBar";
import { LinkData as HomeLinkData } from "@/pages/index.page";
import { LinkData as InputLinkData } from "@/pages/create-new-script.page";
import { LinkData as Home2LinkData } from "@/pages/view-scripts.page";
import { useRouter } from "next/router";

const pageLinks = [HomeLinkData, Home2LinkData, InputLinkData];

const CloseDrawerWrapper: React.FC<{ children?: React.ReactNode }> = (p) => {
  return (
    <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay">
      {p.children}
    </label>
  );
};
const OpenDrawerWrapper: React.FC<{ children?: React.ReactNode }> = (p) => {
  return (
    <label htmlFor="sidebar" aria-label="open sidebar" className="btn btn-square btn-ghost">
      {p.children}
    </label>
  );
};

const NavBarContainer = (p: { children: React.ReactNode }) => {
  return (
    <div className="sticky top-0 z-[98]">
      <div className="navbar w-full border-b bg-base-300">{p.children}</div>
    </div>
  );
};
const DrawerContainer = (p: { children: React.ReactNode }) => {
  return <div className="m-0 min-h-full min-w-80 border-r bg-base-100 p-1">{p.children}</div>;
};

const ContainerWithSpotlightBackgroundTop = (p: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-[50vh]">
      <div className="absolute top-0 z-[-1] min-h-[90vh] min-w-full bg-gradient-to-tr from-base-100 via-base-100 via-75% to-primary sm:via-65%"></div>
      {p.children}
    </div>
  );
};

const DisplayLinks = (p: { horizontal?: boolean }) => {
  const router = useRouter();

  return (
    <ul className={`menu ${p.horizontal ? "menu-horizontal gap-2" : ""}`}>
      {pageLinks.map((x) => (
        <li key={`${x.href}-navLink`}>
          <div
            role="link"
            onClick={() => router.push(x.href)}
            className={`${x.href === router.route ? "active" : ""}`}
          >
            {x.label}
          </div>
        </li>
      ))}
    </ul>
  );
};

export const Layout = (p: { children: React.ReactNode }) => {
  return (
    <>
      <div className="drawer">
        <input id="sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <NavBarContainer>
            <NavBar OpenDrawerWrapper={OpenDrawerWrapper}>
              <DisplayLinks horizontal />
            </NavBar>
          </NavBarContainer>
          <ContainerWithSpotlightBackgroundTop>{p.children}</ContainerWithSpotlightBackgroundTop>
        </div>
        <div className="drawer-side z-[99]">
          <CloseDrawerWrapper />

          <DrawerContainer>
            <CloseDrawerWrapper>
              <DisplayLinks />
            </CloseDrawerWrapper>
          </DrawerContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};
