import PKG from '../package.json';
export function resolve(specifier, parent, defaultResolve) {
    if (specifier === PKG.name) {
        specifier = new URL('../lib/temporal.mjs', import.meta.url).toString();
    }
    return defaultResolve(specifier, parent);
}
