import Nav from "@/components/Nav";

export default function Loading() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center py-8 sm:py-12 animate-pulse">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-200 mx-auto mb-4" />
            <div className="h-7 bg-slate-200 rounded w-40 mx-auto mb-2" />
            <div className="h-4 bg-slate-100 rounded w-24 mx-auto mb-4" />
            <div className="h-4 bg-slate-100 rounded w-60 mx-auto" />
            <div className="flex justify-center gap-3 mt-5">
              <div className="w-9 h-9 rounded-full bg-slate-100" />
              <div className="w-9 h-9 rounded-full bg-slate-100" />
              <div className="w-9 h-9 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
