// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './FontTagHandler.module.scss';
import { getCssWideKeyword } from './cssWideKeyword';

/**
 * 处理 [font] 标签的处理器。
 */
export class FontTagHandler extends Ubb.RecursiveTagHandler {

    get supportedTagNames(): string { return 'font' };

    execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
        const font = tagData.value('font');
        const keyword = getCssWideKeyword('font-family', font);
        const keywordClass = keyword ? ({
            initial: styles.initial,
            inherit: styles.inherit,
            unset: styles.unset,
            revert: styles.revert,
            'revert-layer': styles.revertLayer
        } as Record<string, string>)[keyword] : undefined;
        const style = keywordClass ? undefined : {
            '--ubb-font-family': font
        } as React.CSSProperties;

        return <span className={`${styles.font}${keywordClass ? ` ${keywordClass}` : ''}`} style={style}>{innerContent}</span>;
    }
}
