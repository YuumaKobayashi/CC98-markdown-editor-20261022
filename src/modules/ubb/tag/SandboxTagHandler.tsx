// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import * as Ubb from '../engine/Core';
import { UrlTagHandler } from './URLTagHandler';
import parse from 'url-parse';
import {
	type CssWideKeyword,
	getCssWideKeyword,
	getParsedCssPropertyValue,
} from './cssWideKeyword';
import styles from './SandboxTagHandler.module.scss';

const widthKeywordClasses: Record<CssWideKeyword, string> = {
	initial: styles.widthInitial,
	inherit: styles.widthInherit,
	unset: styles.widthUnset,
	revert: styles.widthRevert,
	'revert-layer': styles.widthRevertLayer,
};

const heightKeywordClasses: Record<CssWideKeyword, string> = {
	initial: styles.heightInitial,
	inherit: styles.heightInherit,
	unset: styles.heightUnset,
	revert: styles.heightRevert,
	'revert-layer': styles.heightRevertLayer,
};

export default class SandBoxTagHandler extends Ubb.RecursiveTagHandler {
	get supportedTagNames(): string {
		return 'sandbox';
	}

	/**
	 * 获取一个值，指示当前浏览器是否支持 sandbox 功能。
	 * @returns {boolean} 如果浏览器支持 sandbox 功能，返回 true；否则返回 false。 
	 */
	private static get supportSandBox(): boolean {
		return 'sandbox' in document.createElement('iframe');
	}

	execCore(innerContent: React.ReactNode, tagData: Ubb.UbbTagData, context: Ubb.UbbCodeContext): React.ReactNode {

		// 不支持则直接返回内容
		if (!SandBoxTagHandler.supportSandBox) {
			return innerContent;
		}

		const url = parse(tagData.value('url'));

		if(!UrlTagHandler.isSafe(url)) {
			return innerContent;
		}

		const width = tagData.value('width');
		const height = tagData.value('height');
		const parsedWidth = getParsedCssPropertyValue('width', width);
		const parsedHeight = getParsedCssPropertyValue('height', height);
		const widthKeyword = parsedWidth ? getCssWideKeyword('width', width) : undefined;
		const heightKeyword = parsedHeight ? getCssWideKeyword('height', height) : undefined;
		const widthClass = widthKeyword
			? widthKeywordClasses[widthKeyword]
			: parsedWidth
				? styles.width
				: undefined;
		const heightClass = heightKeyword
			? heightKeywordClasses[heightKeyword]
			: parsedHeight
				? styles.height
				: undefined;
		const style = {
			...(parsedWidth && !widthKeyword ? { '--ubb-sandbox-width': width } : {}),
			...(parsedHeight && !heightKeyword ? { '--ubb-sandbox-height': height } : {}),
		} as React.CSSProperties;
		const hasCustomDimension =
			(parsedWidth && !widthKeyword) || (parsedHeight && !heightKeyword);
		const className = [styles.frame, widthClass, heightClass].filter(Boolean).join(' ');

		return <iframe sandbox="allow-scripts allow-forms allow-same-origin" src={url.href} className={className} style={hasCustomDimension ? style : undefined}>{innerContent}</iframe>;
	}
}
