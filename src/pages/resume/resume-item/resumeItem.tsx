import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea, AtTag } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    itemList?: any

}
export default class ResumeItem extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            itemList: []
        }
    }
    goToAddItem = () => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addItem/addItem` })
    }
    // 删除项目经验
    deleteItem = (item) => {
        const that = this
        Taro.showModal({
            title: '删除',
            content: '确定删除该项目经验？',
            success(res) {
                if (res.confirm) {
                    httpUtil.request({
                        url: '/item/delete',
                        method: 'POST',
                        data: {
                            iid: item.id + '',
                            cid: item.cid
                        },
                        success(res) {
                            console.log('删除成功', res)
                            that.componentDidShow()
                            Taro.showToast({
                                title: '删除成功！',
                                icon: 'success',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })
        
    }
    // 编辑项目经验
    editItem = (item) => {
        Taro.navigateTo({ url: `/pages/addOrEdit/addItem/addItem?iid=${item.id}` })
    }
    componentDidShow() {
        const that = this
        httpUtil.request({
            url: '/item/listByUid',
            method: 'GET',
            success(res) {
                console.log('itemList', res)
                that.setState({ itemList: res.data })
            }
        })
    }
    render() {
        const { itemList } = this.state
        return (
            <View>
                <AtCard
                    title='项目经历' className='card'>
                    {itemList.length > 0 ? itemList.map((item, index) => {
                        return (
                            <View key={index} className='school-item'>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>项目名称：</Text></View>
                                    <View className='infoContent'><Text>{item.itemName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>职位：</Text></View>
                                    <View className='infoContent'><Text>{item.postName}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>项目时间：</Text></View>
                                    <View className='infoContent'><Text>{item.itemBeginDate}至{item.itemBeginDate}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>项目描述：</Text></View>
                                    <View className='infoContent'><Text>{item.itemDsc}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>我的分工：</Text></View>
                                    <View className='infoContent'><Text>{item.myDivision}</Text></View>
                                </View>
                                <View className='tagBtn'>
                                    <AtTag size='small' active={true} circle onClick={() => this.deleteItem(item)}>删除</AtTag>
                                    <View className='zhanwei'></View>
                                    <AtTag type='primary' size='small' active={true} circle onClick={() => this.editItem(item)}>编辑</AtTag>
                                </View>
                            </View>
                        )
                    }) : <View className='empty'>暂无信息！</View>}

                </AtCard>
                <View className='bottomBtn'><AtButton onClick={this.goToAddItem} circle type="primary">新增项目经验</AtButton></View>
            </View>
        )
    }
}
