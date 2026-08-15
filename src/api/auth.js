import { apiRequest } from './client';

export function signup({ email, password, nickname }) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    auth: false,
    body: { email, password, nickname },
  });
}

export function login({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
}

export function submitOnboarding(payload) {
  return apiRequest('/api/onboarding', {
    method: 'POST',
    body: payload,
  });
}
