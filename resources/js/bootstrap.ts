import route from 'ziggy-js';

declare global {
    var route: typeof route;
}

window.route = route;

export {};

