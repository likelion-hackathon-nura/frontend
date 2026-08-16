import { apiRequest } from './client';

// 체크인 가능 여부 조회
export function getCheckinStatus(date) {
    const query = date
        ? `?date=${encodeURIComponent(date)}`
        : '';

    return apiRequest(`/api/checkin/status${query}`);
}

// 체크인 생성 및 피부 분석
export function createCheckin({
    date,
    fatigue,
    tightness,
    redness,
    photo,
}) {
    const formData = new FormData();

    formData.append('date', date);
    formData.append('fatigue', String(fatigue));
    formData.append('tightness', tightness);
    formData.append('redness', redness);

    if (photo) {
        formData.append('photo', photo);
    }

    return apiRequest('/api/checkin', {
        method: 'POST',
        body: formData,
    });
}

// 오늘의 회복 루틴 생성
export function generateSkinRoutine() {
    return apiRequest('/api/skin-routines/generate', {
        method: 'POST',
    });
}

// 오늘의 회복 루틴 조회
export function getTodaySkinRoutine() {
    return apiRequest('/api/skin-routines/today');
}

// 오늘의 회복 루틴 완료
export function completeTodaySkinRoutine() {
    return apiRequest('/api/skin-routines/today/complete', {
        method: 'PATCH',
    });
}

//
export const getTodaySkin = () => apiRequest('/api/skin/today')

//
export const getCheckinHistory = () => apiRequest('/api/checkin/history')

//
export const getCheckinDetail = checkinId => apiRequest(`/api/checkin/${checkinId}`)