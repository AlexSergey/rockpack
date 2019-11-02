import objectPath from 'object-path';

export default function(pth: string, defaultValue: any): any {
    if (typeof window === 'undefined') {
        return defaultValue;
    }

    let result = objectPath.get(window, pth);

    if (!!result) {
        return result;
    }
    return defaultValue;
}
