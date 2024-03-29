import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtTextarea,AtMessage } from 'taro-ui'
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
    companyList?: any,
    companyPickValue?: string,
    cardTitle?:string


}
export default class TimeLine extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            itemName: '',
            postName: '',
            beginDate: '',
            overDate: '',
            cid: 0,
            itemDsc: '',
            workDsc: '',
            iid: 0,
            companyList: [],
            companyPickValue: '',
            cardTitle: '新增项目经验',
        }
    }
    config: Config = {
        navigationBarTitleText: '新增项目经验'
    }
    componentDidMount() {
        const params = this.$router.params
        const cid = params.cid
        const iid = params.iid
        if (iid) {
            this.getItemInfoByIid(iid)
            Taro.setNavigationBarTitle({
                title: '编辑项目经验'
            })
            this.setState({
                cardTitle:'编辑项目经验'
            })
        }
        this.getCompanyListByUid()
        this.setState({
            cid: cid
        })
    }
    // 根据uid查公司的列表
    getCompanyListByUid = () => {
        const that = this
        httpUtil.request({
            url: '/company/list',
            method: 'GET',
            success(res) {
                const companyList = res.data
                const { cid } = that.state
                companyList.sort(function (a, b) {
                    const date1 = new Date(a.beginDate).getTime()
                    const date2 = new Date(b.beginDate).getTime()
                    return date2 - date1

                })
                let newArrList: any = []
                companyList.map((item) => {
                    const a = {
                        id: item.id,
                        name: item.companyName
                    }
                    newArrList.push(a)
                })
                const inde = cid ? newArrList.findIndex((item) => item.id == cid) : ''

                that.setState({
                    companyList: newArrList,
                    companyPickValue: inde
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
        this.setState({
            itemName: data
        })
    }
    // 岗位名称
    changePostName = (data) => {
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
        this.setState({
            workDsc: data.detail.value
        })
    }
    // 公司的选择
    companySelectChange = (data) => {
        const value = data.detail.value
        const { companyList } = this.state
        this.setState({
            companyPickValue: value,
            cid: companyList[value].id
        })

    }
    // item的提交
    addItem = () => {
        const { iid, workDsc, itemDsc, itemName, postName, beginDate, overDate, cid, } = this.state
        if (itemName == '') {
            Taro.atMessage({
                'message': '项目的名称不能为空！',
                'type': 'error',
            })
            return
        } else if (itemDsc == '') {
            Taro.atMessage({
                'message': '项目的描述不能为空！',
                'type': 'error',
            })
            return
        } else if (postName == '') {
            Taro.atMessage({
                'message': '职位名称不能为空！',
                'type': 'error',
            })
            return
        } else if (cid == '') {
            Taro.atMessage({
                'message': '公司的名称不能为空！',
                'type': 'error',
            })
            return
        } else if (beginDate == '') {
            Taro.atMessage({
                'message': '开始时间不能为空！',
                'type': 'error',
            })
            return
        } else if (overDate == '') {
            Taro.atMessage({
                'message': '结束时间不能为空！',
                'type': 'error',
            })
            return
        } else if (workDsc == '') {
            Taro.atMessage({
                'message': '我的分工不能为空！',
                'type': 'error',
            })
            return
        }
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
        const { workDsc, itemDsc, itemName, postName, beginDate, overDate, companyList, companyPickValue, cid,cardTitle } = this.state
        return (
            <View>
                 <AtMessage />
                <AtCard
                    title={cardTitle}>
                    <AtForm>
                        <View className='form-item'>
                            <View className='label'>公司</View>
                            <Picker mode='selector' range={companyList} onChange={this.companySelectChange} range-key='name'>
                                <View className='content'>{companyPickValue === '' ? '请选择' : companyList[companyPickValue].name}</View>
                            </Picker>
                        </View>
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
