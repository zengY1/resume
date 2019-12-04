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
  current?: number,
  loginOutModal?: boolean
}
export default class My extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      getUserInfo: {},
      phoneModalVisible: false,
      current: 1,
      loginOutModal: false
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
    const mobile = Taro.getStorageSync('mobile')
    if (userInfo) {
      // 如果用户信息中的手机号码不存在，显示弹框
      let fag = false
      if (!mobile) {
        fag = true
      } else {
        fag = false
      }
      this.setState({
        getUserInfo: userInfo,
        phoneModalVisible: fag
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
            console.log('success', res)
            Taro.setStorage({ key: 'token', data: res.token })
            Taro.setStorage({ key: 'userInfo', data: res.info[0] })
            Taro.setStorage({ key: 'mobile', data: res.info[0].mobile })
            that.setState({
              getUserInfo: res.info[0]
            })
            that.componentDidMount()
          }
        })
      }
    })
  }
  // model的取消
  cancelModal = () => {
    this.setState({
      phoneModalVisible: false,
      loginOutModal: false
    })
  }
  // modal的确定
  modalOk = () => {
    Taro.navigateTo({ url: '../myPage/phone/index' })
    this.setState({
      phoneModalVisible: false
    })
  }
  // 退出登录
  loginOut = () => {
    this.setState({
      loginOutModal: true
    })
  }
  // 退出登录的确定
  loginOutOk = () => {
    Taro.clearStorageSync()
    Taro.reLaunch({ url: '../index/index' })
  }
  // 跳转页面
  goToPage = (page) => {
    if (page === 1) {
      Taro.navigateTo({
        url:'/pages/resume/userInfo/userInfo'
      })
    } else if (page === 2) {
      Taro.navigateTo({
        url:'/pages/resume/school/school'
      })
    }else if (page === 3) {

    }else if (page === 4) {

    }else if (page === 5) {

    }else if (page === 6) {

    }
  }
  render() {
    const { getUserInfo, phoneModalVisible, loginOutModal } = this.state
    console.log('modalVisible', getUserInfo)
    return (
      <View className='page'>
        <View className='container'>
          <View className='top-container'>
            <Image className='bg-img' src='../../img/my/mine_bg_3x.png'></Image>

            <View className='logout' >
              <View className='logout_item' hidden={getUserInfo.id ? false : true} onClick={this.loginOut}>
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
          <View className='main'>
            <View className='card'>
              <View className='item' onClick={() => this.goToPage(1)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>个人信息</Text>
              </View>

              <View className='item' onClick={() => this.goToPage(2)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>学历信息</Text>
              </View>

              <View className='item' onClick={() => this.goToPage(3)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>工作经历</Text>
              </View>
              <View className='item' onClick={() => this.goToPage(4)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>项目经验</Text>
              </View>
              <View className='item' onClick={() => this.goToPage(5)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>证书技能</Text>
              </View>
              <View className='item' onClick={() => this.goToPage(6)}>
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>个人作品</Text>
              </View>
              {/* <View className='item' >
                <Image className='item-img' src='../../img/my/mine_icon_jiayouzhan_3x.png'></Image>
                <Text className='item-name'>联系客服</Text>
              </View> */}
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
        {/* 用户退出的提示框 */}
        <AtModal isOpened={loginOutModal}>
          <AtModalHeader>退出登录</AtModalHeader>
          <AtModalContent>
            <View>
              <View>是否退出当前用户的登陆？</View>
            </View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.cancelModal}>取消</Button> <Button onClick={this.loginOutOk}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
