// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './TableTagHandler.module.scss';

/**
 * 处理 [table] 标签的处理器。
 */
export class TableTagHandler extends Ubb.RecursiveTagHandler {

    get supportedTagNames(): string { return 'table' };

    execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
        const rows = React.Children.toArray(innerContent).filter(child =>
            typeof child !== 'string' || child.trim().length > 0
        );

        return <table className={styles.tableTag}><tbody>{rows}</tbody></table>;
    }
}
