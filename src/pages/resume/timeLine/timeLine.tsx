import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard,  AtTag } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    latitude: number,
    longitude: number,
    address: string,
    markers?: any,
    timeLine?: any,
    companyName?: string,
    postName?: string,
    salary?: string,
    beginDate?: string,
    overDate?: string,
    timeLineArr?: any

}
export default class TimeLine extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            address: '',
            companyName: '',
            postName: '',
            salary: '',
            beginDate: '',
            overDate: '',
            timeLineArr: []
        }
    }
    config: Config = {
        navigationBarTitleText: '工作经历'
    }
    componentDidShow() {
        this.getTimeLine()
    }

    // timeLine的新增
    addTimeLine = () => {
        Taro.navigateTo({ url: '/pages/addOrEdit/addTimeLine/addTimeLine' })
    }
    // 获取timeLine的数据
    getTimeLine = () => {
        const that = this
        httpUtil.request({
            url: '/company/list',
            method: 'GET',
            success(res) {
                const timeLineArr = res.data
                timeLineArr.sort(function (a, b) {
                    const date1 = new Date(a.beginDate).getTime()
                    const date2 = new Date(b.beginDate).getTime()
                    return date2 - date1

                })
                that.setState({
                    timeLineArr: timeLineArr
                })
            }
        })
    }
    // 公司的编辑
    editCompany = (data) => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addTimeLine/addTimeLine?cid=${data.id}` })
    }
    // 删除
    deleteCompany = (data) => {
        const that = this
        Taro.showModal({
            title: '删除',
            content: '确定删除该工作经历？',
            success(res) {
                if (res.confirm) {
                    httpUtil.request({
                        url: '/company/delete',
                        method: 'POST',
                        data: {
                            cid: data.id
                        },
                        success(res) {
                            that.getTimeLine()
                        }
                    })
                }
            }
        })
    }
    goToCompanyInfo = (data) => {
        Taro.navigateTo({ url: `/pages/resume/companyInfo/companyInfo?cid=${data.id}` })
    }
    render() {
        const { timeLineArr } = this.state

        const time = timeLineArr.map((item, index) => {
            return (
                <View key={item.id}>
                    <View className='timeLine-item'>
                        <View className='circle-line'>
                            <View className='circle'></View>
                            <View className='line'></View>
                        </View>
                        <View className='content'>
                            <View onClick={() => this.goToCompanyInfo(item)}>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>公司名称：</Text></View>
                                    <View className='infoContent'><Text>{item.companyName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>岗位名称：</Text></View>
                                    <View className='infoContent'><Text>{item.postName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>在职时间：</Text></View>
                                    <View className='infoContent'><Text>{item.beginDate}至{item.overDate}</Text></View>
                                </View>
                            </View>
                            <View className='tagBtn'>
                                <AtTag type='primary' size='small' active={true} circle onClick={() => this.editCompany(item)}>编辑</AtTag>
                                <View className='zhanwei'></View>
                                <AtTag size='small' active={true} circle onClick={() => this.deleteCompany(item)}>删除</AtTag>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <View className='com-page'>
                <AtCard
                    title='工作经历'>

                    <View className='timeLine'>
                        {timeLineArr.length > 0 ? time :
                            <View className='empty'>暂无信息！</View>
                        }
                    </View>
                </AtCard>
                <View className='bottomBtn'><AtButton onClick={this.addTimeLine} circle type="primary">新增工作经历</AtButton></View>
            </View>
        )
    }
}
