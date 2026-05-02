import * as rootRoutes from '@/routes';
import admin from '@/routes/admin';
import auth from '@/routes/auth';
import customer from '@/routes/customer';
import profile from '@/routes/profile';
import vendor from '@/routes/vendor';

const routes: Record<string, unknown> = {
    ...rootRoutes,
    admin,
    auth,
    customer,
    profile,
    vendor,
};

type RoutePath = string;

function kebabOrSnakeToCamel(part: string): string {
    return part.replace(/[-_]([a-z])/g, (_, c: string) => c.toUpperCase());
}

function resolveSegment(obj: unknown, part: string): unknown {
    if (obj === null || typeof obj !== 'object') {
        return undefined;
    }
    const o = obj as Record<string, unknown>;
    if (part in o) {
        return o[part];
    }
    const camel = kebabOrSnakeToCamel(part);
    if (camel !== part && camel in o) {
        return o[camel];
    }
    return undefined;
}

function isQueryOptions(params: unknown): boolean {
    if (params === null || typeof params !== 'object' || Array.isArray(params)) {
        return false;
    }
    const keys = Object.keys(params as object);
    return keys.length > 0 && keys.every((k) => k === 'query' || k === 'mergeQuery');
}

function definitionNeedsBindings(leaf: { definition?: { url?: string } }): boolean {
    const url = leaf.definition?.url;
    return typeof url === 'string' && url.includes('{');
}

export function route(
    name: RoutePath,
    params?: Record<string, unknown> | string | number | unknown[],
): string {
    const parts = name.split('.');
    let current: unknown = routes;

    for (const part of parts) {
        current = resolveSegment(current, part);
        if (current === undefined) {
            console.error(`Route '${name}' not found`);
            return '#';
        }
    }

    const leaf = current as {
        url?: (...args: unknown[]) => string;
        definition?: { url?: string };
    };

    const hasPositionalArg =
        typeof params === 'string' ||
        typeof params === 'number' ||
        (Array.isArray(params) && params.length > 0);

    if (typeof leaf.url === 'function') {
        if (definitionNeedsBindings(leaf) && hasPositionalArg) {
            return leaf.url(params as string | number | unknown[], undefined) ?? '#';
        }
        if (
            definitionNeedsBindings(leaf) &&
            params !== undefined &&
            typeof params === 'object' &&
            !Array.isArray(params) &&
            !isQueryOptions(params)
        ) {
            return leaf.url(params, undefined) ?? '#';
        }
        if (params !== undefined && isQueryOptions(params)) {
            return leaf.url(params) ?? '#';
        }
        return leaf.url(undefined) ?? '#';
    }

    if (typeof current === 'function') {
        const fn = current as (first?: unknown, second?: unknown) => { url?: string };
        if (hasPositionalArg) {
            return fn(params)?.url ?? '#';
        }
        if (params !== undefined && isQueryOptions(params)) {
            return fn(params)?.url ?? '#';
        }
        return fn(undefined)?.url ?? '#';
    }

    return '#';
}

if (typeof window !== 'undefined') {
    (window as unknown as { route: typeof route }).route = route;
}

export default route;
