import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtTabBar, AtForm, AtInput, AtMessage } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    url?: string,
    psd?: string,
    rePsd?: string,
    help?:string
}
export default class Web extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            url: 'http://wx.znike.top:9001',
            psd: '',
            rePsd: '',
            help:'https://blog.csdn.net/Zeng__Yi/article/details/105406001'
        }
    }
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '网页编辑指导'
    }
    componentWillMount() { }
    componentDidMount() { }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    // 绑定手机号
    goToPhone = () => {
        Taro.navigateTo({ url: '../../myPage/phone/index' })
    }
    // 复制URL
    goCopeUrl = () => {
        const { url } = this.state
        Taro.setClipboardData({
            data: url,
            success() {
                Taro.getClipboardData({
                    success() {
                        Taro.showToast({
                            title: '链接已复制！'
                        })
                    }
                })
            }
        })
    }
    // help
    goHelpUrl=()=>{
        const { help } = this.state
        Taro.setClipboardData({
            data: help,
            success() {
                Taro.getClipboardData({
                    success() {
                        Taro.showToast({
                            title: '链接已复制！'
                        })
                    }
                })
            }
        })
    }
    render() {
        return (
            <View className='web'>
                <AtMessage />
                <View className='step'>
                    <View className='step-title'>步骤一</View>
                    <View className='step-content'>绑定手机号，并填写登陆密码。</View>
                    <View className='step-btn'>
                        若没有绑定手机号点击按钮
                        <AtButton onClick={this.goToPhone}>绑定手机号</AtButton>
                    </View>
                </View>
                <View className='step'>
                    <View className='step-title'>步骤二</View>
                    <View className='step-content'>使用电脑浏览器输入:</View>
                    <View className='step-btn'>http://wx.znike.top:9001
                        <AtButton onClick={this.goCopeUrl}>复制链接</AtButton>
                    </View>
                </View>
                <View className='step'>
                    <View className='step-title'>My简历的帮助文档</View>
                    <View className='step-content'>使用电脑浏览器输入:</View>
                    <View className='help'>https://blog.csdn.net/Zeng__Yi/article/details/105406001</View>
                    <AtButton onClick={this.goHelpUrl}>复制链接</AtButton>
                </View>
            </View>
        )
    }
}