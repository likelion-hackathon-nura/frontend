import { apiRequest } from './client';

export const getWeeklyReport = () => apiRequest('/api/reports/weekly');