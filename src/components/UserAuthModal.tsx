import { useRef, useState } from "react";
import { VerticalSpacing } from "./VerticalSpacing";
import { UserLoginForm } from "./UserLoginForm";
import { UserSignupForm } from "./UserSignupForm";

export const UserAuthModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [tabName, setTabName] = useState<"login" | "signup">("login");

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => modalRef.current?.showModal()}>
        Log in
      </button>
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box align-middle">
          <div role="tablist" className="tabs tabs-bordered">
            <a
              role="tab"
              className={`tab no-underline ${tabName === "login" ? "tab-active" : ""}`}
              onClick={() => setTabName("login")}
            >
              Log in
            </a>
            <a
              role="tab"
              className={`tab no-underline ${tabName === "signup" ? "tab-active" : ""}`}
              onClick={() => setTabName("signup")}
            >
              Sign up
            </a>
          </div>
          <VerticalSpacing />
          {tabName === "login" && <UserLoginForm />}
          {tabName === "signup" && (
            <UserSignupForm onSubmitSuccess={() => modalRef.current?.close()} />
          )}
        </div>
        <form method="dialog" className="modal-backdrop h-screen w-screen">
          <button>close</button>
        </form>
      </dialog>{" "}
    </>
  );
};
