import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './my.scss'
import { AtButton, AtCard, AtTabBar, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  userInfo?: any,
  getUserInfo?: any,
  phoneModalVisible?: boolean,
  current?: number
}
export default class My extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      getUserInfo: {},
      phoneModalVisible: true,
      current: 1
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
    navigationBarTitleText: 'My'
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
  // 点击登录
  userLogin = (e) => {
    const that = this
    const userInfo = e.detail.userInfo
    console.log('userInfo', userInfo)
    Taro.login({
      success: function (res) {
        const code = res.code
        console.log('res', code)
        httpUtil.request({
          url: '/auth/login',
          method: 'POST',
          data: {
            code: code,
            type: 'wxMin',
            userName: userInfo.nickName,
            sex: userInfo.gender === 0 ? '女' : '男',
            avatarUrl: userInfo.avatarUrl
          },
          success: function (res) {
            Taro.setStorage({ key: 'token', data: res.token })
            Taro.setStorage({ key: 'userInfo', data: res.info[0] })
            that.setState({
              getUserInfo: res.info[0]
            })
          }
        })
      }
    })
  }
  // model的取消
  cancelModal = () => {
    this.setState({
      phoneModalVisible: false
    })
  }
  // modal的确定
  modalOk=()=>{
    Taro.navigateTo({url:'../myPage/phone/index'})
    this.setState({
      phoneModalVisible: false
    })
  }
  render() {
    const { getUserInfo, phoneModalVisible } = this.state
    console.log('modalVisible', getUserInfo)
    return (
      <View className='container'>
        <View className='top-container'>
          <Image className='bg-img' src='../../img/my/mine_bg_3x.png'></Image>

          <View className='logout' >
            <View className='logout_item' hidden={getUserInfo.id ? false : true}>
              <Image className='logout-img' src='../../img/my/icon_out_3x.png'></Image>
              <Text className='logout-txt' >退出</Text>
            </View>
          </View>

          <View className='user'>
            <Image className='avatar-img' src={getUserInfo.id ? getUserInfo.avatarUrl : '../../img/my/mine_def_touxiang_3x.png'}></Image>
            <View className='user-info-mobile'>
              {
                getUserInfo.id ? <Text>{getUserInfo.userName}</Text> : <AtButton onGetUserInfo={this.userLogin} openType="getUserInfo"><Text className='login_btn'>请登陆</Text></AtButton>
              }

            </View>
          </View>
        </View>
        {/* 手机号的提示框 */}
        <AtModal isOpened={phoneModalVisible}>
          <AtModalHeader>绑定手机号</AtModalHeader>
          <AtModalContent>
            <View>
              <View>绑定的手机号将用于web端的登陆和拨打电话的功能</View>
            </View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.cancelModal}>取消</Button> <Button onClick={this.modalOk}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
