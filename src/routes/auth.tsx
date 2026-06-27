import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, Car, Hash, Palette,
  ArrowRight, ArrowLeft, Check, ChevronDown, Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { session, OWNER_ACCOUNTS, DRIVER_ACCOUNTS, ADMIN_ACCOUNTS } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Kirish · Oson Parking" }, { name: "description", content: "Oson Parking — aqlli to'xtash joylari boshqaruvi platformasiga kirish." }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-[#E8ECFB] font-[Inter,sans-serif] text-slate-900">
      {mode === "signin" ? <SignIn onSwitch={() => setMode("signup")} /> : <SignUp onSwitch={() => setMode("signin")} />}
    </div>
  );
}

/* ============================================================ SIGN IN */

function SignIn({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = session.authenticate(email, password);
    if (!acc) {
      toast.error("Login yoki parol noto'g'ri");
      return;
    }
    toast.success(`Xush kelibsiz, ${acc.name}`);
    navigate({ to: acc.role === "admin" ? "/admin" : acc.role === "owner" ? "/owner" : "/driver" });
  };

  const demoLogin = (e: string, p: string) => {
    setEmail(e); setPassword(p);
    const acc = session.authenticate(e, p);
    if (acc) {
      toast.success(`Xush kelibsiz, ${acc.name}`);
      navigate({ to: acc.role === "admin" ? "/admin" : acc.role === "owner" ? "/owner" : "/driver" });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-10">
      {/* Brand */}
      <Link to="/" className="grid h-20 w-20 place-items-center rounded-2xl bg-[#1D4ED8] shadow-[0_12px_30px_-10px_rgba(29,78,216,0.55)]">
        <span className="text-3xl font-black text-white">P</span>
      </Link>
      <h1 className="mt-5 text-2xl font-bold tracking-wide text-[#1D4ED8]">OSON PARKING</h1>
      <p className="mt-1 text-sm text-slate-500">Aqlli to'xtash joylari boshqaruvi</p>

      {/* Card */}
      <form onSubmit={submit} className="mt-10 w-full rounded-3xl bg-white/85 backdrop-blur border border-slate-200/70 p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <h2 className="text-2xl font-bold tracking-tight">Xush kelibsiz!</h2>
        <p className="mt-1 text-sm text-slate-500">Davom etish uchun tizimga kiring</p>

        <div className="mt-6 space-y-5">
          <Field label="Elektron pochta">
            <Mail className="h-5 w-5 text-slate-400" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
            />
          </Field>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Parol</label>
              <button type="button" className="text-sm font-medium text-[#1D4ED8] hover:underline">Parolni unutdingizmi?</button>
            </div>
            <Field>
              <Lock className="h-5 w-5 text-slate-400" />
              <input
                type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
              />
              <button type="button" onClick={() => setShow(!show)} className="text-slate-400 hover:text-slate-600">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Field>
          </div>

          <button type="submit" className="flex w-full items-center justify-center rounded-xl bg-[#1D4ED8] py-3.5 text-base font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#1e40af] transition">
            Kirish
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200" /> yoki <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium hover:border-slate-300 transition">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium hover:border-slate-300 transition">
            <AppleDots /> Apple
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Hisobingiz yo'qmi?{" "}
          <button type="button" onClick={onSwitch} className="font-semibold text-[#1D4ED8] hover:underline">Ro'yxatdan o'tish</button>
        </div>
      </form>

      {/* Demo accounts */}
      <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur">
        <button onClick={() => setDemoOpen(!demoOpen)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Demo akkauntlar</span>
          <ChevronDown className={`h-4 w-4 transition ${demoOpen ? "rotate-180" : ""}`} />
        </button>
        {demoOpen && (
          <div className="max-h-72 space-y-3 overflow-auto border-t border-slate-100 px-4 py-3">
            <DemoGroup label="Super Admin" accounts={ADMIN_ACCOUNTS.map((a) => ({ email: a.email, password: a.password, label: a.name }))} onPick={demoLogin} />
            <DemoGroup label="Business Owners" accounts={OWNER_ACCOUNTS.map((a) => ({ email: a.email, password: a.password, label: `${a.name} · ${a.company}` }))} onPick={demoLogin} />
            <DemoGroup label="Drivers" accounts={DRIVER_ACCOUNTS.map((a) => ({ email: a.email, password: a.password, label: `${a.name} · ${a.vehicles[0]?.plate ?? ""}` }))} onPick={demoLogin} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ SIGN UP */

function SignUp({ onSwitch }: { onSwitch: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "", phone: "", password: "", confirm: "", model: "", plate: "", color: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const navigate = useNavigate();

  const next = () => {
    if (step === 1 && !data.name.trim()) return toast.error("Ismingizni kiriting");
    if (step === 1 && !data.phone.trim()) return toast.error("Telefon raqamini kiriting");
    if (step === 1 && data.password.length < 6) return toast.error("Parol kamida 6 ta belgidan iborat bo'lsin");
    if (step === 1 && data.password !== data.confirm) return toast.error("Parollar mos kelmadi");
    if (step === 2 && !data.plate.trim()) return toast.error("Davlat raqamini kiriting");
    setStep(step + 1);
  };

  const finish = () => {
    session.signInAsRole("driver");
    toast.success("Ro'yxatdan o'tish yakunlandi!");
    navigate({ to: "/driver" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button onClick={onSwitch} className="text-[#1D4ED8]">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold tracking-wide text-[#1D4ED8]">OSON PARKING</h1>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
          <User className="h-5 w-5" />
        </div>
      </div>

      {/* Title */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold leading-tight">Haydovchi sifatida ro'yxatdan o'tish</h2>
        <p className="mt-3 text-sm text-slate-500">Quyidagi ma'lumotlarni to'ldiring</p>
      </div>

      {/* Stepper */}
      <Stepper step={step} />

      {/* Steps */}
      <div className="mt-2 flex-1">
        {step === 1 && (
          <CardBlock>
            <FormGroup label="To'liq ism (F.I.SH)">
              <FieldSimple icon={<User className="h-5 w-5 text-slate-500" />}>
                <input
                  value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Masalan: Azizbek Karimov"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
              </FieldSimple>
            </FormGroup>
            <FormGroup label="Telefon raqami">
              <FieldSimple icon={<Phone className="h-5 w-5 text-slate-500" />}>
                <span className="font-semibold text-slate-700">+998</span>
                <input
                  value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="00 000 00 00"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
              </FieldSimple>
            </FormGroup>
            <FormGroup label="Parol">
              <FieldSimple icon={<Lock className="h-5 w-5 text-slate-500" />}>
                <input
                  type={showPw ? "text" : "password"}
                  value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="Kamida 6 ta belgi"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </FieldSimple>
            </FormGroup>
            <FormGroup label="Parolni tasdiqlang">
              <FieldSimple icon={<Lock className="h-5 w-5 text-slate-500" />}>
                <input
                  type={showPw2 ? "text" : "password"}
                  value={data.confirm} onChange={(e) => setData({ ...data, confirm: e.target.value })}
                  placeholder="Parolni qaytadan kiriting"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPw2(!showPw2)} className="text-slate-400 hover:text-slate-600">
                  {showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </FieldSimple>
              {data.confirm.length > 0 && data.password !== data.confirm && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">Parollar mos kelmadi</p>
              )}
            </FormGroup>
          </CardBlock>
        )}

        {step === 2 && (
          <CardBlock>
            <FormGroup label="Avtomobil modeli">
              <FieldSimple icon={<Car className="h-5 w-5 text-slate-500" />}>
                <input
                  value={data.model} onChange={(e) => setData({ ...data, model: e.target.value })}
                  placeholder="Masalan: Chevrolet Cobalt"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
              </FieldSimple>
            </FormGroup>
            <FormGroup label="Davlat raqami">
              <FieldSimple icon={<Hash className="h-5 w-5 text-slate-500" />}>
                <input
                  value={data.plate} onChange={(e) => setData({ ...data, plate: e.target.value.toUpperCase() })}
                  placeholder="01 A 123 BC"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 uppercase"
                />
              </FieldSimple>
            </FormGroup>
            <FormGroup label="Rangi">
              <FieldSimple icon={<Palette className="h-5 w-5 text-slate-500" />}>
                <input
                  value={data.color} onChange={(e) => setData({ ...data, color: e.target.value })}
                  placeholder="Masalan: Oq"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
              </FieldSimple>
            </FormGroup>
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-900">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p>Tizimimiz avtomatik ravishda davlat raqamingizni aniqlaydi va to'lovni osonlashtiradi.</p>
            </div>
          </CardBlock>
        )}

        {step === 3 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-2xl font-bold">Tabriklaymiz!</h3>
            <p className="mt-3 text-sm text-slate-500">
              Ro'yxatdan o'tish muvaffaqiyatli yakunlandi. Endi siz parking xizmatlaridan foydalanishingiz mumkin.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        {step < 3 && (
          <button onClick={next} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] py-4 text-base font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#1e40af] transition">
            Keyingisi <ArrowRight className="h-5 w-5" />
          </button>
        )}
        {step === 3 && (
          <button onClick={finish} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] py-4 text-base font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#1e40af] transition">
            Davom etish <ArrowRight className="h-5 w-5" />
          </button>
        )}
        {step > 1 && step < 3 && (
          <button onClick={() => setStep(step - 1)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
        )}
        <button onClick={onSwitch} className="block w-full pt-2 text-center text-sm font-semibold text-[#1D4ED8] hover:underline">
          Tizimga kirish (Login)
        </button>
      </div>
    </div>
  );
}

/* ============================================================ helpers */

function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#1D4ED8] focus-within:ring-1 focus-within:ring-[#1D4ED8] transition">
        {children}
      </div>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-900">{label}</label>
      {children}
    </div>
  );
}

function FieldSimple({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F7FF] px-4 py-3.5 focus-within:border-[#1D4ED8] focus-within:bg-white transition">
      {icon}
      {children}
    </div>
  );
}

function CardBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {children}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const items = [
    { n: 1, label: "Shaxsiy" },
    { n: 2, label: "Avtomobil" },
    { n: 3, label: "Yakunlash" },
  ];
  return (
    <div className="mt-8 flex items-start justify-between">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <div key={it.n} className="relative flex flex-1 flex-col items-center">
            {i < items.length - 1 && (
              <div className={`absolute top-6 left-1/2 h-0.5 w-full ${done ? "bg-[#1D4ED8]" : "bg-blue-100"}`} />
            )}
            <div className={`relative z-10 grid h-12 w-12 place-items-center rounded-full text-base font-bold transition ${
              active ? "bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/30"
              : done ? "bg-[#1D4ED8] text-white"
              : "bg-blue-100 text-[#1D4ED8]"
            }`}>
              {done ? <Check className="h-5 w-5" strokeWidth={3} /> : it.n === 3 ? <Check className="h-5 w-5" /> : it.n}
            </div>
            <div className={`mt-2 text-sm font-semibold ${active ? "text-[#1D4ED8]" : "text-slate-500"}`}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function DemoGroup({
  label, accounts, onPick,
}: {
  label: string;
  accounts: { email: string; password: string; label: string }[];
  onPick: (e: string, p: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="space-y-1.5">
        {accounts.map((a) => (
          <button
            type="button" key={a.email}
            onClick={() => onPick(a.email, a.password)}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-[#1D4ED8] hover:bg-blue-50"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-900">{a.label}</div>
              <div className="truncate font-mono text-[10px] text-slate-500">{a.email} · {a.password}</div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#1D4ED8]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleDots() {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-1 w-1 rounded-full bg-slate-800" />)}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  );
}
