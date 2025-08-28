export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return function (...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Parses and compares SiYuan kernel versions.
 * 
 * @returns An object containing:
 *   - major: The major version number
 *   - minor: The minor version number
 *   - patch: The patch version number
 *   - version: The full version string
 *   - compare: A function to compare against another version string
 */
export const siyuanVersion = () => {
    //@ts-ignore
    const version = window.siyuan.config.system.kernelVersion;
    const [major, minor, patch] = version.split('.').map(Number);

    const cmp = (n1: number, n2: number) => {
        if (n1 > n2) {
            return 1;
        } else if (n1 < n2) {
            return -1;
        } else {
            return 0;
        }
    };

    return { 
        major, minor, patch, version,
        /**
         * Compare the current version against another version string.
         * @param anotherVersion 
         * @returns -1 if current version is less, 1 if greater, 0 if equal
         */
        compare: (anotherVersion: string) => {
            const [amajor, aminor, apatch] = anotherVersion.split('.').map(Number);
            return cmp(major, amajor) || cmp(minor, aminor) || cmp(patch, apatch);
        }
    };
}
