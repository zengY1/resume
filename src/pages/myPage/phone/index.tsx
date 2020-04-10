import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtTabBar, AtForm, AtInput,AtMessage } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
import regMobile from '../../../utils/mobile'
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
    // 点击确认事件
    addMobileBtn=()=>{
        const { mobile, psd, rePsd } = this.state
        const reg=regMobile(mobile)
        if(!reg){
            Taro.atMessage({
                'message':'请输入正确的手机号码！',
                'type':'warning'
            })
            return 
        }
        if(psd==''){
            Taro.atMessage({
                'message':'密码不能为空！',
                'type':'warning'
            })
            return 
        }
        if(psd==rePsd){
            httpUtil.request({
                url:'/user/mobile/add',
                method:'POST',
                data:{
                    mobile:mobile,
                    passWord:psd
                },
                success(res){
                    console.log('新增手机号码',res)
                    if(res.code=='20001'){
                        Taro.showToast({
                            title:'该手机号已绑定其他用户，请联系客服修改！',
                            icon:'none',
                            duration:2500
                        })
                        return 
                    }
                    if(res.errorCode=='00000'){
                        Taro.setStorage({key:'mobile',data:mobile})
                        Taro.navigateBack()
                        Taro.showToast({
                            title:'手机号绑定成功！'
                        })
                    }
                }
            })
        }else{
            Taro.atMessage({
                'message':'确认密码与密码不一致！',
                'type':'warning'
            })
        }

    }
    render() {
        const { mobile, psd, rePsd } = this.state
        return (
            <View className='phone'>
                <AtMessage/>
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
                <View className="phomeBtn">
                    <AtButton onClick={this.addMobileBtn} type="primary">确认</AtButton>
                </View>
            </View>
        )
    }
}