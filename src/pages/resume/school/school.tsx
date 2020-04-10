import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea, AtTag } from 'taro-ui'
import {records} from '../../../utils/static'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    record?: number,
    schoolName?: string,
    projectName?: string,
    beginDate?: string,
    overDate?: string,
    schoolList?: any

}
export default class School extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
           
            record: 0,
            schoolName: '',
            projectName: '',
            beginDate: '',
            overDate: '',
            schoolList: []
        }
    }
    config: Config = {
        navigationBarTitleText: '学历信息'
    }
    componentDidShow(){
        this.getSchoolList()
    }
    goToAddSchool = () => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addSchool/addSchool` })
    }
    getSchoolList = () => {
        const that = this
        httpUtil.request({
            url: '/school/list',
            success(res) {
                console.log('res', res)
                let list = res.data
                list.sort(function (a, b) {
                    const date1 = new Date(a.schoolBeginDate).getTime()
                    const date2 = new Date(b.schoolBeginDate).getTime()
                    return date2 - date1
                })
                that.setState({
                    schoolList: list
                })
            }
        })

    }
    // 删除教育经验
    deleteSchool = (data) => {
        const that = this
        Taro.showModal({
            title: '删除',
            content: '确定删除该学历信息？',
            success(res) {
                if (res.confirm) {
                    httpUtil.request({
                        url: '/school/delete',
                        method: 'POST',
                        data: {
                            sid: data.id
                        },
                        success(res) {
                            that.componentDidShow()
                            console.log('res', res)
                        }
                    })
                }
            }
        })

    }
    // 编辑教育经验
    editSchool = (data) => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addSchool/addSchool?sid=${data.id}` })
    }
    render() {
        const { record, schoolName, projectName, beginDate, overDate, schoolList } = this.state
        console.log('schoolList', schoolList)
        return (
            <View>
                <AtCard
                    title='教育经历' className='card'>
                    {schoolList.length > 0 ? schoolList.map((item, index) => {
                        return (
                            <View key={item.id} className='school-item'>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>学校：</Text></View>
                                    <View className='infoContent'><Text>{item.schoolName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>学历：</Text></View>
                                    <View className='infoContent'><Text>{records[item.record]}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>专业：</Text></View>
                                    <View className='infoContent'><Text>{item.projectName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>入学日期：</Text></View>
                                    <View className='infoContent'><Text>{item.schoolBeginDate}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>毕业日期：</Text></View>
                                    <View className='infoContent'><Text>{item.schoolOverDate}</Text></View>
                                </View>
                                <View className='tagBtn'>
                                    <AtTag size='small' active={true} circle onClick={() => this.deleteSchool(item)}>删除</AtTag>
                                    <View className='zhanwei'></View>
                                    <AtTag type='primary' size='small' active={true} circle onClick={() => this.editSchool(item)}>编辑</AtTag>
                                </View>
                            </View>
                        )
                    }) : <View className='empty'>暂无信息！</View>}

                </AtCard>
                <View className='bottomBtn'><AtButton onClick={this.goToAddSchool} circle type="primary">新增教育经历</AtButton></View>
            </View>
        )
    }
}
