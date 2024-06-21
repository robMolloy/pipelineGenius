export const createDrawer = (createProps: { directionClass: "drawer-end"; id: string }) => {
  const OpenDrawerWrapper = (p: { children: React.ReactNode }) => (
    <label htmlFor={createProps.id}>{p.children}</label>
  );
  const CloseDrawerWrapper = (p: { children?: React.ReactNode }) => (
    <label htmlFor={createProps.id} aria-label="close sidebar" className="drawer-overlay opacity-0">
      {p.children}
    </label>
  );
  const DrawerOverlay = (p: { children?: React.ReactNode }) => (
    <div className="drawer-side z-[11]">{p.children}</div>
  );
  const DrawerContent = (p: { children?: React.ReactNode }) => (
    <div className="min-h-full w-96 max-w-[400px] bg-base-200 p-4 text-base-content">
      {p.children}
    </div>
  );
  const Drawer = (p: { children: React.ReactNode }) => {
    return (
      <div className={`drawer ${createProps.directionClass}`}>
        <input id={createProps.id} type="checkbox" className="drawer-toggle" />
        <DrawerOverlay>
          <CloseDrawerWrapper />
          <DrawerContent>{p.children}</DrawerContent>
        </DrawerOverlay>
      </div>
    );
  };

  return { OpenDrawerWrapper, CloseDrawerWrapper, DrawerOverlay, DrawerContent, Drawer };
};
