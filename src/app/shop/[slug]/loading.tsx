import Nav from "@/components/Nav";

export default function Loading() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-3" />
          <div className="h-5 bg-slate-100 rounded w-1/3 mb-6" />
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl" />
            ))}
          </div>
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>
      </main>
    </>
  );
}
