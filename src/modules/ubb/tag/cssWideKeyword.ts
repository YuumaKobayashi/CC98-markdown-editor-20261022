export type CssWideKeyword = 'initial' | 'inherit' | 'unset' | 'revert' | 'revert-layer';

const cssWideKeywords = new Set<string>(['initial', 'inherit', 'unset', 'revert', 'revert-layer']);

let declaration: CSSStyleDeclaration | undefined;

function asCssWideKeyword(value: string): CssWideKeyword | undefined {
    return cssWideKeywords.has(value) ? value as CssWideKeyword : undefined;
}

export function getParsedCssPropertyValue(property: string, value: string): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    declaration ??= document.createElement('span').style;
    declaration.removeProperty(property);
    declaration.setProperty(property, value);

    return declaration.getPropertyValue(property).trim() || undefined;
}

export function getCssWideKeyword(property: string, value: string): CssWideKeyword | undefined {
    if (typeof document === 'undefined') {
        return asCssWideKeyword(value.trim().toLowerCase());
    }

    declaration ??= document.createElement('span').style;
    declaration.removeProperty(property);
    declaration.setProperty(property, value);

    return asCssWideKeyword(declaration.getPropertyValue(property).trim().toLowerCase());
}
