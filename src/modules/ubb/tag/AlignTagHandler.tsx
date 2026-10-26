// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './AlignTagHandler.module.scss';
import { getCssWideKeyword } from './cssWideKeyword';

/**
 * 处理 [align] 标签的处理器。
 */
export class AlignTagHandler extends Ubb.RecursiveTagHandler {

    get supportedTagNames(): string { return 'align' };

    execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
        const align = tagData.value('align');
        const keyword = getCssWideKeyword('text-align', align);
        const keywordClass = keyword ? ({
            initial: styles.initial,
            inherit: styles.inherit,
            unset: styles.unset,
            revert: styles.revert,
            'revert-layer': styles.revertLayer
        } as Record<string, string>)[keyword] : undefined;
        const style = keywordClass ? undefined : {
            '--ubb-align': align
        } as React.CSSProperties;

        return <span className={`${styles.align}${keywordClass ? ` ${keywordClass}` : ''}`} style={style}><div>{innerContent}</div></span>;
    }
}
