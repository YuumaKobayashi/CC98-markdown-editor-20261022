// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './ColorTagHandler.module.scss';
import { getCssWideKeyword } from './cssWideKeyword';

/**
 * 处理 [color] 标签的处理器。
 */
export class ColorTagHandler extends Ubb.RecursiveTagHandler {
    get supportedTagNames(): string {
        return 'color';
    }

    execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
        
        const color = tagData.value('color');
        const keyword = getCssWideKeyword('color', color);
        const keywordClass = keyword ? ({
            initial: styles.initial,
            inherit: styles.inherit,
            unset: styles.unset,
            revert: styles.revert,
            'revert-layer': styles.revertLayer
        } as Record<string, string>)[keyword] : undefined;
        const style = keywordClass ? undefined : {
            '--ubb-color': color
        } as React.CSSProperties;

        return <span className={`${styles.color}${keywordClass ? ` ${keywordClass}` : ''}`} style={style}>{innerContent}</span>;
    }
}
