import { apiRequest } from './client';

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