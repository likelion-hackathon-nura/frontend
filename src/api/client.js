import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenStorage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export class ApiError extends Error {
  constructor({ code, message, data }) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

let refreshPromise = null;

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError({ code: 'AUTH_REFRESH_TOKEN_REQUIRED', message: '리프레시 토큰이 필요합니다.' });

  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const body = await res.json();

  if (!res.ok || !body.success) {
    throw new ApiError({ code: body.code, message: body.message, data: body.data });
  }

  setTokens({ accessToken: body.data.accessToken, refreshToken: body.data.refreshToken });
  return body.data.accessToken;
}

// Access Token 만료(401)면 /api/auth/refresh로 한 번만 재발급받아 원 요청을 재시도한다.
// refresh마저 실패하면 저장된 토큰을 지우고 로그인 화면으로 보낸다.
export async function apiRequest(path, { method = 'GET', body, auth = true, isRetry = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const responseBody = await res.json();

  if (res.ok && responseBody.success) {
    return responseBody.data;
  }

  const isExpiredAccessToken = res.status === 401 && auth && !isRetry;
  if (isExpiredAccessToken) {
    try {
      if (!refreshPromise) refreshPromise = refreshTokens().finally(() => { refreshPromise = null; });
      await refreshPromise;
      return apiRequest(path, { method, body, auth, isRetry: true });
    } catch (refreshError) {
      clearTokens();
      window.location.href = '/';
      throw refreshError;
    }
  }

  throw new ApiError({ code: responseBody.code, message: responseBody.message, data: responseBody.data });
}
