import PKG from '../package.json';
export function resolve(specifier, parent, defaultResolve) {
    if (specifier === PKG.name) {
        specifier = new URL('../index.js', import.meta.url).toString();
    }
    return defaultResolve(specifier, parent);
}
