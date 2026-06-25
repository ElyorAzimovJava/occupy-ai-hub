import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ParkingGrid, SlotLegend } from "@/components/ParkingGrid";
import { mockSlots, occupancySeries } from "@/lib/mockData";
import {
  Camera, Cpu, Eye, LineChart as LineChartIcon, MapPin, Shield, Sparkles, Zap,
  Check, ArrowRight, CarFront, Activity,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OsonParking — Smart AI Parking Management Platform" },
      { name: "description", content: "AI computer vision turns every camera into a live parking sensor. Manage lots, monitor occupancy, and book in seconds." },
      { property: "og:title", content: "OsonParking — Smart AI Parking Management Platform" },
      { property: "og:description", content: "AI computer vision turns every camera into a live parking sensor." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav /><Hero /><LogoStrip /><Features /><DashboardPreview /><HowItWorks /><Pricing /><Testimonials /><FAQ /><CTA /><Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary glow-primary">
            <span className="text-sm font-black text-primary-foreground">O</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">OsonParking</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Vision</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">Sign in</Link>
          <Button asChild size="sm" className="glow-primary">
            <Link to="/auth">Start Free <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-32 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
            Live AI computer vision · 50ms response
          </div>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Smart <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Parking</span> Management Platform
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Turn any IP camera into a real-time parking sensor. Operators see every slot, drivers book in 10 seconds, and revenue grows without lifting concrete.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="glow-primary"><Link to="/auth">Start Free <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="#how">Book a Demo</a></Button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {[{label:"Avg accuracy",value:"97.2%"},{label:"Lots online",value:"240+"},{label:"Bookings/day",value:"12.4k"}].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 p-5 shadow-2xl backdrop-blur-xl glow-primary">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-primary"><Camera className="h-3.5 w-3.5" /></div>
          <div>
            <div className="text-xs font-semibold">Tashkent City Mall · Floor B2</div>
            <div className="text-[10px] text-muted-foreground">Camera 02 · 1080p · 97% accuracy</div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> LIVE
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
        <ParkingGrid slots={mockSlots.slice(0, 40)} cols={10} compact />
        <div className="mt-4"><SlotLegend /></div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[{l:"Occupied",v:"168",t:"danger"},{l:"Reserved",v:"22",t:"warning"},{l:"Available",v:"50",t:"success"}].map((m) => (
          <div key={m.l} className="rounded-xl border border-border bg-card p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
            <div className={`mt-1 text-lg font-bold ${m.t==="danger"?"text-danger":m.t==="warning"?"text-warning":"text-success"}`}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoStrip() {
  return (
    <div className="border-y border-border/50 bg-card/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">Trusted by parking operators across Central Asia</div>
        <div className="mt-5 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
          {["Tashkent City","Magic Mall","Compass","Silk Road","Samarkand Plaza","ParkGo"].map((n) => (
            <div key={n} className="text-center text-sm font-bold tracking-tight text-muted-foreground">{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: Eye, title: "Computer vision detection", desc: "Frame-by-frame slot detection with 97%+ accuracy across day, night, rain, and snow." },
  { icon: Cpu, title: "Edge + cloud AI", desc: "Run inference locally for latency or in the cloud for scale — same dashboard, one API." },
  { icon: Zap, title: "Real-time updates", desc: "Driver apps and operator dashboards stay in sync via WebSockets in under 200ms." },
  { icon: MapPin, title: "Smart map & ETA", desc: "Drivers find the nearest free slot ranked by distance, price, and live availability." },
  { icon: Shield, title: "License plate OCR", desc: "Automated entry and exit logs, paired with bookings for fully touchless parking." },
  { icon: LineChartIcon, title: "Revenue analytics", desc: "Owners track occupancy, peak hours, and revenue with one-click CSV & PDF exports." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-primary">The platform</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything a parking operator needs, in one console.</h2>
        <p className="mt-3 text-muted-foreground">Built for operators with multiple lots and drivers who hate circling the block.</p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-xl">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 shadow-2xl sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent"><Sparkles className="h-3 w-3" /> Operator dashboard</div>
            <h3 className="mt-4 text-2xl font-bold sm:text-3xl">A control tower for every lot you own.</h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">Live occupancy, AI confidence, camera health, and booking flow — all in one calm, fast interface.</p>
            <ul className="mt-6 space-y-2.5">
              {["Multi-lot rollup with per-floor drill-down","Camera health + AI latency telemetry","Driver bookings approve / extend / refund","CSV & PDF analytics export"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span>{t}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link to="/admin">Open Admin Demo</Link></Button>
              <Button asChild variant="outline"><Link to="/owner">Owner Demo</Link></Button>
              <Button asChild variant="ghost"><Link to="/driver">Driver App</Link></Button>
            </div>
          </div>
          <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /><span className="text-xs font-semibold">24h Occupancy</span></div>
              <span className="text-[10px] text-muted-foreground">Updated just now</span>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancySeries}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.488 0.217 264)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.696 0.165 162)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.696 0.165 162)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="occupancy" stroke="oklch(0.488 0.217 264)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="reserved" stroke="oklch(0.696 0.165 162)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: Camera, title: "Mount any IP camera", desc: "Point at your lot. Stream RTSP/HTTP to OsonParking — no special hardware required." },
    { n: "02", icon: Cpu, title: "AI vision learns slots", desc: "Draw slot polygons once; our model tracks vehicles, plates, and occupancy frame by frame." },
    { n: "03", icon: CarFront, title: "Drivers book live", desc: "Drivers see free slots in real time and reserve in 10 seconds with a QR-coded ticket." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-primary">How it works</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Live in three steps.</h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
              <span className="text-3xl font-black text-muted-foreground/30">{s.n}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Starter", price: "Free", desc: "For pilots & single-lot operators", features: ["1 lot, 2 cameras","Up to 30 slots","Live dashboard","Email support"], cta: "Start Free", featured: false },
    { name: "Growth", price: "$149", suffix: "/lot/mo", desc: "For chains adding lots monthly", features: ["Unlimited cameras","Plate OCR + bookings","Driver app integration","Priority support"], cta: "Start Growth", featured: true },
    { name: "Enterprise", price: "Custom", desc: "City-scale deployments", features: ["SSO + audit logs","On-prem AI inference","Custom integrations","Dedicated success team"], cta: "Talk to Sales", featured: false },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-primary">Pricing</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Plans that grow with your lots.</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl border p-7 ${p.featured?"border-primary bg-primary/5 glow-primary":"border-border bg-card"}`}>
            {p.featured && <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most popular</div>}
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{p.price}</span>
              {p.suffix && <span className="text-sm text-muted-foreground">{p.suffix}</span>}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
            <ul className="mt-6 space-y-2">
              {p.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-success" /> {f}</li>)}
            </ul>
            <Button asChild className="mt-6 w-full" variant={p.featured?"default":"outline"}><Link to="/auth">{p.cta}</Link></Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const ts = [
    { q: "We cut staff at the gate by half and revenue still went up 18%.", a: "Alisher K.", r: "Tashkent City Mall" },
    { q: "I finally know which floor pays for itself and which doesn't.", a: "Nigora T.", r: "Magic Realty" },
    { q: "Drivers love the QR ticket. Zero printer paper jams.", a: "Dilshod A.", r: "Compass Group" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-5 md:grid-cols-3">
        {ts.map((t) => (
          <figure key={t.a} className="rounded-2xl border border-border bg-card p-6">
            <blockquote className="text-sm leading-relaxed">"{t.q}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{t.a.split(" ").map(x=>x[0]).join("")}</div>
              <div>
                <div className="text-sm font-semibold">{t.a}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    { q: "Do I need special cameras?", a: "No — any RTSP/HTTP IP camera works. Most operators use existing CCTV." },
    { q: "How accurate is the AI?", a: "Across 240+ live lots we average 97.2% accuracy, day or night." },
    { q: "Can drivers pay in-app?", a: "Yes — credit card, mobile wallets, and Click/Payme integrations are supported." },
    { q: "Is there an SLA?", a: "Growth and Enterprise plans include 99.9% uptime SLA and dedicated incident response." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-primary">FAQ</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Common questions.</h2>
      </div>
      <div className="mt-10 space-y-3">
        {qs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:bg-card">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">{f.q}<span className="text-primary transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-accent/10 p-10 text-center sm:p-16">
        <div className="pointer-events-none absolute inset-0 grid-fade">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.488_0.217_264/0.3),transparent_60%)]" />
        </div>
        <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Start operating like a tech company.</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">Two cameras, ten minutes, zero contracts. Free forever for your first lot.</p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="glow-primary"><Link to="/auth">Start Free</Link></Button>
          <Button asChild size="lg" variant="outline"><a href="#how">Book a Demo</a></Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary"><span className="text-xs font-black text-primary-foreground">O</span></div>
            <div className="text-sm font-bold">OsonParking</div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">AI computer vision for parking operators and drivers.</p>
        </div>
        {[
          { h: "Product", l: ["Features","Pricing","Demo","Changelog"] },
          { h: "Company", l: ["About","Customers","Careers","Contact"] },
          { h: "Legal", l: ["Privacy","Terms","Security","DPA"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.h}</div>
            <ul className="mt-3 space-y-1.5 text-sm">{c.l.map((x) => <li key={x}><a href="#" className="text-muted-foreground hover:text-foreground">{x}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 OsonParking. All rights reserved.</div>
    </footer>
  );
}
