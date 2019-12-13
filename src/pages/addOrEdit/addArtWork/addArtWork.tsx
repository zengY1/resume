import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    workName?: string,
    workUrl?: any,
    wid?: any,
}
export default class AddArtWork extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            workName: '',

            wid: 0,
            workUrl: ''
        }
    }
    config: Config = {
        navigationBarTitleText: 'addskill'
    }
    componentDidMount() {
        const params = this.$router.params
        const wid = params.wid
        if (wid) {
            this.getSkillBySid(wid)
            this.setState({
                wid: wid
            })
        }

    }
    // 根据sid查个人技能
    getSkillBySid = (wid) => {
        const that = this
        httpUtil.request({
            url: '/work/getById',
            data: {
                wid: wid
            },
            success(res) {
                const data = res.data
                console.log('res', res)
                that.setState({
                    workName: data.workName,
                    workUrl: data.workUrl
                })
            }
        })
    }
    // 个人技能的新增
    addSkill = () => {
        const { workUrl, workName, wid } = this.state
        const options = {
            workUrl,
            workName,
            wid: ''
        }
        if (workUrl == '') {
            Taro.atMessage({
                'message': '作品的URL不能为空！',
                'type': 'error',
            })
            return
        } else if (workName == '') {
            Taro.atMessage({
                'message': '作品的名称不能为空！',
                'type': 'error',
            })
            return
        }
        if (wid) {
            options.wid = wid
            httpUtil.request({
                url: '/work/edit',
                method: 'POST',
                data: options,
                success(res) {
                    Taro.navigateBack()
                    Taro.showToast({
                        title: '编辑成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        } else {
            httpUtil.request({
                url: '/work/add',
                method: 'POST',
                data: options,
                success(res) {
                    console.log('success', res)
                    Taro.navigateBack()
                    Taro.showToast({
                        title: '新增成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        }
    }
    // 项目名称
    changeWorkName = (data) => {
        console.log('公司名称：', data)
        this.setState({
            workName: data
        })
    }
    // 项目的描述
    changeWorkUrl = (data) => {
        this.setState({
            workUrl: data
        })
    }

    render() {
        const { workName, workUrl } = this.state
        return (
            <View>
                <AtCard
                    title='新增的skill'>
                    <AtForm>
                        <AtInput
                            name='work'
                            border={true}
                            title='作品名称'
                            type='text'
                            placeholder='请输入作品名称：如：CSS'
                            value={workName}
                            onChange={(data) => this.changeWorkName(data)}
                        />
                        <AtInput
                            name='url'
                            border={true}
                            title='作品的URL'
                            type='text'
                            placeholder='请输入作品的URL'
                            value={workUrl}
                            onChange={(data) => this.changeWorkUrl(data)}
                        />

                    </AtForm>
                    <AtButton onClick={this.addSkill} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
