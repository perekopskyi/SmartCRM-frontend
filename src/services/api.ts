import axios from 'axios';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Customer API
export const customersApi = {
  getAll: () => api.get('/customers'),
  getOne: (id: number) => api.get(`/customers/${id}`),
  create: (data: { name: string; email: string; phone: string }) => api.post('/customers', data),
  update: (id: number, data: Partial<{ name: string; email: string; phone: string }>) =>
    api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers?id=${id}`),
};

// Stats API
export const statsApi = {
  get: () => api.get('/stats'),
};

// Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Stats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}
