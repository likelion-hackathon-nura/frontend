import { apiRequest } from './client';

export function getCheckinStatus(date) {
    const query = date
        ? `?date=${encodeURIComponent(date)}`
        : '';

    return apiRequest(`/api/checkin/status${query}`);
}

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

export function generateSkinRoutine() {
    return apiRequest('/api/skin-routines/generate', {
        method: 'POST',
    });
}

export function getTodaySkinRoutine() {
    return apiRequest('/api/skin-routines/today');
}

export function completeTodaySkinRoutine() {
    return apiRequest('/api/skin-routines/today/complete', {
        method: 'PATCH',
    });
}

export const getTodaySkin = () => apiRequest('/api/skin/today')

export const getCheckinHistory = () => apiRequest('/api/checkin/history')

export const getCheckinDetail = checkinId => apiRequest(`/api/checkin/${checkinId}`)

export function analyzeCosmeticOcr(photo) {
    const formData = new FormData()

    formData.append('photo', photo)

    return apiRequest('/api/cosmetics/ocr', {
        method: 'POST',
        body: formData,
    })
}

export function registerCosmetic({
    cosmeticBrand,
    cosmeticName,
    cosmeticType,
    cosmeticIngredients,
    coreIngredients,
    cosmeticUrl,
}) {
    return apiRequest('/api/cosmetics', {
        method: 'POST',
        body: {
            cosmeticBrand,
            cosmeticName,
            cosmeticType,
            cosmeticIngredients,
            coreIngredients,
            cosmeticUrl,
        },
    })
}

export const getRegisteredCosmetics = () =>
    apiRequest('/api/cosmetics')

export const getRegisteredCosmeticDetail = cosmeticId =>
    apiRequest(`/api/cosmetics/${cosmeticId}`)

export const deleteRegisteredCosmetic = cosmeticId =>
    apiRequest(`/api/cosmetics/${cosmeticId}`, {
        method: 'DELETE',
    })