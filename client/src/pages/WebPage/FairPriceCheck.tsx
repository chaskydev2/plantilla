import React from 'react';

type JobCategory =
  | 'Roofing'
  | 'Plumbing'
  | 'Electrical'
  | 'Landscaping'
  | 'Remodeling'
  | 'Security';

type JobPost = {
  id: number;
  title: string;
  homeowner: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  category: JobCategory;
  tags: string[];
  image: string;
};

const jobPosts: JobPost[] = [
  {
    id: 1,
    title: 'Storm Damage Roof Repair',
    homeowner: 'Emily Carter',
    location: 'Austin, TX',
    budget: '$8,500 - $10,000',
    timeline: 'Start within 7 days',
    description:
      'Shingle roof suffered hail damage. Looking for a licensed roofing contractor to replace impacted sections and inspect flashing.',
    category: 'Roofing',
    tags: ['Insurance claim', 'Architectural shingles', 'Hail repair'],
    image:
      'https://images.unsplash.com/photo-1486739985386-d4fae04ca6f7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Emergency Water Heater Replacement',
    homeowner: 'Jordan Miles',
    location: 'Denver, CO',
    budget: '$1,200 - $1,600',
    timeline: 'Same-day service preferred',
    description:
      'Current 50-gallon gas water heater is leaking. Need removal, disposal, and installation of a high-efficiency unit.',
    category: 'Plumbing',
    tags: ['Licensed plumber', 'Gas line certified', 'Disposal included'],
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Smart Lock & Security Upgrade',
    homeowner: 'Priya Desai',
    location: 'Seattle, WA',
    budget: '$650 - $900',
    timeline: 'Complete within 5 days',
    description:
      'Install smart deadbolts on two exterior doors, add video doorbell, and integrate with existing home network.',
    category: 'Security',
    tags: ['Smart home', 'Low-voltage wiring', 'Certified locksmith'],
    image:
      'https://images.unsplash.com/photo-1611432579402-6e44c41b5a2d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Kitchen Lighting & Backsplash Refresh',
    homeowner: 'Marcus Lee',
    location: 'Charlotte, NC',
    budget: '$3,400 - $4,200',
    timeline: 'Start next 2 weeks',
    description:
      'Add recessed LED lighting, install under-cabinet strips, and replace backsplash with subway tile in a 200 sq ft kitchen.',
    category: 'Electrical',
    tags: ['Licensed electrician', 'Tile install', 'LED retrofit'],
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Backyard Drainage Fix & Sod Install',
    homeowner: 'Olivia Martinez',
    location: 'Orlando, FL',
    budget: '$2,800 - $3,600',
    timeline: 'Start within 10 days',
    description:
      'French drain along fence line plus fresh sod on 1,500 sq ft. Need grading adjustments to prevent pooling water.',
    category: 'Landscaping',
    tags: ['Drainage', 'Florida-friendly sod', 'Grading'],
    image:
      'https://images.unsplash.com/photo-1590490359854-dfba19688d97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Primary Bathroom Refresh',
    homeowner: 'Sara Thompson',
    location: 'Chicago, IL',
    budget: '$12,000 - $15,000',
    timeline: 'Flexible start date',
    description:
      'Replace vanity, retile shower, update fixtures, and improve ventilation in a 120 sq ft bathroom.',
    category: 'Remodeling',
    tags: ['Tile work', 'Ventilation upgrades', 'Moisture control'],
    image:
      'https://images.unsplash.com/photo-1617099391519-77b3313c406d?auto=format&fit=crop&w=1200&q=80',
  },
];

const categoryAccent: Record<JobCategory, string> = {
  Roofing: 'from-amber-400 to-rose-500',
  Plumbing: 'from-sky-400 to-blue-600',
  Electrical: 'from-yellow-400 to-orange-500',
  Landscaping: 'from-emerald-400 to-lime-500',
  Remodeling: 'from-purple-400 to-indigo-600',
  Security: 'from-slate-500 to-gray-800',
};

const FairPriceCheck: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-primary)', color: 'var(--color-secondary)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 space-y-10">
        <header className="rounded-3xl bg-white shadow-xl border border-[rgba(0,0,0,0.05)] px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.04)] px-4 py-1 tracking-[0.18em] uppercase text-[0.65rem] font-semibold text-[rgba(0,0,0,0.65)]">
              Homeowner Job Feed
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-secondary)] sm:text-5xl">
            Discover Fair-Priced Projects Posted by Homeowners
          </h1>
          <p className="mt-4 text-base text-[rgba(0,0,0,0.65)] sm:text-lg">
            Browse verified jobs across trades, compare real homeowner expectations, and reach out to the opportunities that match your crew and schedule.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[rgba(0,0,0,0.7)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-3 py-1">
              <span className="size-2 rounded-full bg-[var(--color-primary)]" /> Fresh leads added hourly
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-3 py-1">
              <span className="size-2 rounded-full bg-[rgba(0,0,0,0.75)]" /> Transparent homeowner briefs
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-3 py-1">
              <span className="size-2 rounded-full bg-white" /> Fair-price budget ranges
            </span>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          {jobPosts.map((job) => (
            <article
              key={job.id}
              className="group overflow-hidden rounded-[28px] border border-[rgba(0,0,0,0.08)] bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={job.image}
                  alt={`${job.title} preview`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${categoryAccent[job.category]} px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-[rgba(0,0,0,0.3)]`}>
                  <span className="drop-shadow">{job.category}</span>
                </div>
              </div>

              <div className="space-y-5 px-6 pb-7 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-[var(--color-secondary)]">{job.title}</h2>
                  <span className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-3 py-1 text-xs uppercase tracking-wide text-[rgba(0,0,0,0.6)]">
                    {job.timeline}
                  </span>
                </div>
                <p className="text-sm text-[rgba(0,0,0,0.65)]">
                  {job.description}
                </p>
                <dl className="grid gap-4 text-sm text-[rgba(0,0,0,0.75)] sm:grid-cols-2">
                  <div className="space-y-1">
                    <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Homeowner</dt>
                    <dd className="font-semibold text-[var(--color-secondary)]">{job.homeowner}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Location</dt>
                    <dd>{job.location}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Budget Range</dt>
                    <dd>{job.budget}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Requested Timeline</dt>
                    <dd>{job.timeline}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-3 py-1 text-xs text-[rgba(0,0,0,0.6)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                    style={{ background: 'var(--color-secondary)' }}
                  >
                    View homeowner brief
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold underline-offset-4 transition hover:underline"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Save opportunity
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FairPriceCheck;