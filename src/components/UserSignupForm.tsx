import { useNotifyStore } from "@/modules/notify";
import { createFirebaseUser } from "@/utils/firebaseAuthUtils";
import { useState } from "react";
import { v4 } from "uuid";
import { VerticalSpacing } from "./VerticalSpacing";
import { TextInput } from "./inputs";

export const UserSignupForm = (p: { onSubmitSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const notifyStore = useNotifyStore();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        const createResponse = await createFirebaseUser({
          userEmail: email,
          userPassword: password,
        });
        const isSuccess = createResponse.success;
        notifyStore.push({
          id: v4(),
          type: isSuccess ? "alert-success" : "alert-error",
          text: isSuccess ? "Sign up successful" : "Something went wrong, try again",
          duration: 3000,
        });
        if (isSuccess) p.onSubmitSuccess();

        setLoading(false);
      }}
    >
      <TextInput
        value={email}
        onInput={(e) => setEmail(e)}
        label={"Type your email"}
        placeholder={"Email"}
      />
      <VerticalSpacing />

      <TextInput
        type="password"
        value={password}
        onInput={(e) => setPassword(e)}
        label={"Type your password"}
        placeholder={"Password"}
      />
      <VerticalSpacing />
      <TextInput
        type="password"
        value={passwordConfirm}
        onInput={(e) => setPasswordConfirm(e)}
        label={"Confirm your password"}
        placeholder={"Confirm Password"}
      />

      <VerticalSpacing size="medium" />

      <button type="submit" className="btn btn-primary">
        Submit
        {!!loading && <span className="loading loading-spinner loading-md"></span>}
      </button>
    </form>
  );
};
