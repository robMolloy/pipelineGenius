import { UserAuthModal } from "@/components/UserAuthModal";
import { auth } from "@/firebase-config";
import {
  NavLink as CreateNewScriptNavLink,
  SideMenuLink as CreateNewScriptSideMenuLink,
} from "@/pages/create-new-script.page";
import { NavLink as HomeNavLink, SideMenuLink as HomeSideMenuLink } from "@/pages/index.page";
import {
  NavLink as ViewScriptsNavLink,
  SideMenuLink as ViewScriptsSideMenuLink,
} from "@/pages/view-scripts.page";
import { useUserStore } from "@/stores/useUserStore";
import { signOut } from "firebase/auth";
import { NavBar } from "./NavBar";

export type TPageLink = {
  label: string;
  href: string;
  alwaysShow?: true;
  horizontalClassName?: string;
};

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
    <div className="sticky top-0 z-[10]">
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
  const userStore = useUserStore();

  return (
    <>
      <div className="drawer">
        <input id="sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <NavBarContainer>
            <NavBar OpenDrawerWrapper={OpenDrawerWrapper}>
              <ul className="menu menu-horizontal items-center gap-2">
                <li className="hidden sm:block">
                  <HomeNavLink />
                </li>
                <li className="hidden sm:block">
                  <ViewScriptsNavLink />
                </li>
                {userStore.safeUser.status === "signedIn" && (
                  <li className="hidden sm:block">
                    <CreateNewScriptNavLink />
                  </li>
                )}
              </ul>

              {userStore.safeUser.status === "signedOut" && <UserAuthModal />}
              {userStore.safeUser.status === "signedIn" && (
                <button className="btn btn-sm" onClick={() => signOut(auth)}>
                  Sign out
                </button>
              )}
            </NavBar>
          </NavBarContainer>
          <ContainerWithSpotlightBackgroundTop>{p.children}</ContainerWithSpotlightBackgroundTop>
        </div>
        <div className="drawer-side z-[11]">
          <CloseDrawerWrapper />

          <DrawerContainer>
            <CloseDrawerWrapper>
              <ul className="menu">
                <li>
                  <HomeSideMenuLink />
                </li>
                <li>
                  <ViewScriptsSideMenuLink />
                </li>
                {userStore.safeUser.status === "signedIn" && (
                  <li>
                    <CreateNewScriptSideMenuLink />
                  </li>
                )}
              </ul>
            </CloseDrawerWrapper>
          </DrawerContainer>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};
