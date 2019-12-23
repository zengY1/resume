import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea, AtTag } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    workList?: any

}
export default class ArtWork extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            workList: []
        }
    }
    config: Config = {
        navigationBarTitleText: '个人作品'
    }
    componentDidShow() {
        this.getWorkList()
    }
    // 新增
    gotoAddWork = () => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addArtWork/addArtWork` })
    }
    // 获取列表
    getWorkList = () => {
        const that = this
        httpUtil.request({
            url: '/work/list',
            success(res) {
                if (res.errorCode == '00000') {
                    let list = res.data
                    that.setState({
                        workList: list
                    })
                }
            }
        })
    }
    //删除个人技能 
    deleteWork = (item) => {
        const that = this
        Taro.showModal({
            title: '删除',
            content: '确定删除该个人作品？',
            success(res) {
                if (res.confirm) {
                    httpUtil.request({
                        url: '/work/delete',
                        method: 'POST',
                        data: { wid: item.id },
                        success(res) {
                            if (res.errorCode == '00000') {
                                that.getWorkList()
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
    editWork = (item) => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addArtWork/addArtWork?wid=${item.id}` })
    }
    render() {
        const { workList } = this.state
        return (
            <View>
                <AtCard
                    title='个人作品' className='card'>
                    {workList.length > 0 ? workList.map((item, index) => {
                        return (
                            <View key={index} className='school-item'>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>作品名称：</Text></View>
                                    <View className='infoContent'><Text>{item.workName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>作品URL：</Text></View>
                                    <View className='infoContent'><Text>{item.workUrl}</Text></View>
                                </View>
                                <View className='tagBtn'>
                                    <AtTag size='small' active={true} circle onClick={() => this.deleteWork(item)}>删除</AtTag>
                                    <View className='zhanwei'></View>
                                    <AtTag type='primary' size='small' active={true} circle onClick={() => this.editWork(item)}>编辑</AtTag>
                                </View>
                            </View>
                        )
                    }) : <View className='empty'>暂无信息！</View>}
                </AtCard>
                <View className='bottomBtn'><AtButton circle onClick={this.gotoAddWork} type="primary">新增个人作品</AtButton></View>
            </View>
        )
    }
}
