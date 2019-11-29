import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTag, AtTabs, AtTabsPane } from 'taro-ui'
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
    current: number,
    companyDsc?: string,
    workDsc?: string,
    itemArr?: any,
    tabList?: any

}
export default class CompanyInfo extends Component<IProps, Istate> {
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
            cid: '',
            markers: [],
            current: 0,
            companyDsc: '',
            workDsc: '',
            itemArr: [],
            tabList: [{ title: '公司简介' }]
        }
    }
    config: Config = {
        navigationBarTitleText: 'companyInfo'
    }
    componentDidMount() {
        const params = this.$router.params
        const cid = params.cid
        if (cid) {
            this.getCompanyInfoByCid(cid)
            this.getItemInfoByCid(cid)
        }
    }
    // 公司的详情
    getCompanyInfoByCid = (cid) => {
        const that = this
        httpUtil.request({
            url: '/company/getCompanyById',
            data: { cid: cid },
            success(res) {
                console.log('res', res.data)
                that.setState({
                    cid: cid,
                    address: res.data.address,
                    longitude: res.data.longitude,
                    latitude: res.data.latitude,
                    companyName: res.data.companyName,
                    postName: res.data.postName,
                    salary: res.data.salary,
                    beginDate: res.data.beginDate,
                    overDate: res.data.overDate,
                    companyDsc: res.data.companyDsc,
                    workDsc: res.data.workDsc,
                    markers: [{
                        id: 1,
                        longitude: res.data.longitude,
                        latitude: res.data.latitude,
                        title: res.data.companyName,
                        iconPath: '',
                        width: 50,
                        height: 50,
                        label: {
                            content: res.data.companyName,
                            color: '#000',
                            display: 'ALWAYS',
                            textAlign: 'center',
                            padding: 2,
                            bgColor: '#fff'
                        }
                    }],
                })
            }
        })
    }
    // 获取公司下的项目
    getItemInfoByCid = (cid) => {
        const that = this
        const { tabList } = this.state
        httpUtil.request({
            url: '/item/list',
            data: { cid },
            success(res) {
                const re_itemArr = res.data
                re_itemArr.sort(function (a, b) {
                    const date1 = new Date(a.itemBeginDate).getTime()
                    const date2 = new Date(b.itemBeginDate).getTime()
                    return date2 - date1
                })
                re_itemArr.map((item) => {
                    tabList.push({ title: item.itemName })
                })
                console.log('获取公司下的项目', re_itemArr)
                that.setState({
                    itemArr: res.data,
                    tabList: tabList
                })
            }
        })
    }
    tabChange = (data) => {
        this.setState({
            current: data
        })
    }
    // 新增项目
    goToAddItem = () => {
        const { cid } = this.state
        Taro.navigateTo({ url: `../addItem/addItem?cid=${cid}` })
    }
    // 编辑项目
    editItem=(item)=>{
        Taro.navigateTo({ url: `../addItem/addItem?iid=${item.id}` })
    }
    // 删除项目
    deleteItem=(item)=>{
       httpUtil.request({
           url:'/item/delete',
           method:'POST',
           data:{
               iid:item.id+'',
               cid:item.cid
           },
           success(res){
               console.log('删除成功',res)
           }
       })
    }
    render() {
        const { itemArr, workDsc, companyDsc, current, tabList, longitude, latitude, timeLine, companyName, postName, salary, beginDate, overDate, timeLineArr, markers } = this.state

        return (
            <View>
                <View className='company-info'>
                    <Map markers={markers} longitude={longitude} latitude={latitude} scale={15} showLocation={true} subkey="SLSBZ-MRXKQ-LLW5C-GPCGS-BY7US-7XFN7" style="width: 100%;" />
                    <AtButton onClick={this.goToAddItem}>新增项目</AtButton>
                    <AtTabs current={current} onClick={(data) => this.tabChange(data)} tabList={tabList} scroll>
                        <AtTabsPane current={current} index={0} >
                            <View  >
                                <View>公司名称：{companyName}</View>
                                <View>在职日期：{beginDate}至{overDate}</View>
                                <View>公司简介：{companyDsc}</View>
                                <View>工作描述：{workDsc}</View>
                                <View>职位：{postName}</View>
                                <View>薪资：{salary}</View>
                            </View>
                        </AtTabsPane>
                        {
                            itemArr ? itemArr.map((item, index) => {
                                console.log('item', item)
                                return (
                                    <AtTabsPane current={current} index={index + 1} key={index+1}>
                                        <AtTag type='primary' size='small' active={true} circle onClick={() => this.editItem(item)}>编辑</AtTag>
                                        <AtTag size='small' active={true} circle onClick={() => this.deleteItem(item)}>删除</AtTag>
                                        <View>项目名称：{item.itemName}</View>
                                        <View>项目时间：{item.itemBeginDate}至{item.itemOverDate}</View>
                                        <View>职位：{item.postName}</View>
                                        <View>项目描述：{item.itemDsc}</View>
                                        <View>我的分工：{item.myDivision}</View>
                                    </AtTabsPane>
                                )
                            }) : ''
                        }
                    </AtTabs>
                </View>
            </View>
        )
    }
}
