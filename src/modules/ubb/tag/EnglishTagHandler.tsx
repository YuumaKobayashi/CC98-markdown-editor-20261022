// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import styles from './EnglishTagHandler.module.scss';

/**
 * 处理 [english] 标签的处理器。
 */
export class EnglishTagHandler extends Ubb.RecursiveTagHandler {
	get supportedTagNames(): string {
		return 'english';
	}

	execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {
		return <span className={styles.english}>{innerContent}</span>;
	}
}
