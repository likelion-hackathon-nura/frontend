import { apiRequest } from './client';

export function ocrSchedules(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  return apiRequest('/api/schedules/ocr', { method: 'POST', body: formData });
}

export function saveSchedules({ source, schedules }) {
  return apiRequest('/api/schedules', { method: 'PUT', body: { source, schedules } });
}
