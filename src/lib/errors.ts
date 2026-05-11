import axios from 'axios';
import { backendErrorLabel } from './labels';

export function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === 'string') return backendErrorLabel(data);
        if (typeof data === 'object' && data !== null) {
            if ('message' in data) {
                const message = data.message;
                if (Array.isArray(message)) return message.map((item) => backendErrorLabel(String(item))).join(', ');
                if (typeof message === 'string') return backendErrorLabel(message);
            }
            if ('error' in data && typeof data.error === 'string') return backendErrorLabel(data.error);
        }
    }
    if (error instanceof Error && error.message) return backendErrorLabel(error.message);
    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return backendErrorLabel(error.message);
    }
    return fallback;
}
