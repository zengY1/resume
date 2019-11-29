import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtTabBar, AtForm, AtInput } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    mobile?: string,
    psd?: string,
    rePsd?: string
}
export default class Phone extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            mobile: '',
            psd: '',
            rePsd: ''
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
        navigationBarTitleText: '手机号'
    }
    componentWillMount() { }
    componentDidMount() { }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    // 手机号码的事件
    changemobile=(data)=>{
        console.log('mobile',data)
        this.setState({
            mobile:data
        })
    }
    // 密码的事件
    changePsd=(data)=>{
        console.log('psd',data)
        this.setState({
            psd:data
        })
    }
    // 确认密码事件
    changeRePsd=(data)=>{
        console.log('repsd',data)
        this.setState({
            rePsd:data
        })
    }
    render() {
        const { mobile, psd, rePsd } = this.state
        return (
            <View>
                <AtForm>
                    <AtInput
                        name='item'
                        border={true}
                        title='手机号码'
                        type='text'
                        placeholder='请输入手机号'
                        value={mobile}
                        onChange={(data) => this.changemobile(data)}
                    />
                    <AtInput
                        name='item'
                        border={true}
                        title='登陆密码'
                        type='password'
                        placeholder='请输入密码'
                        value={psd}
                        onChange={(data) => this.changePsd(data)}
                    />
                    <AtInput
                        name='item'
                        border={false}
                        title='确认密码'
                        type='password'
                        placeholder='请输入确认密码'
                        value={rePsd}
                        onChange={(data) => this.changeRePsd(data)}
                    />
                </AtForm>
                <View>
                    <AtButton>确认</AtButton>
                </View>
            </View>
        )
    }
}