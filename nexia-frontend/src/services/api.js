import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('nexia_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('nexia_token');
      localStorage.removeItem('nexia_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const chatApi = {
  send: (data) => api.post('/chat', data),
  history: () => api.get('/chat/history'),
};

export const resumeApi = {
  analyze: (formData) => api.post('/resume/analyze', formData),
  list: () => api.get('/resume'),
};

export const interviewApi = {
  start: (data) => api.post('/interview/start', data),
  submit: (data) => api.post('/interview/submit', data),
  history: () => api.get('/interview/history'),
};

export const jobApi = {
  list: (params) => api.get('/jobs', { params }),
  get: (id) => api.get(`/jobs/${id}`),
};

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

export const goalApi = {
  create: (data) => api.post('/goals', data),
  list: () => api.get('/goals'),
  updateProgress: (id, progress) => api.put(`/goals/${id}/progress?progress=${progress}`),
};

export default api;
