export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return function (...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}