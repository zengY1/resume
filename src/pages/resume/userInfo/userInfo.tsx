import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio } from 'taro-ui'
import {dateUtil} from '../../../utils/static'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    resumeInfo?: any,
    buttonType?: string
}
export default class User extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            resumeInfo: {},
            buttonType: 'add'

        }
    }
    config: Config = {
        navigationBarTitleText: '个人信息'
    }
    // componentDidMount() {
    //     this.getResumeInfo()
    // }
    componentDidShow(){
        this.getResumeInfo()
    }
    // 获取当前的resume信息
    getResumeInfo = () => {
        const that = this
        httpUtil.request({
            url: '/info/get',
            method: 'GET',
            success(res) {
                console.log(res)
                const buttonType = res.data ? 'edit' : 'add'
                that.setState({
                    resumeInfo: res.data,
                    buttonType: buttonType
                })
            }
        })
    }
    // goToAddPage 的事件
    goToAddPage = () => {
        const { buttonType, resumeInfo } = this.state
        if (buttonType === 'edit') {
            Taro.navigateTo({
                url: `../../addOrEdit/addUserInfo/addUserInfo?id=${resumeInfo.id}`
            })
        } else {
            Taro.navigateTo({
                url: '../../addOrEdit/addUserInfo/addUserInfo'
            })
        }

    }
    // 删除用户信息
    delUserInfo = () => {
        const { resumeInfo } = this.state
        const that = this
        Taro.showModal({
            title: '删除',
            content:'确定删除该个人信息？',
            success(res){
                if(res.confirm){
                    httpUtil.request({
                        url: '/info/delete',
                        method: 'POST',
                        data: {
                            id: resumeInfo.id
                        },
                        success(res) {
                            console.log('res',res)
                            if (res.code == '00000') {
                                Taro.showToast({
                                    title: '删除成功！'
                                })
                                that.getResumeInfo()
                            }
                        }
                    })
                }
                else{

                }
            }
        })
    }
    render() {
        const { resumeInfo, buttonType } = this.state
        return (
            <View>
                <AtCard
                    title='个人信息' className='card'>
                {
                     buttonType === 'edit' ? <View className='item'>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>姓名：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.realName}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>性别：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.sex == 1 ? '女' : '男'}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>出生日期：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.birthday}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>联系方式：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.mobile}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>电子邮箱：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.email}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>居住地址：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.address}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>工作城市：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.city}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>求职岗位：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.province}</Text></View>
                     </View>
                     <View className='infoItem'>
                         <View className='infoLabel'><Text>期望薪资：</Text></View>
                         <View className='infoContent'><Text>{resumeInfo.salary}</Text></View>
                     </View>
                 </View>:<View className='empty'>暂无信息！</View>
                }
                </AtCard>
                <View className='bottomBtn'>
                {
                    buttonType === 'edit' ? <View className='buttonGroup'>
                        <AtButton circle type="primary" onClick={this.goToAddPage} className='addBtn'>编辑个人信息</AtButton>
                        <AtButton circle onClick={this.delUserInfo} className='delBtn'>删除个人信息</AtButton>
                    </View> : <View className='oneBtn'><AtButton circle type="primary" onClick={this.goToAddPage} >新增个人信息</AtButton></View>
                }
                </View>
            </View>
        )
    }
}
