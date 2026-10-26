import * as React from 'react'
import * as utility from './utility'
import * as ConfigType from './IConfig'

// components
import { CustomTextArea } from './components/customtextarea'
import { Buttons } from './components/buttons'
import { Extends } from './components/extends'
import { Message } from './components/message'
import Emoji from './components/emoji'
import { MarkdownEditor } from '@foundation/integrations/markdown';
import { findMdRegions, findMdRegionAt } from './mdRegion'

// storage for default emoji
import { setLocalStorage, getLocalStorage } from '@foundation/storage/web-storage'
import styles from './UbbEditor.module.scss'

interface Props {
    value: string
    update: (value: string) => void
    option?: ConfigType.IConfigInProps
}

interface State {
    value: string
    selectionStart: number
    selectionEnd: number
    extendTagName: string
    message: string

    emojiType: ConfigType.emojiType
    shouldCompassImage: boolean

    /** 正在被嵌入 MarkdownEditor 编辑的 [md] 区域下标，-1 = 面板关闭。 */
    mdRegionIndex: number
    /** 光标当前落在哪个 [md] 区域内（用于提示条），-1 = 不在任何区域。 */
    caretRegion: number
}

export class UbbEditor extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            selectionStart: 0,
            selectionEnd: 0,
            extendTagName: '',
            message: '',
            emojiType: 'hide',
            shouldCompassImage: true,
            mdRegionIndex: -1,
            caretRegion: -1,
        }

        this.currentValue = props.value

        this.onChange = this.onChange.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.changeExtend = this.changeExtend.bind(this)
        this.message = this.message.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.changeEmojiType = this.changeEmojiType.bind(this)
        this.clearExtendAndEmoji = this.clearExtendAndEmoji.bind(this)
        this.changeShouldCompassImage = this.changeShouldCompassImage.bind(this)
    }

    private customTextArea: CustomTextArea
    /**
     * 最新内容镜像（React 18 批处理下 this.state.value 在 cWRP 时机可能是
     * 旧值）。所有「我们自己刚发出的值」都同步写到这里，用于：
     *   - cWRP 判断父组件回传的是不是自己刚更新的值的回声（是则跳过，
     *     否则会把并发中的面板误关、把选区重置到末尾）；
     *   - handleMdChange 拼接时取到最新的 UBB 文本（不读滞后的 state）。
     */
    private currentValue: string
    /**
     * [md] 嵌入编辑器的同步基准：面板里的 MarkdownEditor 最近一次上报的
     * 内容。textarea 的 onChange 里用它判断「区域内容是否被 textarea 直接
     * 改过」——改过就关面板（textarea 为准），没改过（只动了区域外的
     * UBB 文本）面板继续开着。
     */
    private lastMdContent: string | null = null

    onChange = (value: string) => {
        console.log("进入onchange")
        // 面板开着时 textarea 被直接编辑：若被改的是正在编辑的 [md] 区域
        // 本身（内容与嵌入编辑器最近上报的不一致），关面板让 textarea 为准；
        // 只动区域外的 UBB 文本则面板继续。
        if (this.state.mdRegionIndex >= 0 && this.lastMdContent !== null) {
            const regions = findMdRegions(value)
            const region = regions[this.state.mdRegionIndex]
            const content = region ? value.slice(region.contentStart, region.contentEnd) : null
            if (content === null || content !== this.lastMdContent) {
                this.lastMdContent = null
                this.setState({ mdRegionIndex: -1, caretRegion: -1 })
            }
        }
        this.currentValue = value
        this.setState({ value })
        this.props.update(value)
    }

    private changeExtend(extendTagName: string) {
        // 首次点击表情按钮
        if (extendTagName === 'emoji' && this.state.emojiType === 'hide') {
            let defaultEmojiType: ConfigType.emojiType = 'CC98';
            if (getLocalStorage('defaultEmojiType')) {
                defaultEmojiType = getLocalStorage('defaultEmojiType')
            };
            this.setState({
                emojiType: defaultEmojiType,
            })
        }
        // 点击相同按钮时隐藏
        this.setState((prevState: State) => extendTagName === prevState.extendTagName ? {
            extendTagName: ''
        } : {
                extendTagName
            })
    }

    private changeValue(ubbSegment: ConfigType.IUbbSegment): void {
        console.log("进入changevvalue")
        // [md] 有专属插入逻辑（块级插入 + 自动打开嵌入 Markdown 编辑器），
        // 不走通用的行内标签包裹。
        if (ubbSegment.tagName === 'md') {
            this.insertMdBlock()
            return
        }
        const newState = utility.getNewState(this.state, ubbSegment)
        this.setState(newState, this.selectTextArea)
        this.props.update(newState.value)
        this.clearExtendAndEmoji()
    }

    /**
     * 插入 [md]…[/md] 并打开嵌入 Markdown 编辑器：选区内容作为块的初始
     * Markdown；面板与 Markdown 编辑器是同一个组件（四阶段 $、反引号围栏、
     * 代码块补对/缩进等全部行为一致），编辑结果实时回写到 UBB 文本。
     */
    private insertMdBlock(): void {
        const value = this.currentValue
        // 用 textarea 的实时选区（blur 后 selectionStart 依然保留）；state 里
        // blur 缓存的选区可能滞留在旧值上。
        const textarea = this.customTextArea?.textarea
        const selectionStart = textarea ? textarea.selectionStart : this.state.selectionStart
        const selectionEnd = textarea ? textarea.selectionEnd : this.state.selectionEnd
        const selected = value.slice(selectionStart, selectionEnd)
        const insert = `[md]${selected}[/md]`
        const newValue = value.slice(0, selectionStart) + insert + value.slice(selectionEnd)
        const regions = findMdRegions(newValue)
        // 光标在旧块内部 → 开区间命中；否则插入的新块 openStart 恰为
        // selectionStart（开区间不命中），按起点对齐特判。
        let regionIndex = findMdRegionAt(regions, selectionStart)
        if (regionIndex < 0) {
            regionIndex = regions.findIndex((region) => region.openStart === selectionStart)
        }
        this.lastMdContent = regionIndex >= 0
            ? newValue.slice(regions[regionIndex].contentStart, regions[regionIndex].contentEnd)
            : null
        this.currentValue = newValue
        this.setState({
            value: newValue,
            selectionStart,
            selectionEnd: selectionStart + insert.length,
            mdRegionIndex: regionIndex,
            caretRegion: -1,
        })
        this.props.update(newValue)
        this.clearExtendAndEmoji()
    }

    /** 打开某个 [md] 区域的嵌入 Markdown 编辑器（提示条/程序化入口）。 */
    private openMdEditor(regionIndex: number): void {
        if (regionIndex === this.state.mdRegionIndex) return
        const regions = findMdRegions(this.state.value)
        const region = regions[regionIndex]
        if (!region) return
        this.lastMdContent = this.state.value.slice(region.contentStart, region.contentEnd)
        this.setState({ mdRegionIndex: regionIndex })
    }

    private closeMdEditor(): void {
        const regionIndex = this.state.mdRegionIndex
        this.lastMdContent = null
        // 光标放回区域闭标签之后，切回 textarea 继续写 UBB。
        const regions = findMdRegions(this.currentValue)
        const region = regions[regionIndex]
        const caret = region
            ? region.closeEnd
            : Math.min(this.state.selectionStart, this.currentValue.length)
        this.setState({
            mdRegionIndex: -1,
            caretRegion: -1,
            selectionStart: caret,
            selectionEnd: caret,
        }, this.selectTextArea)
    }

    /** 嵌入 MarkdownEditor 的内容变化：把新 Markdown 拼回 UBB 文本的对应区域。 */
    private handleMdChange = (markdown: string): void => {
        const regionIndex = this.state.mdRegionIndex
        if (regionIndex < 0) return
        const value = this.currentValue
        const regions = findMdRegions(value)
        const region = regions[regionIndex]
        if (!region) {
            this.closeMdEditor()
            return
        }
        const newValue = value.slice(0, region.contentStart) + markdown + value.slice(region.contentEnd)
        this.lastMdContent = markdown
        this.currentValue = newValue
        this.setState({ value: newValue })
        this.props.update(newValue)
    }

    /** 嵌入编辑器的图片上传：走 UBB 编辑器自己的上传管线，取首个 URL。 */
    private handleMdImageUpload = async (file: File): Promise<string> => {
        try {
            const urls = await utility.uploadFiles([file])
            return urls.length > 0 ? urls[0] : ""
        } catch {
            return ""
        }
    }

    /** textarea 光标/选区变化：进入 [md] 区域即原地切换为 Markdown 编辑器。 */
    private trackCaret = (event: React.SyntheticEvent<HTMLTextAreaElement>): void => {
        const offset = event.currentTarget.selectionStart
        const regionIndex = findMdRegionAt(findMdRegions(event.currentTarget.value), offset)
        if (regionIndex !== this.state.caretRegion) {
            this.setState({ caretRegion: regionIndex })
            if (regionIndex >= 0) this.openMdEditor(regionIndex)
        }
    }

    private selectTextArea() {
        // Markdown 编辑态 textarea 已卸载（ref 为 null），无需聚焦。
        if (!this.customTextArea?.textarea) return
        this.customTextArea.textarea.focus()
        this.customTextArea.textarea.setSelectionRange(this.state.selectionStart, this.state.selectionEnd)
    }

    private async handleUpload(filelist: FileList, shouldCompassImage?: boolean) {
        let files = Array.from(filelist)
        try {
            // 所有文件（含图片）统一 10MB 上限：图片此前被排除在检查外，
            // 超大图片会上传数十秒且无任何反馈，看起来像编辑器卡死。
            if (files.some(item => item.size > 10485760)) {
                throw new Error('文件过大（单个文件最大 10MB）')
            }
            if (files.length > 0) {
                this.message(`正在上传 ${files.length} 个文件…`)
            }

            let results = await utility.uploadFiles(files, shouldCompassImage)
            results.map((item, index) => this.changeValue({
                type: 'extend',
                tagName: utility.getTagName(files[index]),
                content: item
            }))
        } catch (e) {
            this.message(e.message)
        }
    }

    private changeEmojiType(em: ConfigType.emojiType) {
        this.setState({
            emojiType: em
        })
        setLocalStorage('defaultEmojiType', em, 2592000)
    }

    private changeShouldCompassImage(shouldCompassImage: boolean) {
        this.setState({
            shouldCompassImage
        })
    }

    message(message: string) {
        this.setState({
            message
        }, function () {
            setTimeout(() => {
                this.setState({ message: '' })
            }, 2000)
        })
    }

    clearExtendAndEmoji() {
        this.setState({
            extendTagName: ''
        })
    }

    componentDidMount() {
        // bind redo and undo for Buttons
        this.forceUpdate()

        window.addEventListener('click', this.clearExtendAndEmoji)
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.clearExtendAndEmoji)
    }

    componentWillReceiveProps(newProps: Props) {
        // 父组件回传的正是我们自己刚发出的值（React 批处理下的回声）时
        // 什么都不做——此刻 this.state.value 还可能没更新，靠 currentValue
        // 判断，否则会误关面板、把选区重置到末尾。
        const isEcho = this.currentValue === newProps.value
        this.currentValue = newProps.value
        if (isEcho) return
        // 外部整段替换内容（草稿回填、切换帖子等）：嵌入编辑器绑定的
        // 区域边界已不可信，面板一并关闭。
        if (this.state.mdRegionIndex >= 0) {
            this.lastMdContent = null
            this.setState({ mdRegionIndex: -1, caretRegion: -1 })
        }
        this.setState({
            value: newProps.value,
            selectionStart: newProps.value.length,
            selectionEnd: newProps.value.length,
        })
    }

    render() {
        const mdRegions = findMdRegions(this.state.value);
        const mdRegion = this.state.mdRegionIndex >= 0
            ? mdRegions[this.state.mdRegionIndex]
            : undefined;
        // Markdown 编辑态：编辑框原地切换（单一编辑框）。Vditor 高度 = UBB
        // 编辑框总高（option.height rem）减去模式条（2rem + 分隔线）。
        const mdEditorHeight = Math.max(
            180,
            Math.round((this.props.option?.height ?? 20) * 16) - 33
        );
        return (
            <div className={`${styles.editor}${mdRegion ? ` ${styles.editorMdMode}` : ""}`} style={{ '--ubb-editor-height': `${this.props.option.height || 20}rem` } as React.CSSProperties} >
                {mdRegion ? (
                    <div className={styles.mdModeBar} data-ubb-md-mode-bar="">
                        <span>
                            正在编辑第 {this.state.mdRegionIndex + 1} 个 [md] 块（$$ 公式、```
                            代码块、自动缩进等与 Markdown 编辑器同一套逻辑）
                        </span>
                        <button
                            type="button"
                            className={styles.mdModeBarClose}
                            onClick={() => this.closeMdEditor()}
                        >
                            完成，返回 UBB
                        </button>
                    </div>
                ) : (
                    <Buttons
                        changeValue={this.changeValue}
                        changeExtendName={this.changeExtend}
                        undo={this.customTextArea && this.customTextArea.undo}
                        redo={this.customTextArea && this.customTextArea.redo}
                    />
                )}
                <Extends
                    extendTagName={this.state.extendTagName}
                    changeValue={this.changeValue}
                    clearShown={this.clearExtendAndEmoji}
                    extendIsShown={this.state.extendTagName && this.state.extendTagName !== 'emoji'}
                    shouldCompassImage={this.state.shouldCompassImage}
                    changeShouldCompassImage={this.changeShouldCompassImage}
                />
                <div className={styles.body}>
                    {mdRegion ? (
                        <div className={styles.mdBody}>
                            <MarkdownEditor
                                key={`ubb-md-${this.state.mdRegionIndex}`}
                                value={this.currentValue.slice(mdRegion.contentStart, mdRegion.contentEnd)}
                                onChange={this.handleMdChange}
                                uploadImage={this.handleMdImageUpload}
                                editorHeight={mdEditorHeight}
                            />
                        </div>
                    ) : (
                        <CustomTextArea
                            value={this.state.value}
                            onChange={this.onChange}
                            ref={it => this.customTextArea = it}
                            onSelect={this.trackCaret}
                            onClick={this.trackCaret}
                            onKeyUp={this.trackCaret}
                            onBlur={e => {
                                const { selectionStart, selectionEnd } = e.target
                                this.setState({ selectionStart, selectionEnd })
                            }}
                            onDrop={e => {
                                let files = e.dataTransfer.files
                                if (files) this.handleUpload(files)
                            }}
                            onPaste={e => {
                                if (!e.clipboardData || !e.clipboardData.items) return;
                                const kinds = Array.from(e.clipboardData.items).map(item => item.kind)
                                const files = e.clipboardData.files;
                                if (kinds.some(kind => kind === 'file')) {
                                    e.preventDefault()
                                    this.customTextArea.blur()
                                    this.handleUpload(files, this.state.shouldCompassImage)
                                }
                            }}
                            onKeyDown={e => {
                                if (e.ctrlKey && e.key === 'Enter' && this.props.option && this.props.option.submit) {
                                    this.props.option.submit()
                                }
                            }}
                        />
                    )}
                </div>
                <Message
                    message={this.state.message}
                />
                <input
                    className={styles.fileInput}
                    type="file"
                    id="ubbFileUpload"
                    multiple
                    onChange={async e => {
                        const input = e.target
                        let filelist = e.target.files
                        await this.handleUpload(filelist, this.state.shouldCompassImage)
                        input.value = ''
                    }}
                />
                <Emoji
                    changeValue={this.changeValue}
                    emojiType={this.state.emojiType}
                    changeEmojiType={this.changeEmojiType}
                    emojiIsShown={this.state.extendTagName === 'emoji'}
                    height={this.props.option && this.props.option.height && this.props.option.height - 2}
                />
            </div>
        )
    }
}
