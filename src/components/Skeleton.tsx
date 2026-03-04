export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-50 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
      <div className="h-3 bg-slate-50 rounded w-1/3 mb-3" />
      <div className="flex gap-1.5">
        <div className="h-5 bg-slate-50 rounded-full w-14" />
        <div className="h-5 bg-slate-50 rounded-full w-16" />
        <div className="h-5 bg-slate-50 rounded-full w-12" />
      </div>
    </div>
  );
}

export function BrandCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-100 rounded w-20" />
          <div className="h-2.5 bg-slate-50 rounded w-14" />
        </div>
      </div>
    </div>
  );
}
