type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
        plausible?: (eventName: string, options?: { props?: AnalyticsParams }) => void;
    }
}

export function trackEvent(eventName: string, params?: AnalyticsParams) {
    window.gtag?.("event", eventName, params);
    window.plausible?.(eventName, params ? { props: params } : undefined);
}
