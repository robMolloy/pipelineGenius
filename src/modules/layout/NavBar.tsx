import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeSelector } from "../themeSelector";

const BurgerMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="inline-block h-6 w-6 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);

const NavBarDropdown = (p: {
  children: React.ReactNode;
  label: string;
  positionClass?: "dropdown-start" | "dropdown-end";
}) => {
  const { positionClass = "dropdown-start" } = p;
  return (
    <div className={`${positionClass} dropdown dropdown-bottom`}>
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <div>{p.label} &#x25BC;</div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] mt-1 rounded-box border bg-base-100 p-0 shadow"
        style={{ opacity: "0.94" }}
      >
        <div className="max-h-[75vh] overflow-y-scroll rounded-box">
          {p.children}
        </div>
      </div>
    </div>
  );
};

function useFlicker<T>(x: T) {
  const [show, setShow] = useState(true);
  useEffect(() => setShow(false), [x]);
  useEffect(() => {
    if (!show) setShow(true);
  }, [show]);

  return { show };
}

export type TNavbarProps = {
  OpenDrawerWrapper: React.FC<{ children: React.ReactNode }>;
};

export const NavBar = (p: TNavbarProps) => {
  const router = useRouter();
  const { show: showTabsInBar } = useFlicker(router.route);
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="block sm:hidden">
          <p.OpenDrawerWrapper>
            <BurgerMenuIcon />
          </p.OpenDrawerWrapper>
        </div>

        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Pricing Penguin
          </Link>
        </div>
        <div className="flex gap-4">
          <NavBarDropdown label="Themes" positionClass="dropdown-end">
            <div className="m-2 max-h-full">
              <ThemeSelector />
            </div>
          </NavBarDropdown>
        </div>
      </div>
      <div className="hidden w-full gap-4 sm:flex">
        <Link className="hover:underline" href={"/"}>
          Home
        </Link>
        {showTabsInBar && (
          <>
            <NavBarDropdown label="Themes">
              <div className="p-2">
                <div className="overflow-scroll">
                  <ThemeSelector />
                </div>
              </div>
            </NavBarDropdown>
          </>
        )}
        <button className="btn opacity-0" disabled></button>
      </div>
    </div>
  );
};
