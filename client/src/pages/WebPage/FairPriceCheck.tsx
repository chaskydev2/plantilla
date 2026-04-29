import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaRegCalendarAlt, FaUser, FaEnvelope, FaPhone, FaTag, FaEye, FaBookmark } from 'react-icons/fa';
import { jobPostService } from '@/core/services/job-posts/jobPost.service';

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
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${normalizedBase}${normalizedPath}`;
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-primary)', color: 'var(--color-secondary)' }}
    >
      {/* Modal for job details */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E17]/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <FaTag className="w-5 h-5" /> {selectedJob.title}
            </h2>
            <p className="mb-2 text-gray-700 flex items-center gap-2">
              <FaBriefcase className="w-4 h-4" /> {selectedJob.description}
            </p>
            <div className="mb-2 flex items-center gap-2">
              <FaUser className="w-4 h-4" /> {selectedJob.homeowner?.user?.name || ''}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" /> {selectedJob.homeowner?.user?.email || ''}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <FaPhone className="w-4 h-4" /> {selectedJob.homeowner?.user?.mobile_number || selectedJob.homeowner?.user?.phone_number || ''}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4" /> {selectedJob.city || selectedJob.address_line1 || ''}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <FaDollarSign className="w-4 h-4" /> {selectedJob.price ? `${selectedJob.price} ${selectedJob.currency || ''}` : ''}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <FaRegCalendarAlt className="w-4 h-4" /> {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : ''}
            </div>
            {selectedJob.image_path && (
              <img src={getImageUrl(selectedJob.image_path)} alt="Job" className="rounded-lg mt-2 w-full object-cover" />
            )}
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 space-y-10">
        <header className="rounded-2xl border px-6 py-10 md:px-10 shadow-sm" style={{ background: 'white', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', opacity: 1, transform: 'none' }}>
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.04)] px-2 py-0.5 tracking-[0.18em] uppercase text-[0.7rem] font-bold text-[var(--color-secondary)]">
              Homeowner Job Feed
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-secondary)]">
            Fair-Priced Projects
          </h1>
          
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
                  className="group rounded-2xl border   shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-lg"
                  style={{ background: 'white', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', opacity: 1, transform: 'none' }}
                >
                  <div className="relative h-40 overflow-hidden rounded-2xl">
                    {job.image_path ? (
                      <img
                        src={getImageUrl(job.image_path || undefined)}
                        alt={`${job.title} preview`}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 16.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l2.4 2.4a2.25 2.25 0 003.18 0l4.52-4.52" />
                          <circle cx="8.5" cy="8.5" r="1.4" />
                        </svg>
                        <span className="text-xs uppercase tracking-[0.2em]">No image</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                    <div
                      className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${
                        job.service && job.service.name && categoryAccent[job.service.name]
                          ? categoryAccent[job.service.name]
                          : 'from-gray-500 to-gray-800'
                      } px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-black/30`}
                    >
                      <FaBriefcase className="h-3.5 w-3.5" />
                      {job.service?.name || 'Servicio'}
                    </div>
                    {job.price && (
                      <div className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-lg backdrop-blur">
                        {`${job.price} ${job.currency || ''}`.trim()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 px-4 pb-5 pt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="flex flex-1 items-center gap-2 text-base font-semibold text-[var(--color-secondary)]">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-secondary)]">
                          <FaTag className="h-4 w-4" />
                        </span>
                        <span className="line-clamp-1">{job.title}</span>
                      </h2>
                      {job.status && (
                        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                          {job.status}
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 text-sm text-slate-600">
                      {job.description || 'Sin descripción disponible'}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          <FaRegCalendarAlt className="h-3.5 w-3.5" /> Deadline
                        </span>
                        <p className="mt-1 text-sm font-semibold text-[var(--color-secondary)]">
                          {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Sin fecha'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          <FaMapMarkerAlt className="h-3.5 w-3.5" /> Ubicación
                        </span>
                        <p className="mt-1 text-sm font-semibold text-[var(--color-secondary)]">
                          {job.city || job.address_line1 || 'Sin ubicación'}
                        </p>
                      </div>
                    </div>

                    <dl className="rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <FaUser className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Homeowner</dt>
                          <dd className="text-sm font-semibold text-[var(--color-secondary)]">{job.homeowner?.user?.name || 'N/A'}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-b border-slate-100 py-2">
                        <FaEnvelope className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Email</dt>
                          <dd className="text-sm font-semibold">{job.homeowner?.user?.email || 'N/A'}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <FaPhone className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Contacto</dt>
                          <dd className="text-sm font-semibold">{job.homeowner?.user?.mobile_number || job.homeowner?.user?.phone_number || 'N/A'}</dd>
                        </div>
                      </div>
                    </dl>

                    <div className="flex flex-wrap gap-2">
                      {job.service?.slug && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-3 py-1 text-[11px] font-medium text-slate-600">
                          <FaTag className="h-3 w-3" />
                          {job.service.slug}
                        </span>
                      )}
                      {job.currency && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-3 py-1 text-[11px] font-medium text-slate-600">
                          <FaDollarSign className="h-3 w-3" />
                          {job.currency}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--color-secondary)]/40 transition hover:scale-105"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowModal(true);
                        }}
                      >
                        <FaEye className="h-4 w-4" /> Ver detalle
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-secondary)]/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] transition hover:border-[var(--color-secondary)]"
                      >
                        <FaBookmark className="h-4 w-4" /> Guardar
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