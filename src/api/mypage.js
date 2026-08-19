import { apiRequest } from './client';

export function getMyInfo() {
    return apiRequest('/api/me');
}

export function updateMyInfo({
    nickname,
    newPassword,
    newPasswordConfirm,
}) {
    return apiRequest('/api/me', {
        method: 'PATCH',
        body: {
            nickname,
            newPassword,
            newPasswordConfirm,
        },
    });
}

export function getMyPreferences() {
    return apiRequest('/api/me/preferences');
}

export function updateMyPreferences(preferences) {
    return apiRequest('/api/me/preferences', {
        method: 'PUT',
        body: preferences,
    });
}

export function submitScheduleFeedback({
    myWeight,
    refreshWeight,
    feedbackContents,
}) {
    return apiRequest('/api/schedule-feedback', {
        method: 'POST',
        body: {
            myWeight,
            refreshWeight,
            feedbackContents,
        },
    });
}

export function logoutUser() {
    return apiRequest('/api/auth/logout', {
        method: 'POST',
    });
}

export function deleteUserAccount() {
    return apiRequest('/api/auth/me', {
        method: 'DELETE',
    });
}