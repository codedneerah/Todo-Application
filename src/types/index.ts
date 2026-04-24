export interface Todo {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: number;
  name?: string;
  email: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'completed' | 'incomplete' | '';
  category?: string;
  priority?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// API AxiosInstance type
import type { AxiosInstance } from 'axios';

export type ApiClient = AxiosInstance;

