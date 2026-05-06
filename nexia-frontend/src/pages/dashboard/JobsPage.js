import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobApi } from '../../services/api';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Briefcase, MapPin, DollarSign, ExternalLink, Search, Clock, RefreshCw } from 'lucide-react';

const TYPE_COLORS = {
  FULL_TIME: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  PART_TIME: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  REMOTE:    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  CONTRACT:  'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', role: '' });

  const fetchJobs = () => {
    setLoading(true);
    jobApi.list(filters)
      .then(r => setJobs(r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchJobs(); }, []);

  const handleKeyDown = (e) => { if (e.key === 'Enter') fetchJobs(); };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Job Recommendations</h1>
        <button onClick={fetchJobs} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {jobs.length > 0 ? `${jobs.length} opportunities found` : 'Discover opportunities tailored to your skills'}
      </p>

      {/* Search Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="🔍 Role (e.g. React Developer, Java)"
            value={filters.role}
            onChange={e => setFilters({ ...filters, role: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          <input
            className="input flex-1"
            placeholder="📍 Location (e.g. Remote, Bangalore)"
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          <button onClick={fetchJobs} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Search size={16} /> Search Jobs
          </button>
        </div>
        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Remote', 'Bangalore', 'React', 'Java', 'Python', 'Data Science', 'DevOps'].map(tag => (
            <button key={tag} onClick={() => {
              const isLocation = ['Remote', 'Bangalore', 'Chennai', 'Mumbai', 'Hyderabad', 'Delhi', 'Pune'].includes(tag);
              const newFilters = isLocation
                ? { ...filters, location: tag }
                : { ...filters, role: tag };
              setFilters(newFilters);
              setLoading(true);
              jobApi.list(newFilters).then(r => setJobs(r.data)).catch(() => setJobs([])).finally(() => setLoading(false));
            }}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors cursor-pointer">
              {tag}
            </button>
          ))}
          {(filters.role || filters.location) && (
            <button onClick={() => { setFilters({ location: '', role: '' }); fetchJobs(); }}
              className="text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Job Listings */}
      {loading ? <SkeletonList count={5} /> : (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try different keywords or clear filters</p>
              <button onClick={() => { setFilters({ location: '', role: '' }); fetchJobs(); }}
                className="btn-secondary mt-4 text-sm">Show All Jobs</button>
            </div>
          ) : jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Company */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{job.company}</p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-gray-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={13} className="text-gray-400" /> {job.salaryRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-gray-400" />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[job.type] || TYPE_COLORS.FULL_TIME}`}>
                        {job.type?.replace('_', ' ')}
                      </span>
                    </span>
                  </div>

                  {/* Description */}
                  {job.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{job.description}</p>
                  )}

                  {/* Skills */}
                  {job.requiredSkills && (
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                        <span key={s} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0">
                  <a
                    href={job.applyUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-sm flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Apply Now <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
