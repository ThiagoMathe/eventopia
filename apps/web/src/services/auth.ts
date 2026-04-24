import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const signUp = async (name: string, email: string, password: string, phone: string) => {
  const response = await api.post('/auth/signup', { 
    name, 
    email, 
    password, 
    phone 
  });
  
  if (response.data.access_token) {
    localStorage.setItem('eventopia_token', response.data.access_token);
  }
  
  return response.data;
};

export const signIn = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  
  if (response.data.access_token) {
    localStorage.setItem('eventopia_token', response.data.access_token);
  }
  
  return response.data;
};