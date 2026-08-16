import { Link } from 'react-router-dom';
import {
  ArrowRight,
  LayoutGrid,
  BarChart3,
  Sparkles,
  Bookmark,
  Filter,
  GitBranch,
  Plus,
} from 'lucide-react';

const FEATURES = [
  {
    icon: LayoutGrid,
    ramp: { bg: '#EEEDFE', ring: '#CECBF6', text: '#3C3489' },
    title: 'Every application, one place',
    body: 'Company, role, stipend, and status for each application, all in a single list you can scan in seconds.',
  },
  {
    icon: BarChart3,
    ramp: { bg: '#E1F5EE', ring: '#9FE1CB', text: '#085041' },
    title: 'A dashboard that tells you something',
    body: 'A live histogram breaks your applications down by status, alongside your total count and offer rate. Click any bar to filter the list instantly.',
  },
  {
    icon: Sparkles,
    ramp: { bg: '#FAECE7', ring: '#F5C4B3', text: '#712B13' },
    title: 'AI-curated prep topics',
    body: 'Add a job description and Hirely searches the web for focus topics and tutorials tailored to that role, so you know exactly what to study.',
  },
  {
    icon: Bookmark,
    ramp: { bg: '#FAEEDA', ring: '#FAC775', text: '#633806' },
    title: 'Save your own links',
    body: 'Found a great resource on your own? Attach it to any application and it lives right alongside the AI-found ones.',
  },
  {
    icon: GitBranch,
    ramp: { bg: '#FBEAF0', ring: '#F4C0D1', text: '#72243E' },
    title: 'A status pipeline that matches reality',
    body: 'Applied, OA or test, interviewing, offer, rejected. Move an application forward as it progresses and watch your stats update.',
  },
  {
    icon: Filter,
    ramp: { bg: '#E6F1FB', ring: '#B5D4F4', text: '#0C447C' },
    title: 'Search and filter instantly',
    body: 'Find any application by company or role in a second, or filter the whole list down to just one status with a single click.',
  },
];

const STEPS = [
  {
    icon: Plus,
    title: 'Add an application',
    body: 'Drop in the company, role, and job description as soon as you apply.',
  },
  {
    icon: Sparkles,
    title: 'Get your prep topics',
    body: 'Hirely reads the description and finds focus topics and tutorials for that role.',
  },
  {
    icon: BarChart3,
    title: 'Track it to the offer',
    body: 'Update the status as you move through rounds and watch your dashboard fill in.',
  },
];

function HeroIllustration() {
  return (
    <svg viewBox="0 0 460 300" width="100%" height="auto" style={{ maxWidth: 460 }}>
      <rect x="30" y="70" width="170" height="130" rx="14" fill="#CECBF6" />
      <rect x="50" y="95" width="110" height="10" rx="5" fill="#3C3489" />
      <rect x="50" y="115" width="75" height="7" rx="3.5" fill="#534AB7" />
      <rect x="50" y="160" width="70" height="22" rx="11" fill="#9FE1CB" />
      <text x="60" y="175" fontSize="11" fill="#085041" fontFamily="'Work Sans', sans-serif">Offer</text>
      <circle cx="175" cy="171" r="16" fill="#9FE1CB" />
      <path d="M168 171 l5 6 l11 -12" stroke="#085041" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="240" y="20" width="190" height="130" rx="14" fill="#F5C4B3" />
      <rect x="260" y="44" width="120" height="10" rx="5" fill="#712B13" />
      <rect x="260" y="64" width="80" height="7" rx="3.5" fill="#993C1D" />
      <rect x="260" y="105" width="90" height="22" rx="11" fill="#FAC775" />
      <text x="270" y="120" fontSize="11" fill="#633806" fontFamily="'Work Sans', sans-serif">Interviewing</text>

      <rect x="70" y="220" width="330" height="60" rx="12" fill="#FFFFFF" stroke="#E5E3F0" strokeWidth="1.5" />
      <rect x="90" y="238" width="14" height="24" rx="3" fill="#7F77DD" />
      <rect x="112" y="248" width="14" height="14" rx="3" fill="#5DCAA5" />
      <rect x="134" y="230" width="14" height="32" rx="3" fill="#D85A30" />
      <rect x="156" y="244" width="14" height="18" rx="3" fill="#D4537E" />
      <text x="190" y="255" fontSize="12" fill="#1E1B29" fontFamily="'Work Sans', sans-serif">Applications by status</text>

      <circle cx="420" cy="200" r="6" fill="#7F77DD" />
      <circle cx="45" cy="45" r="5" fill="#D85A30" />
      <circle cx="220" cy="190" r="4" fill="#5DCAA5" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", backgroundColor: '#F6F5FB', minHeight: '100vh' }}>
      {/* No font @import here — Space Grotesk, Work Sans, and Caveat are already
          loaded once in index.html. Importing them again per-page would be
          redundant and risks them loading out of sync with the rest of the app. */}

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
        <h1 className="brand-logo" style={{ fontSize: 30 }}>Hirely</h1>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: '#4B5563' }}>
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
        </div>
        <Link
          to="/login"
          className="text-sm font-medium px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: '#7C3AED' }}
        >
          Log in
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-8 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p
            className="font-display"
            style={{
              fontSize: 46,
              fontWeight: 600,
              color: '#1E1B29',
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Track every application.
            <br />
            Land the offer.
          </p>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 28, maxWidth: 420 }}>
            Hirely keeps every company, role, and status in one place, surfaces AI-curated
            prep topics for each role, and shows you the shape of your job search at a glance.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: '#7C3AED' }}
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="px-5 py-3 rounded-xl text-sm font-medium"
              style={{ color: '#4B5563', border: '1px solid #E5E3F0' }}
            >
              See features
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <HeroIllustration />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-16">
        <p className="font-display" style={{ fontSize: 30, fontWeight: 600, color: '#1E1B29', marginBottom: 8 }}>
          Everything your job search needs
        </p>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 40, maxWidth: 480 }}>
          Built for the whole cycle, from the first application to the offer letter.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, ramp, title, body }) => (
            <div
              key={title}
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3F0' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: ramp.bg }}
              >
                <Icon size={20} color={ramp.text} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1E1B29', marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-8 py-16">
        <p className="font-display" style={{ fontSize: 30, fontWeight: 600, color: '#1E1B29', marginBottom: 40 }}>
          How it works
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#7C3AED' }}
              >
                <Icon size={18} color="#fff" />
              </div>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Step {i + 1}</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1E1B29', marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div
          className="rounded-2xl px-10 py-14 text-center"
          style={{ backgroundColor: '#1E1B29' }}
        >
          <p className="font-display" style={{ fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
            Stop losing track of your applications
          </p>
          <p style={{ fontSize: 14, color: '#C3C2F6', marginBottom: 24 }}>
            Free to use. Set up your first application in under a minute.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#7F77DD', color: '#1E1B29' }}
          >
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: '#E5E3F0' }}>
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <span className="brand-logo" style={{ fontSize: 22 }}>Hirely</span>
          <span style={{ fontSize: 13, color: '#9CA3AF' }}>Built for job seekers who like to know where they stand.</span>
        </div>
      </footer>
    </div>
  );
}