import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BadgeCheck, Camera, Activity, CalendarCheck,
  CheckCircle2, Check, Globe, AtSign, Share2,
} from "lucide-react";
import garageHero from "@/assets/garage-hero.jpg";
import parkingHero from "@/assets/parking-hero.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oson Parking — Aqlli to'xtash joylari boshqaruvi" },
      { name: "description", content: "AI texnologiyalari yordamida vaqtingizni va mablag'ingizni tejang. O'zbekistondagi birinchi raqamli aqlli parking platformasi." },
      { property: "og:title", content: "Oson Parking — Aqlli to'xtash joylari boshqaruvi" },
      { property: "og:description", content: "O'zbekistondagi №1 aqlli parking platformasi" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900 font-[Inter,sans-serif]">
      <Nav />
      <Hero />
      <Services />
      <Experience />
      <AboutPricing />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F7FB]/85 backdrop-blur-xl border-b border-slate-200/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link to="/" className="text-xl font-bold text-[#1D4ED8] tracking-tight">Oson Parking</Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a href="#services" className="text-[#1D4ED8] border-b-2 border-[#1D4ED8] pb-1">Xizmatlar</a>
          <a href="#about" className="hover:text-[#1D4ED8]">Biz haqimizda</a>
          <a href="#pricing" className="hover:text-[#1D4ED8]">Narxlar</a>
          <a href="#contact" className="hover:text-[#1D4ED8]">Aloqa</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium text-[#1D4ED8] hover:underline">Kirish</Link>
          <Link to="/auth" className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] transition">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 pt-6">
        <div className="relative h-[560px] overflow-hidden rounded-3xl">
          <img src={garageHero} alt="AI parking garage" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
          <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-8 sm:px-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
              <BadgeCheck className="h-3.5 w-3.5" /> O'ZBEKISTONDA №1 PLATFORMA
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Oson Parking — Aqlli to'xtash joylari boshqaruvi
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600 leading-relaxed">
              AI texnologiyalari yordamida vaqtingizni va mablag'ingizni tejang. O'zbekistondagi birinchi raqamli aqlli parking platformasi bilan kelajakni his qiling.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-[#1e40af] transition">
                Hozir boshlash <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#services" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 border border-slate-200 hover:border-slate-300 transition">
                Demo ko'rish
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { icon: Camera, title: "AI OCR Tizimi", desc: "Davlat raqamlarini 99.9% aniqlik bilan avtomatik tanish va darvozalarni boshqarish." },
    { icon: Activity, title: "Real-vaqt Monitoringi", desc: "Parking holatini istalgan vaqtda va istalgan joydan mobil ilova orqali kuzatib boring." },
    { icon: CalendarCheck, title: "Oson Band Qilish", desc: "Haydovchilar uchun bo'sh joylarni oldindan band qilish va to'lovlarni amalga oshirish." },
  ];
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-8 py-20">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Bizning xizmatlarimiz</h2>
        <p className="mt-3 text-slate-500">Boshqaruvni avtomatlashtirish uchun mukammal yechimlar</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((s) => (
          <div key={s.title} className="rounded-2xl bg-white p-7 border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)] transition">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1D4ED8]">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const items = [
    { t: "Tezkor To'lov", d: "Navbatlarsiz, Payme, Uzum yoki karta orqali to'lov." },
    { t: "Navigatsiya", d: "Parking ichidagi aniq bo'sh joygacha yo'naltirish." },
    { t: "Xavfsizlik", d: "Avtomobilingiz holati haqida doimiy xabarnomalar." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-8 pb-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <img src={parkingHero.url} alt="Smart park reserved" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Yangi Avlod Foydalanuvchi Tajribasi</h2>
          <p className="mt-4 text-slate-500">Oson Parking mobil ilovasi orqali siz:</p>
          <ul className="mt-6 space-y-5">
            {items.map((i) => (
              <li key={i.t} className="flex items-start gap-4">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#1D4ED8]" />
                <div>
                  <div className="font-semibold text-slate-900">{i.t}</div>
                  <div className="text-sm text-slate-500">{i.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function AboutPricing() {
  return (
    <section id="about" className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-20 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Biz haqimizda va Narxlar</h2>
          <p className="mt-5 text-slate-300 leading-relaxed max-w-lg">
            Oson Parking — bu shunchaki dastur emas, bu shaharlarimizni aqlli va qulay qilish sari tashlangan qadam. Biz biznes egalariga daromadni 30% gacha oshirishga, haydovchilarga esa har oy 5 soatdan ortiq vaqt tejalishiga yordam beramiz.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="text-3xl font-bold">500+</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Muvaffaqiyatli loyihalar</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="text-3xl font-bold">1M+</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Faol foydalanuvchilar</div>
            </div>
          </div>
        </div>
        <div id="pricing" className="relative rounded-2xl bg-[#1E293B] border border-white/10 p-8 shadow-2xl">
          <div className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
            Eng mashhur
          </div>
          <div className="mt-5 text-5xl font-bold tracking-tight">Premium</div>
          <p className="mt-2 text-slate-400">Barcha AI imkoniyatlari bilan</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Cheksiz AI raqam tanish","24/7 Analitika va Dashboard","VIP qo'llab-quvvatlash"].map((f) => (
              <li key={f} className="flex items-center gap-3"><Check className="h-5 w-5 text-[#10B981]" /> {f}</li>
            ))}
          </ul>
          <Link to="/auth" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#1D4ED8] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1e40af] transition">
            Hamkorlikni boshlash
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#0B1220] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-white">Oson Parking</div>
          <p className="mt-3 text-sm text-slate-400 max-w-xs">O'zbekistondagi aqlli parking yechimlari bo'yicha yetakchi provayder.</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kompaniya</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white">Biz haqimizda</a></li>
            <li><a href="#" className="hover:text-white">Karyera</a></li>
            <li><a href="#" className="hover:text-white">Yangiliklar</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Yordam</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Yordam markazi</a></li>
            <li><a href="#" className="hover:text-white">Maxfiylik siyosati</a></li>
            <li><a href="#" className="hover:text-white">Xizmat ko'rsatish shartlari</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aloqa</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>+998 71 123 45 67</li>
            <li>info@osonparking.uz</li>
          </ul>
          <div className="mt-4 flex items-center gap-3 text-slate-400">
            <a href="#" aria-label="Web"><Globe className="h-4 w-4 hover:text-white" /></a>
            <a href="#" aria-label="Email"><AtSign className="h-4 w-4 hover:text-white" /></a>
            <a href="#" aria-label="Share"><Share2 className="h-4 w-4 hover:text-white" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">© 2026 Oson Parking. Barcha huquqlar himoyalangan.</div>
    </footer>
  );
}
