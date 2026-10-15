export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'https://genzfile-backend.onrender.com').replace(/\/$/, '');
const API_BASE = import.meta.env.DEV ? '/api' : `${BACKEND_URL}/api`;

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (import.meta.env.DEV) return url;
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function getAuthToken() {
  return localStorage.getItem('medialink_token') || null;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('medialink_token', token);
  } else {
    localStorage.removeItem('medialink_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = { text: await res.text() };
  }

  if (!res.ok) {
    const errorMsg = data?.error || res.statusText || 'Request failed';
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  socialLogin: (provider, email = null, name = null) =>
    request('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider, email, name }),
    }),
  getMe: () => request('/me'),
  updateProfile: (data) => request('/me', { method: 'PATCH', body: JSON.stringify(data) }),

  // Plans & Subscriptions
  getPlans: () => request('/plans'),
  subscribePlan: (planId, paymentMethod = 'card') =>
    request('/plans/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod }),
    }),

  // CutLuy Auto Payment Gateway
  createPayment: (planId) =>
    request('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
  checkPaymentStatus: (paymentId) =>
    request(`/payments/status/${paymentId}`),
  simulatePaymentSuccess: (paymentId, planId) =>
    request(`/payments/simulate-success/${paymentId}`, {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),

  // Uploads with XHR for accurate upload progress percentage
  uploadFiles: (files, folderId = null, onProgress = null) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      if (folderId && folderId !== 'root') {
        formData.append('folder_id', folderId);
      }

      xhr.open('POST', `${API_BASE}/uploads`);
      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent, event.loaded, event.total);
          }
        };
      }

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(res);
          } else {
            reject(new Error(res.error || 'Upload failed'));
          }
        } catch {
          reject(new Error('Invalid response from server'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },

  // Files
  getFiles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/files?${query}`);
  },
  getFile: (id) => request(`/files/${id}`),
  updateFile: (id, data) => request(`/files/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteFile: (id) => request(`/files/${id}`, { method: 'DELETE' }),
  bulkDeleteFiles: (fileIds) => request('/files/bulk-delete', { method: 'POST', body: JSON.stringify({ file_ids: fileIds }) }),
  restoreFile: (id) => request(`/files/${id}/restore`, { method: 'POST' }),
  permanentDeleteFile: (id) => request(`/files/${id}/permanent`, { method: 'DELETE' }),
  emptyTrash: () => request('/files/trash/empty', { method: 'DELETE' }),

  // Sharing
  createShareLink: (fileId, options = {}) => request(`/files/${fileId}/share`, { method: 'POST', body: JSON.stringify(options) }),
  getSharedFile: (token, authCode = null) => {
    const headers = {};
    if (authCode) headers['x-share-auth'] = authCode;
    return request(`/share/${token}`, { headers });
  },
  verifySharePassword: (token, password) => request(`/share/${token}/verify-password`, { method: 'POST', body: JSON.stringify({ password }) }),
  revokeShareLink: (id) => request(`/share/${id}`, { method: 'DELETE' }),

  // Folders
  getFolders: () => request('/folders'),
  createFolder: (folderName, parentId = null) => request('/folders', { method: 'POST', body: JSON.stringify({ folder_name: folderName, parent_id: parentId }) }),
  updateFolder: (id, folderName) => request(`/folders/${id}`, { method: 'PATCH', body: JSON.stringify({ folder_name: folderName }) }),
  deleteFolder: (id) => request(`/folders/${id}`, { method: 'DELETE' }),

  // Abuse Reports
  submitAbuseReport: (fileId, reason) => request('/reports', { method: 'POST', body: JSON.stringify({ file_id: fileId, reason }) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: (params = {}) => request(`/admin/users?${new URLSearchParams(params).toString()}`),
  updateAdminUser: (id, data) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminFiles: (params = {}) => request(`/admin/files?${new URLSearchParams(params).toString()}`),
  adminDeleteFile: (id) => request(`/admin/files/${id}`, { method: 'DELETE' }),
  getAdminReports: (status = 'all') => request(`/admin/reports?status=${status}`),
  updateAdminReport: (id, data) => request(`/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminAuditLogs: () => request('/admin/audit-logs'),
  getAdminSettings: () => request('/admin/settings'),
  updateAdminSettings: (data) => request('/admin/settings', { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminPayments: () => request('/admin/payments'),
  fulfillAdminPayment: (id) => request(`/admin/payments/${id}/fulfill`, { method: 'POST' }),
  adminAssignPlan: (userId, data) => request(`/admin/users/${userId}/plan`, { method: 'POST', body: JSON.stringify(data) }),
  adminCreateUser: (data) => request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),

  // GIF Studio & Converter
  convertVideoToGif: (formData, onProgress = null) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/gif/convert-video`);
      const token = getAuthToken();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
      }
      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(res);
          else reject(new Error(res.error || 'Conversion failed'));
        } catch {
          reject(new Error('Invalid server response'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error during conversion'));
      xhr.send(formData);
    });
  },

  convertImagesToGif: (formData, onProgress = null) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/gif/convert-images`);
      const token = getAuthToken();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
      }
      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(res);
          else reject(new Error(res.error || 'Conversion failed'));
        } catch {
          reject(new Error('Invalid server response'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error during conversion'));
      xhr.send(formData);
    });
  },

  convertFileToGif: (fileId, options = {}) =>
    request(`/gif/convert-file/${fileId}`, {
      method: 'POST',
      body: JSON.stringify(options),
    }),
};
