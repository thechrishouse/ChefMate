import api from './axios-instance';


export const register = async (userData) => {
  return api.post('/api/auth/register', userData);
};

export const login = async (credentials) => {
  return api.post('/api/auth/login', credentials);
};

export const logout = async () => {
  return api.post('/api/auth/logout');
};

export const getProfile = async () => {
  return api.get('/api/auth/profile');
};

export const updateProfile = async (profileData) => {
  return api.put('/api/auth/profile', profileData);
};

export const changePassword = async (passwordData) => {
  return api.put('/api/auth/change-password', passwordData);
};
