import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtTextarea,AtMessage } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    skillName?: string,
    cid?: any,
    skillDsc?: any,
    sid?: any,
    skillList?: any,
    skillPickValue?: string,
    cardTitle?:string


}
export default class AddSkill extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            skillName: '',
            cid: 0,
            skillDsc: '',
            sid: 0,
            skillList: ['精通', '掌握', '熟悉', '了解', '其他'],
            skillPickValue: '',
            cardTitle:'新增个人技能'
        }
    }
    config: Config = {
        navigationBarTitleText: '新增个人技能'
    }
    componentDidMount() {
        const params = this.$router.params
        const sid = params.sid
        console.log('sid', sid, params)
        if (sid) {
            this.getSkillBySid(sid)
            Taro.setNavigationBarTitle({
                title: '编辑个人技能'
            })
            this.setState({
                sid: sid,
                cardTitle:'编辑个人技能'
            })
        }

    }
    // 根据sid查个人技能
    getSkillBySid = (sid) => {
        const that = this
        httpUtil.request({
            url: '/skill/getById',
            data: {
                sid: sid
            },
            success(res) {
                const data = res.data
                console.log('res', res)
                that.setState({
                    skillName: data.skillName,
                    skillDsc: data.skillDsc,
                    skillPickValue: data.skillGrade
                })
            }
        })
    }
    // 个人技能的新增
    addSkill = () => {
        const { skillName, skillDsc, skillPickValue, sid } = this.state
        if (skillName == '') {
            Taro.atMessage({
                'message': '名称不能为空！',
                'type': 'error',
            })
            return
        } else if (skillDsc == '') {
            Taro.atMessage({
                'message': '描述不能为空！',
                'type': 'error',
            })
            return
        } else if (skillPickValue == '') {
            Taro.atMessage({
                'message': '熟练程度不能为空！',
                'type': 'error',
            })
            return
        }
        const options = {
            skillName,
            skillDsc,
            skillGrade: skillPickValue,
            sid: ''
        }
        if (sid) {
            options.sid = sid
            httpUtil.request({
                url: '/skill/edit',
                method: 'POST',
                data: options,
                success() {
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
                url: '/skill/add',
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
    changeSkillName = (data) => {
        console.log('公司名称：', data)
        this.setState({
            skillName: data
        })
    }
    // 项目的描述
    changeSkillDsc = (data) => {
        this.setState({
            skillDsc: data.detail.value
        })
    }
    // 公司的选择
    skillSelectChange = (data) => {
        console.log('select', data.detail.value)
        this.setState({
            skillPickValue: data.detail.value
        })
    }
    render() {
        const { skillDsc, skillName, skillList, skillPickValue,cardTitle } = this.state
        return (
            <View>
                 <AtMessage />
                <AtCard
                    title={cardTitle}>
                    <AtForm>
                        <AtInput
                            name='skill'
                            border={true}
                            title='技能标签'
                            type='text'
                            placeholder='请输入技能名称：如：CSS'
                            value={skillName}
                            onChange={(data) => this.changeSkillName(data)}
                        />
                        <View className='form-item'>
                            <View className='label'>掌握程度</View>
                            <Picker mode='selector' range={skillList} onChange={this.skillSelectChange} >
                                <View className='content'>{skillPickValue === '' ? '请选择' : skillList[skillPickValue]}</View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>技能简介</View>
                            <View className='content'>
                                <AtTextarea value={skillDsc} onChange={this.changeSkillDsc} maxLength={200} placeholder='项目的描述' />
                            </View>
                        </View>
                    </AtForm>
                    <AtButton onClick={this.addSkill} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
