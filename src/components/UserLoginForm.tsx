import React, { useState } from "react";
import { TextInput } from "./inputs";
import { VerticalSpacing } from "./VerticalSpacing";
import { loginFirebaseUser } from "@/utils/firebaseAuthUtils";
import { useNotifyStore } from "@/modules/notify";
import { v4 } from "uuid";

export const UserLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const notifyStore = useNotifyStore();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginResponse = await loginFirebaseUser({ userEmail: email, userPassword: password });
        const isSuccess = loginResponse.success;
        notifyStore.push({
          id: v4(),
          type: isSuccess ? "alert-success" : "alert-error",
          text: isSuccess ? "Sign in successful" : "Something went wrong, try again",
          duration: 3000,
        });

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

      <VerticalSpacing size="medium" />

      <button type="submit" className="btn btn-primary">
        Submit
        {!!loading && <span className="loading loading-spinner loading-md"></span>}
      </button>
    </form>
  );
};
