import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm,AtMessage, AtTimeline, AtTextarea } from 'taro-ui'
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
    timeLineArr?: any,
    cid?: any,
    companyDsc?: any,
    workDsc?: any,
    cardTitle?:string

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
            companyDsc: '',
            workDsc: '',
            cardTitle:'新增工作经历'
        }
    }
    config: Config = {
        navigationBarTitleText: '新增工作经历'
    }
    componentDidMount() {
        const params = this.$router.params
        const cid = params.cid
        if (cid) {
            this.getInfoByCid(cid)
            this.setState({cardTitle:'编辑工作经历'})
            Taro.setNavigationBarTitle({
                title: '编辑工作经历'
            })
        }
    }
    // 根据cid查询公司信息
    getInfoByCid = (cid) => {
        const that = this
        httpUtil.request({
            url: '/company/getCompanyById',
            data: { cid: cid },
            success(res) {
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
        this.setState({
            companyName: data
        })
    }
    // 岗位名称
    changePostName = (data) => {
        this.setState({
            postName: data
        })
    }
    // 价格
    changeSalary = (data) => {
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
        this.setState({
            workDsc: data.detail.value
        })
    }
    // timeLine的提交
    addTimeLine = () => {
        const { workDsc, companyDsc, cid, address, longitude, latitude, companyName, postName, salary, beginDate, overDate } = this.state
        if (companyName == '') {
            Taro.atMessage({
                'message': '公司名称不能为空！',
                'type': 'error',
            })
            return
        } else if (postName == '') {
            Taro.atMessage({
                'message': '岗位名称不能为空！',
                'type': 'error',
            })
            return
        } else if (address == '') {
            Taro.atMessage({
                'message': '公司地址不能为空！',
                'type': 'error',
            })
            return
        } else if (salary == '') {
            Taro.atMessage({
                'message': '在职薪资不能为空！',
                'type': 'error',
            })
            return
        } else if (beginDate == '') {
            Taro.atMessage({
                'message': '入职时间不能为空！',
                'type': 'error',
            })
            return
        } else if (overDate == '') {
            Taro.atMessage({
                'message': '离职时间不能为空！',
                'type': 'error',
            })
            return
        } else if (workDsc == '') {
            Taro.atMessage({
                'message': '工作简介不能为空！',
                'type': 'error',
            })
            return
        } else if (companyDsc == '') {
            Taro.atMessage({
                'message': '公司简介不能为空！',
                'type': 'error',
            })
            return
        }
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
    render() {
        const {cardTitle, workDsc, companyDsc, address, longitude, latitude, timeLine, companyName, postName, salary, beginDate, overDate, timeLineArr } = this.state

        return (
            <View>
                 <AtMessage />
                <AtCard
                    title={cardTitle}>
                    <AtForm>
                        <AtInput
                            name='company'
                            border={true}
                            title='公司名称'
                            type='text'
                            placeholder='公司名称'
                            value={companyName}
                            onChange={(data) => this.changeCompanyName(data)}
                        />
                        <AtInput
                            name='post'
                            border={true}
                            title='职位'
                            type='text'
                            placeholder='职位'
                            value={postName}
                            onChange={(data) => this.changePostName(data)}
                        />
                        <AtInput
                            name='salary'
                            border={true}
                            title='在职薪资'
                            type='text'
                            placeholder='在职薪资'
                            value={salary}
                            onChange={(data) => this.changeSalary(data)}
                        />
                        <View className='form-item'>
                            <View className='label'>公司地址</View>
                            <View onClick={this.getLocation}>{address == '' ? '请选择' : address}</View>
                        </View>

                        <View className='form-item'>
                            <View className='label'>入职时间</View>
                            <Picker mode='date' onChange={this.changeBeginDate}>
                                <View className='content'>
                                    {beginDate == '' ? '请选择入职时间' : beginDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>离职时间</View>
                            <Picker mode='date' onChange={this.changeOverDate}>
                                <View className='content'>
                                    {overDate == '' ? '请选择离职时间' : overDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>公司简介</View>
                            <View className='content'>
                                <AtTextarea value={companyDsc} onChange={this.changeCompanyDsc} maxLength={200} placeholder='公司的简单介绍' />
                            </View>
                        </View>
                        <View className='form-item'>
                            <View className='label'>工作描述</View>
                            <View className='content'>
                                <AtTextarea value={workDsc} onChange={this.changeWorkDsc} maxLength={200} placeholder='工作描述' />
                            </View>
                        </View>
                    </AtForm>
                    <AtButton onClick={this.addTimeLine} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
