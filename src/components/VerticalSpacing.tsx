const heightClassMap = {
  oneLine: "h-[1rem]",
  biggest: "h-32 sm:h-48",
  bigger: "h-16 sm:h-24",
  big: "h-10 sm:h-20",
  medium: "h-6",
};

export type TVerticalSpacingProps = {
  size?: keyof typeof heightClassMap;
};

export const VerticalSpacing = (p: TVerticalSpacingProps) => {
  const oneLine = p.size ?? "oneLine";
  return <div className={heightClassMap[oneLine]} />;
};
