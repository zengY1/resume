import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtTabBar } from 'taro-ui'
import First from '../first/index'
import My from '../my/my'
import User from '../second/second'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  userInfo?: any,
  getUserInfo?: any,
  modalVisible?: boolean,
  current?: number,
  navigationBarTitleText: string
}
export default class Index extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {
        nickName: '',
        avatarUrl: '',
        gender: 0
      },
      getUserInfo: {},
      modalVisible: false,
      current: 0,
      navigationBarTitleText: '首页'
    }
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */


  componentWillMount() {
    const params = this.$router.params
    console.log('params', params)
    if (params.shareType == 'uid') {
      Taro.navigateTo({
        url: `/pages/shareResume/shareResume?uid=${params.uid}`
      })
    }
  }

  componentDidMount() {
    const params = this.$router.params
    const tab = parseInt(params.tab)
    if (tab) {
      this.setState({
        current: tab
      })
    }
  }

  componentWillUnmount() { }
  componentDidShow() {
  }

  componentDidHide() { }
  handleTabTest = (data) => {
    console.log('res', data)
    let navigationBarTitleText = '首页'
    if (data === 0) {
      navigationBarTitleText = '首页'
    } else if (data === 1) {
      navigationBarTitleText = '个人中心'
    } else {
      navigationBarTitleText = '我的'
    }
    this.setState({
      current: data,
      navigationBarTitleText: navigationBarTitleText
    })
  }
  onShareAppMessage() {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      return {
        title: '个人简历信息',
        path: `/pages/index/index?shareType=uid&uid=${userInfo.id}`,
        success: function () {
          console.log('成功！')
        },
        fail: function () {
          console.log('失败！')
        }
      }
    } else {

    }
  }
  render() {
    const { current, navigationBarTitleText } = this.state
    Taro.setNavigationBarTitle({
      title: navigationBarTitleText
    })
    return (
      <View>
        {
          // current === 0 ? <First /> : current === 1 ? <User /> : <My />
          current === 0 ? <First /> : <My />
        }

        <AtTabBar fixed={true}
          tabList={[
            { title: '首页', iconType: 'bullet-list' },
            // { title: '测试', iconType: 'bullet-list' },
            { title: '个人中心', iconType: 'folder' }
          ]}
          onClick={this.handleTabTest}
          current={this.state.current}
        />
      </View>
    )
  }
}
