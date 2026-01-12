

import React, { useEffect, useState } from 'react';
import { jobPostService } from '@/core/services/job-posts/jobPost.service';

type JobCategory = string;

type JobPost = {
  id: number;
  title: string;
  description: string;
  city?: string;
  address_line1?: string;
  price?: string;
  currency?: string;
  deadline?: string;
  image_path?: string | null;
  service?: { id: number; name: string; slug?: string } | null;
  homeowner?: {
    user_id: number;
    user?: {
      id: number;
      name?: string;
      email?: string;
      mobile_number?: string;
      phone_number?: string;
    } | null;
  } | null;
  status?: string;
};

const categoryAccent: Record<string, string> = {
  Roofing: 'from-amber-400 to-rose-500',
  Plumbing: 'from-sky-400 to-blue-600',
  Electrical: 'from-yellow-400 to-orange-500',
  Landscaping: 'from-emerald-400 to-lime-500',
  Remodeling: 'from-purple-400 to-indigo-600',
  Security: 'from-slate-500 to-gray-800',
};

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return undefined;
  // Remove '/api' from VITE_API_URL if present
  const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  if (imagePath.startsWith('http')) return imagePath;
  return base + imagePath;
};

const FairPriceCheck: React.FC = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await jobPostService.getPublicJobPosts();
        console.log('Fetched job posts:', data);
        setJobPosts(data);
        setCategories(
          Array.from(
            new Set(
              (data as JobPost[])
                .map((j) => j.service?.name)
                .filter((v): v is string => typeof v === 'string' && v.length > 0)
            )
          )
        );
      } catch (e: any) {
        console.log('Error fetching job posts:', e);
        setError(e.message || 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);


  // Paginación local
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredJobs = jobPosts.filter((job) => {
    const matchesCategory = category ? job.service?.name === category : true;
    const matchesSearch =
      search.trim() === '' ||
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.description?.toLowerCase().includes(search.toLowerCase()) ||
      job.city?.toLowerCase().includes(search.toLowerCase()) ||
      job.address_line1?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Resetear página si cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-primary)', color: 'var(--color-secondary)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 space-y-10">
        <header className="rounded-3xl bg-white shadow-xl border border-[rgba(0,0,0,0.05)] px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.04)] px-2 py-0.5 tracking-[0.18em] uppercase text-[0.6rem] font-semibold text-[rgba(0,0,0,0.65)]">
              Homeowner Job Feed
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-secondary)] sm:text-5xl">
            Discover Fair-Priced Projects Posted by Homeowners
          </h1>
          <p className="mt-4 text-base text-[rgba(0,0,0,0.65)] sm:text-lg">
            Browse verified jobs across trades, compare real homeowner expectations, and reach out to the opportunities that match your crew and schedule.
          </p>
          <div className="mt-4 flex flex-wrap gap-1 text-xs text-[rgba(0,0,0,0.7)]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-2 py-0.5">
              <span className="size-1.5 rounded-full bg-[var(--color-primary)]" /> Fresh leads added hourly
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-2 py-0.5">
              <span className="size-1.5 rounded-full bg-[rgba(0,0,0,0.75)]" /> Transparent homeowner briefs
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-2 py-0.5">
              <span className="size-1.5 rounded-full bg-white" /> Fair-price budget ranges
            </span>
          </div>
          {/* Search bars */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by title, description, location, homeowner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-60 rounded-lg border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Services</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-2 text-center py-10 text-lg">Loading jobs...</div>
          ) : error ? (
            <div className="col-span-2 text-center py-10 text-red-600">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-gray-500">No jobs found.</div>
          ) : (
            <>
              {paginatedJobs.map((job) => (
                <article
                  key={job.id}
                  className="group overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ minHeight: 0 }}
                >
                  <div className="relative h-24 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {job.image_path ? (
                      <img
                        src={getImageUrl(job.image_path || undefined)}
                        alt={`${job.title} preview`}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105 rounded-t-2xl border-b border-gray-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 16.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l2.4 2.4a2.25 2.25 0 003.18 0l4.52-4.52" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                        </svg>
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                    <div
                      className={`absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${
                        job.service && job.service.name && categoryAccent[job.service.name]
                          ? categoryAccent[job.service.name]
                          : 'from-gray-400 to-gray-700'
                      } px-2 py-0.5 text-xs font-semibold text-white shadow-lg shadow-[rgba(0,0,0,0.2)]`}
                    >
                      <span className="drop-shadow">{job.service?.name || 'Servicio'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 px-2 pb-2 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h2 className="text-xs font-semibold text-[var(--color-secondary)] line-clamp-1">{job.title}</h2>
                      <span className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-[rgba(0,0,0,0.6)]">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-[10px] text-[rgba(0,0,0,0.65)] line-clamp-1">
                      {job.description}
                    </p>
                    <dl className="grid gap-1 text-[10px] text-[rgba(0,0,0,0.75)] sm:grid-cols-2">
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Nombre</dt>
                        <dd className="font-semibold text-[var(--color-secondary)]">{job.homeowner?.user?.name || ''}</dd>
                      </div>
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Email</dt>
                        <dd>{job.homeowner?.user?.email || ''}</dd>
                      </div>
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Teléfono</dt>
                        <dd>{job.homeowner?.user?.mobile_number || job.homeowner?.user?.phone_number || ''}</dd>
                      </div>
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Location</dt>
                        <dd>{job.city || job.address_line1 || ''}</dd>
                      </div>
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Budget</dt>
                        <dd>{job.price ? `${job.price} ${job.currency || ''}` : ''}</dd>
                      </div>
                      <div>
                        <dt className="text-[8px] uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Deadline</dt>
                        <dd>{job.deadline ? new Date(job.deadline).toLocaleDateString() : ''}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-0.5">
                      {job.service && 'slug' in job.service && job.service.slug && (
                        <span className="inline-flex items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[9px] text-[rgba(0,0,0,0.6)]">
                          {job.service.slug}
                        </span>
                      )}
                      {job.status && (
                        <span className="inline-flex items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[9px] text-[rgba(0,0,0,0.6)]">
                          {job.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-md transition hover:shadow-lg"
                        style={{ background: 'var(--color-secondary)' }}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="text-[10px] font-semibold underline-offset-4 transition hover:underline"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    className="px-2 py-1 rounded border text-xs disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-2 py-1 rounded border text-xs ${currentPage === i + 1 ? 'bg-[var(--color-primary)] text-white' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-2 py-1 rounded border text-xs disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default FairPriceCheck;