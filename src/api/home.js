import { apiRequest } from './client';

export function getSchedules(startDate, endDate) {
  return apiRequest(`/api/schedules?startDate=${startDate}&endDate=${endDate}`);
}

export function createOrGetTodayHome() {
  return apiRequest('/api/home/today', { method: 'POST' });
}

export function getTodayHome() {
  return apiRequest('/api/home/today');
}
