import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    itemName?: string,
    postName?: string,
    beginDate?: string,
    overDate?: string,
    cid?: any,
    itemDsc?: any,
    workDsc?: any,
    iid?: any,
    companyList?:any


}
export default class TimeLine extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            itemName: '这是第二个项目',
            postName: '开发',
            beginDate: '2019-05-22',
            overDate: '2019-10-21',
            cid: 0,
            itemDsc: '项目的描述，这是什么项目，是用来干什么用的',
            workDsc: '我的分工 我在这项目中扮演着什么角色 负责什么模块',
            iid: 0,
            companyList:[]
        }
    }
    config: Config = {
        navigationBarTitleText: 'addItem'
    }
    componentDidMount() {
        const params = this.$router.params
        const cid = params.cid
        const iid = params.iid
        if (iid) {
            this.getItemInfoByIid(iid)
        }
        this.setState({
            cid: cid
        })
    }
    // 根据uid查公司的列表
    getCompanyListByUid=()=>{
        const that=this
        httpUtil.request({
            url: '/company/list',
            method: 'GET',
            success(res) {
                const companyList = res.data
                companyList.sort(function (a, b) {
                    const date1 = new Date(a.beginDate).getTime()
                    const date2 = new Date(b.beginDate).getTime()
                    return date2 - date1

                })
                that.setState({
                    companyList: companyList
                })
            }
        })
    }
    // 根据iid查询项目的信息
    getItemInfoByIid = (iid) => {
        const that = this
        httpUtil.request({
            url: '/item/infoByIid',
            data: { iid: iid },
            success(res) {
                console.log('itemInfo', res)
                const info = res.data
                that.setState({
                    iid: info.id,
                    itemName: info.itemName,
                    postName: info.postName,
                    itemDsc: info.itemDsc,
                    workDsc: info.myDivision,
                    beginDate: info.itemBeginDate,
                    overDate: info.itemOverDate,
                    cid: info.cid
                })
            }
        })
    }
    // 项目名称
    changeItemName = (data) => {
        console.log('公司名称：', data)
        this.setState({
            itemName: data
        })
    }
    // 岗位名称
    changePostName = (data) => {
        console.log('岗位名称：', data)
        this.setState({
            postName: data
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
    // 项目的描述
    changeItemDsc = (data) => {
        this.setState({
            itemDsc: data.detail.value
        })
    }
    // 工作的描述
    changeWorkDsc = (data) => {
        console.log('res', data.detail.value)
        this.setState({
            workDsc: data.detail.value
        })
    }
    // item的提交
    addItem = () => {
        const { iid, workDsc, itemDsc, itemName, postName, beginDate, overDate, cid } = this.state
        const options = {
            cid: cid,
            itemDsc: itemDsc,
            itemName: itemName,
            postName: postName,
            itemBeginDate: beginDate,
            itemOverDate: overDate,
            myDivision: workDsc,
            iid: iid
        }
        if (iid) {
            httpUtil.request({
                url: '/item/edit',
                method: 'POST',
                data: options,
                success(res) {
                    console.log('res', res)
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
                url: '/item/add',
                method: 'POST',
                data: options,
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
        console.log('add', options)
    }
    render() {
        const { workDsc, itemDsc, itemName, postName, beginDate, overDate } = this.state

        return (
            <View>
                <AtCard
                    title='新增的Item'>
                    <AtForm>
                    {/* <View className='form-item'>
                            <View className='label'>公司</View>
                            <Picker mode='selector' range={records} onChange={this.onRecordsChange}>
                                <View className='content'>{record == -1 ? '请选择' : records[record]}</View>
                            </Picker>
                        </View> */}
                        <AtInput
                            name='item'
                            border={true}
                            title='项目名称'
                            type='text'
                            placeholder='项目名称'
                            value={itemName}
                            onChange={(data) => this.changeItemName(data)}
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
                        <View className='form-item'>
                            <View className='label'>开始时间</View>
                            <Picker mode='date' onChange={this.changeBeginDate}>
                                <View className='content'>
                                    {beginDate == '' ? '请选择开始时间' : beginDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>结束时间</View>
                            <Picker mode='date' onChange={this.changeOverDate}>
                                <View className='content'>
                                    {overDate == '' ? '请选择结束时间' : overDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>项目描述</View>
                            <View className='content'>
                                <AtTextarea value={itemDsc} onChange={this.changeItemDsc} maxLength={200} placeholder='项目的描述' />
                            </View>
                        </View>
                        <View className='form-item'>
                            <View className='label'>我的分工</View>
                            <View className='content'>
                                <AtTextarea value={workDsc} onChange={this.changeWorkDsc} maxLength={200} placeholder='我在这个项目中做了什么' />
                            </View>
                        </View>
                    </AtForm>
                    <AtButton onClick={this.addItem} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
