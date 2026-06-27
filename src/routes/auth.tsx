import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParkingGrid } from "@/components/ParkingGrid";
import { mockSlots } from "@/lib/mockData";
import { Shield, ShieldCheck, Building2, CarFront, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { session, OWNER_ACCOUNTS, DRIVER_ACCOUNTS, ADMIN_ACCOUNTS } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · OsonParking" }, { name: "description", content: "Sign in to OsonParking — operator console and driver app." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"admin" | "owner" | "driver">("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = email && password
      ? session.authenticate(email, password)
      : session.signInAsRole(role);
    if (email && password && !acc) {
      toast.error("Login yoki parol noto'g'ri");
      return;
    }
    const r = acc?.role ?? role;
    toast.success(`Xush kelibsiz, ${acc?.name ?? "OsonParking"}`);
    navigate({ to: r === "admin" ? "/admin" : r === "owner" ? "/owner" : "/driver" });
  };

  const fillDemo = (e: string, p: string, r: typeof role) => {
    setEmail(e); setPassword(p); setRole(r);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/30 blur-3xl" />
        </div>
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary glow-primary"><span className="text-sm font-black text-primary-foreground">O</span></div>
          <div className="text-sm font-bold">OsonParking</div>
        </Link>
        <div className="relative z-10">
          <div className="rounded-3xl border border-sidebar-border bg-sidebar-accent/40 p-5 backdrop-blur-xl">
            <div className="text-xs font-semibold opacity-70">Live preview · Tashkent City Mall</div>
            <div className="mt-3"><ParkingGrid slots={mockSlots.slice(0, 30)} cols={10} compact /></div>
          </div>
          <p className="mt-6 max-w-md text-sm opacity-80">"OsonParking gives us city-scale visibility with the calm of a Tesla service dashboard. Indispensable."</p>
          <div className="mt-2 text-xs opacity-60">— Dilshod Akhmedov, Compass Group</div>
        </div>
        <div className="relative z-10 text-xs opacity-50">© OsonParking · 2026</div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold tracking-tight">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick your workspace to enter the right experience.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { v: "admin", icon: Shield, label: "Admin" },
              { v: "owner", icon: Building2, label: "Owner" },
              { v: "driver", icon: CarFront, label: "Driver" },
            ].map((r) => (
              <button
                key={r.v}
                onClick={() => setRole(r.v as typeof role)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs transition ${role===r.v?"border-primary bg-primary/10 text-primary":"border-border text-muted-foreground hover:border-primary/50"}`}
              >
                <r.icon className="h-4 w-4" />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Alisher Karimov" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" required />
            </div>
            <Button type="submit" className="w-full glow-primary">
              {mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or continue with <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={submit}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to OsonParking?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-primary hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-3 text-xs">
            <div className="flex items-center gap-2 text-foreground"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Demo akkauntlar — bosing va kiring</div>
            <div className="mt-2 max-h-64 space-y-2 overflow-auto pr-1">
              <DemoGroup label="Super Admin" accounts={ADMIN_ACCOUNTS.map(a => ({ email: a.email, password: a.password, label: a.name }))} role="admin" onPick={fillDemo} />
              <DemoGroup label="Business Owners" accounts={OWNER_ACCOUNTS.map(a => ({ email: a.email, password: a.password, label: `${a.name} · ${a.company}` }))} role="owner" onPick={fillDemo} />
              <DemoGroup label="Drivers" accounts={DRIVER_ACCOUNTS.map(a => ({ email: a.email, password: a.password, label: `${a.name} · ${a.vehicles[0]?.plate ?? ""}` }))} role="driver" onPick={fillDemo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoGroup({
  label, accounts, role, onPick,
}: {
  label: string;
  accounts: { email: string; password: string; label: string }[];
  role: "admin" | "owner" | "driver";
  onPick: (e: string, p: string, r: "admin" | "owner" | "driver") => void;
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="space-y-1">
        {accounts.map((a) => (
          <button
            type="button"
            key={a.email}
            onClick={() => onPick(a.email, a.password, role)}
            className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-background/50 px-2 py-1.5 text-left text-[11px] transition hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-foreground">{a.label}</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">{a.email} · {a.password}</div>
            </div>
            <ArrowRight className="h-3 w-3 shrink-0 text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}
