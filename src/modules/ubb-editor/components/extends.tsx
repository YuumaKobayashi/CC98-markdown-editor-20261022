import * as React from 'react'
import * as utility from '../utility'
import * as type from '../IConfig'
import styles from './extends.module.scss'

// polyfill for formdata
require('formdata-polyfill')
declare var FormData
interface FormData {
    keys: () => Iterable<string>
    get: (key: string) => string
}

interface Props {
    extendTagName: string
    changeValue: (ubbSegment: type.IUbbSegment) => void
    clearShown: () => void
    extendIsShown: boolean
    shouldCompassImage: boolean
    changeShouldCompassImage: (checked: boolean) => void
}

interface State {
    extendConfig: type.IUbbExtendSegmentConfig
}

export class Extends extends React.PureComponent<Props, State> {
    private form: HTMLFormElement

    constructor(props: Props) {
        super(props)
        this.state = {
            extendConfig: utility.buttonConfig.filter(item => item.tagName === props.extendTagName)[0] as type.IUbbExtendSegmentConfig
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.extendTagName) this.setState({
            extendConfig: utility.buttonConfig.filter(item => item.tagName === newProps.extendTagName)[0] as type.IUbbExtendSegmentConfig
        })
    }

    private changeValue(formData: FormData) {
        const keys = formData.keys()
        let subProperties: type.IUbbProperty[] = []
        for(let key in keys) {
            if(key !== 'content' && key !== 'mainValue') subProperties.push({ key, value: formData.get(key) })
        }
        this.props.changeValue({
            tagName: this.props.extendTagName,
            content: formData.get('content'),
            type: 'extend',
            mainProperty: formData.get('mainValue'),
            subProperties
        })
        this.form.reset()
    }

    render() {
        return (
            <div className={`${styles.extend} ${this.props.extendIsShown ? styles.shown : styles.hidden}`} onClick={e => e.stopPropagation()} >
                {this.state.extendConfig ? <form ref={it => this.form = it} onSubmit={e => {
                    console.log('submit')
                    e.preventDefault()
                    this.changeValue(new FormData(e.target as HTMLFormElement))
                }} >
                    <input className={styles.extendMain} type="text" defaultValue="" name="content" placeholder={this.state.extendConfig.contentValueInfo} />
                    {this.state.extendConfig.propertiesInfos ? this.state.extendConfig.propertiesInfos.map((item, index) => <><span>|</span><input 
                        type="text" 
                        defaultValue=""
                        name={item.key || 'mainValue'}
                        placeholder={item.title}
                        key={item.key + index}
                        className={styles.extendSub}
                    /></>) : null }
                    {this.state.extendConfig.hasCompassOption && 
                        <>
                            <input id="shouldCompassImage" onChange={e => this.props.changeShouldCompassImage(!e.target.checked)} type="checkbox" checked={!this.props.shouldCompassImage} />
                            <label className={styles.optionLabel} htmlFor="shouldCompassImage">无损上传</label>
                        </>
                    }
                    {this.state.extendConfig.allowUpload && <label className={`fa fa-upload ${styles.buttonIcon} ${styles.uploadButton}`} htmlFor="ubbFileUpload" />}
                    <button className={`fa fa-check ${styles.action}`} type="submit" />
                    <button className={`fa fa-remove ${styles.action}`} type="reset" onClick={this.props.clearShown} />
                </form> : null}
            </div>
        )
    }
}
