const SkeletonCard = () => (
  <div className="w-full max-w-72 sm:w-44 sm:max-w-none lg:w-48 2xl:w-60 shrink-0 aspect-5/7 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
);

const SKELETON_ROWS = Array.from({ length: 4 }, (_, i) =>
  Array.from({ length: 3 }, (_, j) => `${i}-${j}`),
);

export const CardGridSkeleton = () => (
  <div className="h-full overflow-hidden pt-4 pb-4">
    {SKELETON_ROWS.map((row, i) => (
      <div
        key={i}
        className="flex flex-col items-center sm:flex-row sm:justify-start gap-6 px-4 sm:px-2 py-3 w-full sm:w-140 lg:w-152 2xl:w-188 mx-auto"
      >
        {row.map((key) => (
          <SkeletonCard key={key} />
        ))}
      </div>
    ))}
  </div>
);
