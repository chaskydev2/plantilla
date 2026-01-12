import React, { useEffect, useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '');
const PUBLIC_JOBS_URL = `${API_BASE_URL}/v1/job-posts/public`;

interface JobPost {
  id: number;
  title: string;
  description: string;
  city: string | null;
  price: string | null;
  currency: string | null;
  status: string;
  image_path: string | null;
  service?: { name: string; icon?: string } | null;
  homeowner?: { user_id: number } | null;
  deadline: string | null;
}

const PublicJobFeed: React.FC = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(PUBLIC_JOBS_URL);
        const data = await res.json();
        setJobs(data.data || []);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Public Job Posts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-xl border shadow p-4 bg-white flex flex-col gap-3">
              {job.image_path ? (
                <img
                  src={`${API_BASE_URL}/${job.image_path.replace(/^\//, '')}`}
                  alt={job.title}
                  className="rounded-lg w-full h-48 object-cover mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-2">
                  No image
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">{job.status.toUpperCase()}</span>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-700 text-sm">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.city && <span className="bg-gray-100 px-2 py-1 rounded text-xs">{job.city}</span>}
                  {job.price && <span className="bg-green-100 px-2 py-1 rounded text-xs">{job.price} {job.currency}</span>}
                  {job.service?.name && <span className="bg-blue-100 px-2 py-1 rounded text-xs">{job.service.name}</span>}
                  {job.deadline && <span className="bg-yellow-100 px-2 py-1 rounded text-xs">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicJobFeed;
