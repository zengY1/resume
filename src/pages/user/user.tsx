import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  userInfo?: any,
  getUserInfo?: any,
  modalVisible?: boolean,
  userList?: any[],
  mobile?: number | undefined
}
export default class User extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      mobile: undefined
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

  getUserList = () => {
    const that = this
    const a = {
      page: 1,
      size: 3
    }
    httpUtil.request({
      url: '/user/count/list',
      data: a,
      success: function (res) {
        console.log('ressea', res.data)
        that.setState({
          userList: res.data.rows
        })
      }
    })
  }
  changeInput = (data) => {

    this.setState({
      mobile: data
    })
  }
  changeMobile = () => {
    const { mobile } = this.state
    console.log('mobile', mobile)
    httpUtil.request({
      url: '/user/mobile/edit',
      method:'POST',
      data: {mobile:mobile},
      success: function (res) {
        console.log('ressea', res.data)
        // that.setState({
        //   userList: res.data.rows
        // })
      }
    })
  }
  render() {
    const { userList, mobile } = this.state
    const user = userList ? userList.map((item, index) => {
      return (
        <View key={index}>编号：{index}  用户名：{item.userName}</View>
      )
    }) : ''
    return (
      <View>
        <View className='item'>
          <AtButton onClick={this.getUserList} type="primary">用户列表-get</AtButton>
          {user}
        </View>
        <AtCard
          title='修改手机号码-post'
        >
          <AtForm>
            <AtInput
              name='mobile'
              border={false}
              title='手机号码'
              type='phone'
              placeholder='手机号码'
              value={mobile}
              onChange={(data) => this.changeInput(data)}
            />
          </AtForm>

          <AtButton onClick={this.changeMobile} type="primary">确认</AtButton>
        </AtCard>
      </View>
    )
  }
}
