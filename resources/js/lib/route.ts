import * as routes from '@/routes';

type RoutePath = string;

export function route(name: RoutePath, params?: Record<string, any>): string {
    const parts = name.split('.');
    let current: any = routes;

    // Navigate through the nested routes object
    for (const part of parts) {
        current = current[part];
        if (!current) {
            console.error(`Route '${name}' not found`);
            return '#';
        }
    }

    // Call the route function or get the URL
    if (typeof current.url === 'function') {
        return current.url(params?.query ? { query: params.query } : undefined) ?? '#';
    } else if (typeof current === 'function') {
        const result = current(params?.query ? { query: params.query } : undefined);
        return result?.url ?? '#';
    }

    return '#';
}

// Make it available globally
if (typeof window !== 'undefined') {
    (window as any).route = route;
}

export default route;
