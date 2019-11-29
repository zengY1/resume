import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
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
    timeLineArr?: any,
    cid?: any,
    companyDsc?: any,
    workDsc?: any

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
            timeLineArr: [],
            cid: 0,
            companyDsc: '1111',
            workDsc: '1111'
        }
    }
    config: Config = {
        navigationBarTitleText: 'addTimeLine'
    }
    componentDidMount() {
        const params = this.$router.params
        const cid = params.cid
        if (cid) {
            this.getInfoByCid(cid)
        }
    }
    // 根据cid查询公司信息
    getInfoByCid = (cid) => {
        const that = this
        httpUtil.request({
            url: '/company/getCompanyById',
            data: { cid: cid },
            success(res) {
                console.log('res', res)
                that.setState({
                    cid: cid,
                    address: res.data.address,
                    longitude: res.data.longitude,
                    latitude: res.data.latitude,
                    companyName: res.data.companyName,
                    postName: res.data.postName,
                    salary: res.data.salary,
                    beginDate: res.data.beginDate,
                    overDate: res.data.overDate

                })
            }
        })
    }
    // 公司地址
    getLocation = (e) => {
        const that = this
        Taro.chooseLocation({
            success(res) {
                console.log(res)
                that.setState({
                    address: res.address,
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            }
        })
    }
    // 公司名称
    changeCompanyName = (data) => {
        console.log('公司名称：', data)
        this.setState({
            companyName: data
        })
    }
    // 岗位名称
    changePostName = (data) => {
        console.log('岗位名称：', data)
        this.setState({
            postName: data
        })
    }
    // 价格
    changeSalary = (data) => {
        console.log('价格：', data)
        this.setState({
            salary: data
        })
    }
    // 开始时间
    changeBeginDate = (data) => {
        this.setState({ beginDate: data.detail.value })
    }
    // 结束时间
    changeOverDate = (data) => {
        this.setState({ overDate: data.detail.value })
    }
    // 公司的介绍
    changeCompanyDsc = (data) => {
        this.setState({
            companyDsc: data.detail.value
        })
    }
    // 工作的描述
    changeWorkDsc = (data) => {
        console.log('res',data.detail.value)
        this.setState({
            workDsc: data.detail.value
        })
    }
    // timeLine的提交
    addTimeLine = () => {
        const { workDsc, companyDsc,cid, address, longitude, latitude, companyName, postName, salary, beginDate, overDate } = this.state
        console.log('提交', companyDsc,workDsc)
        if (cid) {
            httpUtil.request({
                url: '/company/edit',
                method: 'POST',
                data: {
                    cid: cid,
                    address,
                    longitude,
                    latitude,
                    companyName,
                    postName,
                    salary,
                    beginDate,
                    overDate,
                    workDsc, 
                    companyDsc
                },
                success(res) {
                    Taro.reLaunch({ url: '../timeLine/timeLine' })
                    Taro.showToast({
                        title: res.msg,
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        } else {
            httpUtil.request({
                url: '/company/add',
                method: 'POST',
                data: {
                    address,
                    longitude,
                    latitude,
                    companyName,
                    postName,
                    salary,
                    beginDate,
                    overDate,
                    workDsc,
                    companyDsc
                },
                success(res) {
                    console.log('res', res)
                    Taro.reLaunch({ url: '../timeLine/timeLine' })
                    Taro.showToast({
                        title: res.msg,
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        }
    }
    render() {
        const { workDsc, companyDsc, address, longitude, latitude, timeLine, companyName, postName, salary, beginDate, overDate, timeLineArr } = this.state

        return (
            <View>
                <AtCard
                    title='新增的timeLine'>
                    <AtForm>
                        <AtInput
                            name='company'
                            border={false}
                            title='公司名称'
                            type='text'
                            placeholder='公司名称'
                            value={companyName}
                            onChange={(data) => this.changeCompanyName(data)}
                        />
                        <AtInput
                            name='post'
                            border={false}
                            title='职位'
                            type='text'
                            placeholder='职位'
                            value={postName}
                            onChange={(data) => this.changePostName(data)}
                        />
                        <AtInput
                            name='salary'
                            border={false}
                            title='价格'
                            type='text'
                            placeholder='价格'
                            value={salary}
                            onChange={(data) => this.changeSalary(data)}
                        />
                        <View>
                            <AtButton onClick={this.getLocation}>选择地址</AtButton>
                            <Text>地址：{address}</Text>
                        </View>
                        <View className='addItem'>开始时间：
                            <Picker mode='date' onChange={this.changeBeginDate}>
                                <View>
                                    当前选择：{beginDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='addItem'>结束时间：
                            <Picker mode='date' onChange={this.changeOverDate}>
                                <View>
                                    当前选择：{overDate}
                                </View>
                            </Picker>
                        </View>
                        <View>公司的简介：</View>
                        <AtTextarea value={companyDsc} onChange={this.changeCompanyDsc} maxLength={200} placeholder='公司的简单介绍'/>
                        
                        <View>工作的介绍：</View>
                        <AtTextarea value={workDsc} onChange={this.changeWorkDsc} maxLength={200} placeholder='工作描述'/>

                        
                    </AtForm>
                    <AtButton onClick={this.addTimeLine} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
