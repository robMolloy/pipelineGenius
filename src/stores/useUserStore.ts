import { User } from "firebase/auth";
import { create } from "zustand";

type TUserStoreStateBase = {
  user: User | null | undefined;

  setUser: (user: User | null | undefined) => void;
};
const useUserStoreBase = create<TUserStoreStateBase>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

export const useUserStore = () => {
  const { user: initUser, setUser } = useUserStoreBase();

  const safeUser = (() => {
    if (initUser === undefined) return { status: "loading" } as const;
    if (initUser === null) return { status: "signedOut" } as const;
    return { status: "signedIn", user: initUser } as const;
  })();

  return { safeUser, setUser };
};
