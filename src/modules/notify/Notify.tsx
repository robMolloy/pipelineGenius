import { create } from "zustand";

type TAlertProps = {
  id: string;
  type: "alert-success" | "alert-info";
  text: string;
  duration: number;
};

type TNotifyStoreProps = {
  allAlerts: TAlertProps[];
  hideAlerts: TAlertProps[];
  getVisibleAlerts: () => TAlertProps[];
  push: (p: TAlertProps) => void;
  pushToHide: (p: TAlertProps) => void;
};

export const useNotifyStore = create<TNotifyStoreProps>((set, get) => ({
  allAlerts: [],
  hideAlerts: [],
  getVisibleAlerts: () => {
    const hiddenAlertIds = get().hideAlerts.map((x) => x.id);
    return get()
      .allAlerts.map((alert) => {
        const isAlertHidden = hiddenAlertIds.includes(alert.id);
        return isAlertHidden ? undefined : alert;
      })
      .filter((x) => !!x) as TAlertProps[];
  },
  smartCleanup: () => {
    const shouldCleanup = get().getVisibleAlerts().length === 0;
    if (shouldCleanup) return { allAlerts: [], hideAlerts: [] };
  },
  push: (p) =>
    set((state) => {
      setTimeout(() => get().pushToHide(p), p.duration);

      const shouldCleanup = get().getVisibleAlerts().length === 0;
      return shouldCleanup
        ? { allAlerts: [p], hideAlerts: [] }
        : { allAlerts: [...state.allAlerts, p] };
    }),
  pushToHide: (p) =>
    set((state) => {
      return { hideAlerts: [...state.hideAlerts, p] };
    }),
}));

export const Notify = () => {
  const notifyStore = useNotifyStore();

  return (
    <>
      <div className="toast toast-center toast-top z-[12]">
        {notifyStore.getVisibleAlerts().map((x) => (
          <div
            onClick={() => notifyStore.pushToHide(x)}
            key={x.id}
            className={`alert ${x.type} cursor-pointer`}
          >
            <div>{x.text}</div>
          </div>
        ))}
      </div>
    </>
  );
};
