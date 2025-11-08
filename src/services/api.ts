import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
