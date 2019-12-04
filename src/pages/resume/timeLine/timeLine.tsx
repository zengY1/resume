import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTag } from 'taro-ui'
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
            timeLine: [
                { title: '刷牙洗脸' },
                { title: '吃早餐' },
                { title: '上班' },
                { title: '睡觉' }
            ],
            companyName: '',
            postName: '',
            salary: '',
            beginDate: '',
            overDate: '',
            timeLineArr: []
        }
    }
    config: Config = {
        navigationBarTitleText: 'timeLine'
    }
    componentDidMount() {
        this.getTimeLine()
    }





    // timeLine的新增
    addTimeLine = () => {
        Taro.navigateTo({ url: '../addTimeLine/addTimeLine' })
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
        // console.log('data',data)
        Taro.navigateTo({ url: `../addTimeLine/addTimeLine?cid=${data.id}` })
    }
    // 删除
    deleteCompany = (data) => {
        const that = this
        httpUtil.request({
            url: '/company/delete',
            method: 'POST',
            data: {
                cid: data.id
            },
            success(res) {
                that.getTimeLine()
                console.log('res', res)
            }
        })
    }
    goToCompanyInfo = (data) => {
        Taro.navigateTo({ url: `../companyInfo/companyInfo?cid=${data.id}` })
    }
    render() {
        const { address, longitude, latitude, timeLine, companyName, postName, salary, beginDate, overDate, timeLineArr } = this.state

        const time = timeLineArr.map((item, index) => {
            return (
                <View key={index}>
                    <View className='timeLine-item'>
                        <View className='circle-line'>
                            <View className='circle'></View>
                            <View className='line'></View>
                        </View>
                        <View className='content'>
                            <View onClick={() => this.goToCompanyInfo(item)}>
                                <View>公司：{item.companyName}</View>
                                <View>时间：{item.beginDate}至{item.overDate}</View>
                                <View>职位：{item.postName}</View>
                            </View>
                            <AtTag type='primary' size='small' active={true} circle onClick={() => this.editCompany(item)}>编辑</AtTag>
                            <AtTag size='small' active={true} circle onClick={() => this.deleteCompany(item)}>删除</AtTag>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <View>
                <AtCard
                    title='timeLine'>
                    <AtButton onClick={this.addTimeLine} type="primary">新增timeLine</AtButton>
                    <View className='timeLine'>
                        {time}
                    </View>
                </AtCard>
            </View>
        )
    }
}
