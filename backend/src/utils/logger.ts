/**
 * @file logger.ts
 * @description Centralized logging utility for the backend.
 * Respects the globalStore's enableLogging flag.
 */

import { globalStore } from '../store';

export const Logger = {
    /**
     * Core logging function. Only prints if logging is enabled in the store.
     * @param context The area of the app (e.g., 'ORDER_SERVICE', 'STORE')
     * @param message Descriptive message of the trace
     * @param data Optional object containing trace details/payload
     */
    trace(context: string, message: string, data?: any) {
        if (globalStore.getState().enableLogging) {
            console.log(
                `[TRACE][${context}] ${new Date().toISOString()} - ${message}`,
                data ? JSON.stringify(data, null, 2) : ''
            );
        }
    },

    /**
     * Specialized log for security-relevant events.
     */
    security(message: string, data?: any) {
        this.trace('SECURITY', message, data);
    }
};
