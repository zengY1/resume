import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea, AtTag } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    skillList?: any

}
export default class Skill extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            skillList: []
        }
    }
    componentDidShow() {
        this.getSkillList()
    }
    // 新增
    gotoAddSkill = () => {
        Taro.navigateTo({ url: `/pages/addOrEdit/skill/skill` })
    }
    // 获取列表
    getSkillList = () => {
        const that = this
        httpUtil.request({
            url: '/skill/list',
            success(res) {
                if (res.errorCode == '00000') {
                    let list = res.data
                    list.sort(function (a, b) {
                        return a.skillGrade - b.skillGrade
                    })
                    that.setState({
                        skillList: list
                    })
                }
            }
        })
    }
    //删除个人技能 
    deleteSkill = (item) => {
        const that = this
        Taro.showModal({
            title: '删除',
            content: '确定删除该个人技能？',
            success(res) {
                if (res.confirm) {
                    httpUtil.request({
                        url: '/skill/delete',
                        method: 'POST',
                        data: { sid: item.id },
                        success(res) {
                            console.log('res', res)
                            if (res.errorCode == '00000') {
                                that.getSkillList()
                                Taro.showToast({
                                    title: '删除成功！',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }
                        }
                    })
                }
            }
        })

    }
    // 编辑个人技能
    editSkill = (item) => {
        Taro.navigateTo({ url: `/pages/addOrEdit/skill/skill?sid=${item.id}` })
    }
    render() {
        const { skillList } = this.state
        return (
            <View>
                <AtCard
                    title='个人技能' className='card'>
                    <View>
                        <View className='secord-title'>技能标签</View>
                        <View className='tag-content'>
                            {
                                skillList.length > 0 ? skillList.map((item, index) => {
                                    let targe
                                    if (item.skillGrade == 0) {
                                        targe = <View className='skill-tag tag-one' key={index}>{item.skillName}</View>
                                    } else if (item.skillGrade == 1) {
                                        targe = <View className='skill-tag tag-two' key={index}>{item.skillName}</View>
                                    } else if (item.skillGrade == 2) {
                                        targe = <View className='skill-tag tag-three' key={index}>{item.skillName}</View>
                                    } else if (item.skillGrade == 3) {
                                        targe = <View className='skill-tag tag-four' key={index}>{item.skillName}</View>
                                    } else if (item.skillGrade == 4) {
                                        targe = <View className='skill-tag tag-five' key={index}>{item.skillName}</View>
                                    }
                                    return (
                                        targe
                                    )
                                }) : ''
                            }
                        </View>
                    </View>
                    <View className='skill-list'>
                        <View className='secord-title'>技能列表</View>
                        {skillList.length > 0 ? skillList.map((item, index) => {
                            return (
                                <View key={index} className='school-item' key={index}>
                                    <View className='infoItem'>
                                        <View className='infoLabel'></View>
                                        <View><Text>{item.skillDsc}</Text></View>
                                    </View>
                                    <View className='tagBtn'>
                                        <AtTag size='small' active={true} circle onClick={() => this.deleteSkill(item)}>删除</AtTag>
                                        <View className='zhanwei'></View>
                                        <AtTag type='primary' size='small' active={true} circle onClick={() => this.editSkill(item)}>编辑</AtTag>
                                    </View>
                                </View>
                            )
                        }) : <View className='empty'>暂无信息！</View>}
                    </View>
                </AtCard>
                <View className='bottomBtn'><AtButton circle onClick={this.gotoAddSkill} type="primary">新增个人技能</AtButton></View>
            </View>
        )
    }
}
