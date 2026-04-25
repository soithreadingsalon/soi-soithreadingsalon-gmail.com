import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

type Service = { id: string; category: string; name: string; price: string; description: string | null; featured: boolean; sort_order: number };

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing | SOI Threading Salon, Wayne NJ" },
      { name: "description", content: "Threading, waxing, facials, hair care, henna and men's services with full pricing at SOI Threading Salon, Wayne NJ." },
      { property: "og:title", content: "Services & Pricing | SOI Threading Salon" },
      { property: "og:description", content: "Full menu and pricing for threading, waxing, facials, hair care and henna." },
    ],
  }),
  component: ServicesPage,
});

const CATEGORIES = ["All", "Threading", "Waxing", "Facials", "Hair Care", "Henna", "Men"];

function priceNumber(p: string) {
  const m = p.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setServices(data as Service[]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = services;
    if (cat !== "All") list = list.filter((s) => s.category === cat);
    if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "asc") list = [...list].sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
    if (sort === "desc") list = [...list].sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
    return list;
  }, [services, cat, search, sort]);

  const grouped = useMemo(() => {
    const g: Record<string, Service[]> = {};
    for (const s of filtered) (g[s.category] ||= []).push(s);
    return g;
  }, [filtered]);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading eyebrow="Our Menu" title="Services & Pricing" subtitle="Every ritual is designed to refresh, refine, and restore your natural radiance." />

        <div className="glass-panel rounded-2xl p-4 md:p-5 mb-8 flex flex-col md:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                  cat === c ? "btn-gold" : "bg-card border border-border hover:border-[var(--gold)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSort(sort === "default" ? "asc" : sort === "asc" ? "desc" : "default")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold uppercase tracking-wide"
          >
            <ArrowUpDown className="h-4 w-4" /> Price {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading services…</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No services match your search.</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-3xl text-foreground">{category}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--gold)] to-transparent" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((s) => (
                    <div key={s.id} className="card-3d glass-panel rounded-2xl p-5 flex items-start justify-between gap-4 gold-border">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-lg">{s.name}</h3>
                          {s.featured && <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full gradient-gold text-white">Popular</span>}
                        </div>
                        {s.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>}
                      </div>
                      <div className="font-serif text-xl text-gold whitespace-nowrap">{s.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}