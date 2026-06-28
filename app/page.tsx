import CompareSlider from './components/CompareSlider';
import SmoothScrollProvider from './components/SmoothScrollProvider';

const badges = [
  {
    label: 'Parents',
    src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#ffe4ef"/><circle cx="48" cy="38" r="18" fill="#ffffff"/><path d="M24 76c5-14 16-20 24-20s19 6 24 20" fill="#ffffff"/></svg>`),
  },
  {
    label: 'Teachers',
    src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#e4f9f0"/><rect x="26" y="28" width="44" height="34" rx="10" fill="#ffffff"/><rect x="36" y="38" width="24" height="8" rx="4" fill="#4fbf8f"/><rect x="36" y="50" width="18" height="6" rx="3" fill="#7dd3c7"/></svg>`),
  },
  {
    label: 'Kids',
    src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#fff2c7"/><circle cx="38" cy="40" r="14" fill="#ffffff"/><circle cx="60" cy="40" r="12" fill="#ffffff"/><path d="M26 72c6-10 13-15 22-15s16 5 22 15" fill="#ffffff"/></svg>`),
  },
];

const steps = [
  {
    title: 'Snap & Upload',
    description: 'Take a quick photo of your child\'s messy doodle and drop it here.',
    accent: 'bg-[#eef4ff]',
  },
  {
    title: 'Instant Transform',
    description: 'We instantly strip away the noise, leaving a perfect, uniform outline.',
    accent: 'bg-[#fff1f2]',
  },
  {
    title: 'Print & Color',
    description: 'Download your crisp new coloring page and grab the crayons.',
    accent: 'bg-[#fef3c7]',
  },
];

const featuredExample = {
  title: 'Rocket Launch',
  beforeSrc: '/2_before.png',
  afterSrc: '/2_after.png',
  description: 'A wild scribble becomes a bold line-art rocket for coloring time.',
};

const faqs = [
  {
    question: 'What kinds of drawings work best?',
    answer:
      'Anything from simple crayon marks to busy sketches can be transformed. The cleaner the original, the more detail we can preserve.',
  },
  {
    question: 'Is this only for print?',
    answer:
      'You can download the finished page for printing or share it digitally for a screen-free activity at home.',
  },
  {
    question: 'Do I need design experience?',
    answer:
      'Not at all. The process is built to feel effortless, and the preview makes each step easy to understand.',
  },
];

function PlaceholderArt({ accent, label }: { accent: string; label: string }) {
  return (
    <div className={`relative h-28 overflow-hidden rounded-2xl border border-slate-200 ${accent}`}>
      <div className="absolute inset-0 bg-white/60" />
      <div className="absolute left-4 top-4 h-10 w-10 rounded-full border-2 border-slate-700/70" />
      <div className="absolute bottom-5 left-4 right-6 h-2 rounded-full bg-slate-700/70" />
      <div className="absolute bottom-8 left-10 right-4 h-2 rounded-full bg-slate-700/50" />
      <span className="absolute bottom-2 right-2 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white text-slate-700">
      <SmoothScrollProvider />
      <div className="w-full bg-[#0f5bff] px-4 py-2 text-center text-sm font-semibold text-white">
        Creating memories one drawing at a time
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href="#hero" className="flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm">
              <img src="/logo.png" alt="Forever Scribbles logo" className="h-[180px] w-[180px] object-contain" />
            </a>
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                  <img src={badge.src} alt={badge.label} className="h-8 w-8 rounded-full border border-rose-100 object-cover" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold text-slate-600 sm:gap-4">
            <a href="#hero" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Home
            </a>
            <a href="#how-it-works" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              How it works
            </a>
            <a href="#gallery" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Gallery
            </a>
            <a href="#faq" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section id="hero" className="w-full rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-[#0f5bff]/20 bg-[#eef4ff] px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#0f5bff]">
                Turn scribbles into keepsakes
              </p>
              <h1 className="mt-5 font-display text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Turn your kid&apos;s art into a real coloring book.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                Upload a doodle, watch it clean up into crisp line art, and create a printable page in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#upload" className="inline-flex items-center justify-center rounded-full bg-[#0f5bff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a45cc]">
                  Start Creating
                </a>
                <a href="#gallery" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  See the transformation
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-[#eef4ff] px-3 py-2 text-[#0f5bff]">Fast previews</span>
                <span className="rounded-full bg-[#fff1f2] px-3 py-2 text-[#ff4d57]">Kid-safe process</span>
                <span className="rounded-full bg-[#fef3c7] px-3 py-2 text-[#b45309]">Print-ready output</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[#ff4d57]/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-inner">
                <img src={featuredExample.afterSrc} alt="Coloring page preview" className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[500px]" />
                <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  Ready to print
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">How it works</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-slate-700">
              The process stays playful and easy, so you can focus on the fun while we prepare a fresh page.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Step {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">0{index + 1}</span>
                </div>
                <PlaceholderArt accent={step.accent} label={step.title} />
                <h3 className="mt-4 text-xl font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-slate-700">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="upload" className="w-full rounded-[2.25rem] border border-[#0f5bff]/20 bg-[linear-gradient(135deg,_#0f5bff_0%,_#ff4d57_100%)] p-6 text-white shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Ready when you are</p>
              <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">Upload your drawing and make it shine.</h2>
              <p className="mt-4 text-lg leading-8 text-white/90">
                Drag in a sketch and let the magic happen. This upload zone is built to feel bold, simple, and impossible to miss.
              </p>
            </div>

            <label className="group flex min-h-[320px] cursor-pointer flex-col justify-center rounded-[2rem] border border-white/40 bg-white/15 p-8 text-center backdrop-blur-sm transition hover:bg-white/20">
              <input type="file" className="sr-only" />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl font-semibold text-[#0f5bff] shadow-lg">
                +
              </div>
              <p className="mt-5 text-2xl font-semibold text-white">Drop a drawing here</p>
              <p className="mt-2 text-sm leading-7 text-white/85">
                JPG, PNG, or PDF. We&apos;ll turn it into a neat coloring page in seconds.
              </p>
              <span className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f5bff] transition group-hover:translate-y-[-1px]">
                Choose a file
              </span>
            </label>
          </div>
        </section>

        <section id="gallery" className="w-full rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Before &amp; After</h2>
              <p className="mt-2 max-w-2xl text-base leading-8 text-slate-600">
                One full-width view so the transformation is impossible to miss.
              </p>
            </div>
            <div className="rounded-full bg-[#fff1f2] px-3 py-2 text-sm font-semibold text-[#ff4d57]">
              Featured sample
            </div>
          </div>
          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3 shadow-inner">
            <div className="h-[28rem] sm:h-[34rem] lg:h-[40rem]">
              <CompareSlider beforeSrc={featuredExample.beforeSrc} afterSrc={featuredExample.afterSrc} alt={`Before and after ${featuredExample.title}`} />
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{featuredExample.title}</h3>
                <p className="mt-1 text-sm leading-7 text-slate-600">{featuredExample.description}</p>
              </div>
              <a href="#upload" className="inline-flex items-center justify-center rounded-full bg-[#ff4d57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e63946]">
                Try this style
              </a>
            </div>
          </article>
        </section>

        <section id="faq" className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-bold text-slate-900">FAQ</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="group rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-base font-semibold text-slate-800">
                  <span>{item.question}</span>
                  <span className="text-xl text-slate-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
