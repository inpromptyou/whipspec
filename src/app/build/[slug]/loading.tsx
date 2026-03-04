import Nav from "@/components/Nav";

export default function Loading() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-pulse">
          <div className="aspect-[16/9] bg-slate-200 rounded-2xl mb-6" />
          <div className="h-8 bg-slate-200 rounded w-2/3 mb-3" />
          <div className="h-5 bg-slate-100 rounded w-1/3 mb-6" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
