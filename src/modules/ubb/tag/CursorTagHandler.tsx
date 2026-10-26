// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './CursorTagHandler.module.scss';
import { getCssWideKeyword } from './cssWideKeyword';

/**
 * 处理 [cursor] 标签的处理器。
 */
export class CursorTagHandler extends Ubb.RecursiveTagHandler {

	get supportedTagNames(): string { return 'cursor' };

    execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
        const cursor = tagData.value('cursor');
        const keyword = getCssWideKeyword('cursor', cursor);
        const keywordClass = keyword ? ({
            initial: styles.initial,
            inherit: styles.inherit,
            unset: styles.unset,
            revert: styles.revert,
            'revert-layer': styles.revertLayer
        } as Record<string, string>)[keyword] : undefined;
        const style = keywordClass ? undefined : {
            '--ubb-cursor': cursor
        } as React.CSSProperties;

        return <span className={`${styles.cursor}${keywordClass ? ` ${keywordClass}` : ''}`} style={style}>{innerContent}</span>;
	}
}
