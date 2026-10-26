// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as Ubb from './Core';
import { NoUbbTagHandler } from '../tag/NoUbbTagHandler';
import { BTagHandler } from '../tag/BTagHandler';
import { ImageTagHandler } from '../tag/ImageTagHandler';
import { ITagHandler } from '../tag/ITagHandler';
import { SizeTagHandler } from '../tag/SizeTagHandler';
import { QuoteTagHandler } from '../tag/QuoteTagHandler';
import { ColorTagHandler } from '../tag/ColorTagHandler';
import { UrlTagHandler } from '../tag/URLTagHandler';
import { UTagHandler } from '../tag/UTagHandler';
import { DelTagHandler } from '../tag/DelTagHandler';
import { AudioTagHandler } from '../tag/AudioTagHandler';
import { VideoTagHandler } from '../tag/VideoTagHandler';
import { CursorTagHandler } from '../tag/CursorTagHandler';
import { EnglishTagHandler } from '../tag/EnglishTagHandler';
import { UserTagHandler } from '../tag/UserTagHandler';
import { CodeTagHandler } from '../tag/CodeTagHandler';
import { FontTagHandler } from '../tag/FontTagHandler';
import { AlignTagHandler } from '../tag/AlignTagHandler';
import { UploadTagHandler } from '../tag/UploadTagHandler';
import { LeftTagHandler } from '../tag/LeftTagHandler';
import { CenterTagHandler } from '../tag/CenterTagHandler';
import { RightTagHandler } from '../tag/RightTagHandler';
import { TableTagHandler } from '../tag/TableTagHandler';
import { TdTagHandler } from '../tag/TdTagHandler';
import { ThTagHandler } from '../tag/ThTagHandler';
import { TrTagHandler } from '../tag/TrTagHandler';
import { TopicTagHandler } from '../tag/TopicTagHandler';
import { BoardTagHandler } from '../tag/BoardTagHandler';
import { MdTagHandler } from '../tag/MdTagHandler';
import { PmTagHandler } from '../tag/PmTagHandler'
import { BiliTagHandler } from '../tag/BiliTagHandler'
// import SandBoxTagHandler from '../tag/SandboxTagHandler';
import LineTagHandler from '../tag/LineTagHandler';
import EmTagHandler from '../tag/EmTagHandler';
import AcTagHandler from '../tag/AcTagHandler';
import MahjongTagHandler from '../tag/MahjongTagHandler';
import TbTagHandler from '../tag/TbTagHandler';
import BiliTextHandler from '../tag/BiliTextHandler';
import UrlTextHandler from '../tag/UrlTextHandler';
import UrlTextHandler2 from '../tag/UrlTextHandler2';
import NeedReplyTagHandler from '../tag/NeedReplyTagHandler';
import Ms from '../tag/MsTagHandler';
import CC98 from '../tag/CC98TagHandler';
import { PosterOnlyTagHanlder } from '../tag/PosterOnlyTagHandler';
import { AllowViewerTagHanlder } from '../tag/AllowViewerTagHanlder';

// KaTeX 版本：公式按需加载自托管静态资源，不再依赖全局 MathJax 脚本，
// 原 MathJax 实现的 React 18 兼容问题随之移除。
import { MathTagHandler } from '../tag/MathTagHandler';

/**
 * 创建一个解析签名档用的engine
 */
export function createSignatureEngine(): Ubb.UbbCodeEngine {
	const engine = new Ubb.UbbCodeEngine();

	engine.handlers.register(BTagHandler);
	engine.handlers.register(ImageTagHandler);
	engine.handlers.register(ITagHandler);
	engine.handlers.register(SizeTagHandler);
	engine.handlers.register(ColorTagHandler);
	engine.handlers.register(UrlTagHandler);
	engine.handlers.register(UTagHandler);
	engine.handlers.register(DelTagHandler);
	engine.handlers.register(AudioTagHandler);
	engine.handlers.register(FontTagHandler);
	engine.handlers.register(AlignTagHandler);
	engine.handlers.register(LeftTagHandler);
	engine.handlers.register(CenterTagHandler);
	engine.handlers.register(RightTagHandler);
	engine.handlers.register(TopicTagHandler);
	engine.handlers.register(BoardTagHandler);
	engine.handlers.register(PmTagHandler);
	engine.handlers.register(NoUbbTagHandler);

	engine.handlers.registerText(UrlTextHandler);
	engine.handlers.registerText(UrlTextHandler2);

	return engine;
}

/**
 * 创建一个具有所有功能的默认引擎。
 */
export function createEngine(): Ubb.UbbCodeEngine {

	const engine = new Ubb.UbbCodeEngine();

	// 在此处添加引擎所支持的所有标签处理器
	engine.handlers.register(BTagHandler);
	engine.handlers.register(ImageTagHandler);
	engine.handlers.register(ITagHandler);
	engine.handlers.register(SizeTagHandler);
	engine.handlers.register(QuoteTagHandler);
	engine.handlers.register(ColorTagHandler);
	engine.handlers.register(UrlTagHandler);
	engine.handlers.register(UTagHandler);
	engine.handlers.register(DelTagHandler);
	engine.handlers.register(AudioTagHandler);
	engine.handlers.register(VideoTagHandler);
	engine.handlers.register(CursorTagHandler);
	engine.handlers.register(EnglishTagHandler);
	engine.handlers.register(UserTagHandler);
	engine.handlers.register(CodeTagHandler);
	engine.handlers.register(FontTagHandler);
	engine.handlers.register(AlignTagHandler);
	engine.handlers.register(UploadTagHandler);
	engine.handlers.register(LeftTagHandler);
	engine.handlers.register(CenterTagHandler);
	engine.handlers.register(RightTagHandler);
	engine.handlers.register(TableTagHandler);
	engine.handlers.register(TdTagHandler);
	engine.handlers.register(ThTagHandler);
	engine.handlers.register(TrTagHandler);
	engine.handlers.register(TopicTagHandler);
	engine.handlers.register(BoardTagHandler);
	engine.handlers.register(MdTagHandler);
	engine.handlers.register(LineTagHandler);
	engine.handlers.register(PmTagHandler);
	engine.handlers.register(NoUbbTagHandler);
	engine.handlers.register(BiliTagHandler);
	engine.handlers.register(MathTagHandler);

	engine.handlers.register(NeedReplyTagHandler);
	engine.handlers.register(PosterOnlyTagHanlder);
	engine.handlers.register(AllowViewerTagHanlder);

	// 以下是未命名标签处理程序(单个标签处理程序能处理多个标签名)，注意未命名标签处理程序的命中和注册顺序有关
	engine.handlers.register(EmTagHandler);
	engine.handlers.register(AcTagHandler);
	engine.handlers.register(MahjongTagHandler);
	engine.handlers.register(Ms);
	engine.handlers.register(CC98);
	engine.handlers.register(TbTagHandler);

// 以下是文字处理程序，注意文字的处理顺序完全取决于处理程序，请注意控制处理程序的顺序
	//engine.handlers.registerText(BiliTextHandler);
	engine.handlers.registerText(UrlTextHandler);
	engine.handlers.registerText(UrlTextHandler2);

	return engine;
}

// 重新导出核心功能
export * from './Core';
