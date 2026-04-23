import { api } from './api';

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/signin', { email, password });
  
  if (data.access_token) {
    localStorage.setItem('eventopia_token', data.access_token);
  }
  
  return data;
};