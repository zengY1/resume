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
    deleteItem=()=>{

    }
    // 编辑项目经验
    editItem=()=>{

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
