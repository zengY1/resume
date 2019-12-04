import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard,AtTabBar } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  userInfo?: any,
  getUserInfo?: any,
  modalVisible?: boolean,
  current?:number
}
export default class First extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      getUserInfo: {},
      modalVisible: false,
      current:1
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
    navigationBarTitleText: '首页'
  }

  componentWillMount() { }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      this.setState({
        getUserInfo: userInfo
      })
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  goToUser=()=>{
    Taro.navigateTo({url:'../resume/user/user'})
  }
  goToMap=()=>{
    Taro.navigateTo({url:'../resume/map/map'})
  }
  goToUserInfo=()=>{
    Taro.navigateTo({url:'../resume/resume-userInfo/resume-userInfo'})
  }
  goToTimeLine=()=>{
    Taro.navigateTo({url:'../resume/timeLine/timeLine'})
  }
  goToSchool=()=>{
    Taro.navigateTo({url:'../resume/school/school'})
  }
 
  render() {
    const { getUserInfo, modalVisible } = this.state
    console.log('modalVisible', getUserInfo)
    return (
      <View>
        <View className='wrapper'>
          <View>
            <View>
              用户名：{getUserInfo.userName}
            </View>
            <View>头像：<Image src={getUserInfo.avatarUrl} className="img" style='height:120px;width:120px' /></View>
          </View>
          <AtCard
            title='相关的API' 
          >
            <AtButton onClick={this.goToUser}>User的Api</AtButton>
            <AtButton onClick={this.goToUserInfo}>resume-userInfo的Api</AtButton>
            <AtButton onClick={this.goToMap}>map</AtButton>
            <AtButton onClick={this.goToTimeLine}>timeLine</AtButton>
            <AtButton onClick={this.goToSchool}>school</AtButton>
          </AtCard>
          
        </View >
      </View>
    )
  }
}
