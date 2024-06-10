import { Footer } from "./Footer";
import { NavBar } from "./NavBar";
import { LinkData as HomeLinkData } from "@/pages";
import { LinkData as Home2LinkData } from "@/pages/home2";
import { useRouter } from "next/router";

const pageLinks = [HomeLinkData, Home2LinkData];

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

export const Layout = (p: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <div className="drawer">
        <input id="sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <NavBarContainer>
            <NavBar OpenDrawerWrapper={OpenDrawerWrapper}>
              <ul className="menu menu-horizontal">
                {pageLinks.map((x) => (
                  <li key={`${x.href}-navLink`}>
                    <div role="link" onClick={() => router.push(x.href)}>
                      {x.label}
                    </div>
                  </li>
                ))}
                {/* <li>
                  <a href="#get-in-touch-form" className="btn btn-primary btn-sm">
                    Get in touch
                  </a>
                </li> */}
              </ul>
            </NavBar>
          </NavBarContainer>
          <ContainerWithSpotlightBackgroundTop>{p.children}</ContainerWithSpotlightBackgroundTop>
        </div>
        <div className="drawer-side z-[99]">
          <CloseDrawerWrapper />

          <DrawerContainer>
            <div className="menu">
              <CloseDrawerWrapper>
                <ul>
                  {pageLinks.map((x) => (
                    <li key={`${x.href}-drawerLink`}>
                      <div role="link" onClick={() => router.push(x.href)}>
                        {x.label}
                      </div>
                    </li>
                  ))}
                </ul>
              </CloseDrawerWrapper>
            </div>
          </DrawerContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};
