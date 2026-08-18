import { apiRequest } from './client';

// 새 일정을 오늘 시간표에 적용했을 때 Refresh Time이 얼마나 줄어드는지 가상 계산만 한다.
// status: AVAILABLE(바로 등록 가능) | REFRESH_REDUCED(경고 화면 필요)
export function checkEvent(payload) {
  return apiRequest('/api/events/check', { method: 'POST', body: payload });
}

export function createEvent(payload) {
  return apiRequest('/api/events', { method: 'POST', body: payload });
}

export function getEventRecommendations(payload) {
  return apiRequest('/api/events/recommendations', { method: 'POST', body: payload });
}
