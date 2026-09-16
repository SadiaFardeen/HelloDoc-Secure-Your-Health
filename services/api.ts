const BASE_URL = 'http://localhost:5000';

async function safeJsonFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || `Server error: ${res.status}`);
      }
      return data;
    } else {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Server returned error (${res.status})`);
      }
      try {
        return JSON.parse(text);
      } catch {
        return { message: text };
      }
    }
  } catch (err: any) {
    if (err.message.includes('Failed to fetch') || err.message.includes('Network request failed')) {
      throw new Error('Cannot connect to backend server. Make sure server is running on port 5000.');
    }
    throw err;
  }
}

export const api = {
  register: async (payload: any) => {
    return safeJsonFetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: { email: string; password: string; role: 'patient' | 'doctor' }) => {
    return safeJsonFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getUserProfile: async (id: string | number) => {
    return safeJsonFetch(`${BASE_URL}/api/users/${id}`);
  },

  updateUserProfile: async (id: string | number, payload: any) => {
    return safeJsonFetch(`${BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getDoctors: async (search = '', specialization = 'All') => {
    return safeJsonFetch(`${BASE_URL}/doctors?search=${encodeURIComponent(search)}&specialization=${encodeURIComponent(specialization)}`);
  },

  getDoctorById: async (id: string | number) => {
    return safeJsonFetch(`${BASE_URL}/doctors/${id}`);
  },

  bookAppointment: async (payload: any) => {
    return safeJsonFetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getAppointments: async () => {
    return safeJsonFetch(`${BASE_URL}/appointments`);
  },

  cancelAppointment: async (id: number) => {
    return safeJsonFetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  createPrescription: async (payload: any) => {
    return safeJsonFetch(`${BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getPrescriptions: async () => {
    return safeJsonFetch(`${BASE_URL}/prescriptions`);
  },

  getMessages: async (doctorId: string | number) => {
    return safeJsonFetch(`${BASE_URL}/api/messages/${doctorId}`);
  },

  sendMessage: async (payload: { sender_role: string; sender_name: string; doctor_id: string | number; text: string }) => {
    return safeJsonFetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
};