const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('admitwise_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-only cookies
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // If response is a downloadable blob (like PDF)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    if (!response.ok) {
      throw new Error('Failed to generate report PDF.');
    }
    return response.blob();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
};

// Student API
export const studentAPI = {
  getProfile: () => request('/students/profile'),
  updateProfile: (body) => request('/students/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getDashboard: () => request('/students/dashboard'),
};

// College API
export const collegesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return request(`/colleges?${query.toString()}`);
  },
  getById: (id) => request(`/colleges/${id}`),
  getFeatured: () => request('/colleges/featured'),
  getCities: () => request('/colleges/cities'),
  compare: (collegeIds, courseId) =>
    request('/colleges/compare', {
      method: 'POST',
      body: JSON.stringify({ collegeIds, courseId }),
    }),
};

// Courses API
export const coursesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/courses${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/courses/${id}`),
};

// Prediction API
export const predictionsAPI = {
  create: (body) => request('/predictions', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/predictions/history${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/predictions/${id}`),
  delete: (id) => request(`/predictions/${id}`, { method: 'DELETE' }),
  downloadPdf: (id) => request(`/predictions/${id}/pdf`),
};

// Favourites API
export const favouritesAPI = {
  getAll: () => request('/favourites'),
  add: (collegeId) => request(`/favourites/${collegeId}`, { method: 'POST' }),
  remove: (collegeId) => request(`/favourites/${collegeId}`, { method: 'DELETE' }),
  check: (collegeId) => request(`/favourites/check/${collegeId}`),
};

// Guidance API
export const guidanceAPI = {
  getAll: (category) => request(`/guidance${category ? `?category=${category}` : ''}`),
  getBySlug: (slug) => request(`/guidance/${slug}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => request('/admin/dashboard'),
  getColleges: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/colleges${query ? `?${query}` : ''}`);
  },
  createCollege: (body) => request('/admin/colleges', { method: 'POST', body: JSON.stringify(body) }),
  updateCollege: (id, body) => request(`/admin/colleges/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCollege: (id) => request(`/admin/colleges/${id}`, { method: 'DELETE' }),
  createCourse: (body) => request('/admin/courses', { method: 'POST', body: JSON.stringify(body) }),
  updateCourse: (id, body) => request(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCourse: (id) => request(`/admin/courses/${id}`, { method: 'DELETE' }),
  getCutoffs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/cutoffs${query ? `?${query}` : ''}`);
  },
  createCutoff: (body) => request('/admin/cutoffs', { method: 'POST', body: JSON.stringify(body) }),
  updateCutoff: (id, body) => request(`/admin/cutoffs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCutoff: (id) => request(`/admin/cutoffs/${id}`, { method: 'DELETE' }),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`);
  },
  toggleUserStatus: (id) => request(`/admin/users/${id}/toggle-status`, { method: 'PATCH' }),
};
