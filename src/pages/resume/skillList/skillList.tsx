import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { skillGradeOptions } from '../../../utils/static'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea, AtTag } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    skillList?: any

}
export default class SkillList extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            skillList: []
        }
    }
    config: Config = {
        navigationBarTitleText: '个人技能'
    }
    componentDidShow() {
        this.getSkillList()
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
                                        targe = <View className='skill-tag tag-one' key={item.id}>{item.skillName}</View>
                                    } else if (item.skillGrade == 1) {
                                        targe = <View className='skill-tag tag-two' key={item.id}>{item.skillName}</View>
                                    } else if (item.skillGrade == 2) {
                                        targe = <View className='skill-tag tag-three' key={item.id}>{item.skillName}</View>
                                    } else if (item.skillGrade == 3) {
                                        targe = <View className='skill-tag tag-four' key={item.id}>{item.skillName}</View>
                                    } else if (item.skillGrade == 4) {
                                        targe = <View className='skill-tag tag-five' key={item.id}>{item.skillName}</View>
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
                                <View key={item.id} className='school-item'>
                                    <View className='infoItem'>
                                        <View className='infoLabel'></View>
                                        <View className='info-value'><Text>{item.skillName}</Text>-<Text>{skillGradeOptions[item.skillGrade].label}</Text>：<Text>{item.skillDsc}</Text></View>
                                    </View>
                                </View>
                            )
                        }) : <View className='empty'>暂无信息！</View>}
                    </View>
                </AtCard>
            </View>
        )
    }
}
