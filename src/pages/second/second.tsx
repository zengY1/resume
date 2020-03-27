import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Canvas } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtImagePicker } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  userInfo?: any,
  getUserInfo?: any,
  modalVisible?: boolean,
  userList?: any[],
  mobile?: number | undefined,
  codeImgUrl?: any,
  files?: any
}
export default class User extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      mobile: undefined,
      codeImgUrl: '',
      files: []
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
  // 测试页面 uid为1
  onTestUid = () => {
    Taro.navigateTo({
      url: `/pages/shareResume/shareResume?uid=2`
    })
  }
  // 分享按钮
  onResumeShare = () => {
    const that = this
    httpUtil.request({
      url: '/wx/code',
      success(res) {

        const codeImg = res
        console.log(codeImg)
        that.setState({
          codeImgUrl: codeImg
        })
      }
    })
  }
  onShareAppMessage() {
    return {
      title: '分享页面的分享title',
      path: '/pages/index/index',
      success: function () {
        console.log('成功！')
      },
      fail: function () {
        console.log('失败！')
      }
    }
  }
  putImageChange = (data) => {
    console.log('dataImg', data)
    this.setState({
      files: data
    })
  }
  imageClick = (data) => {
    console.log('image', data)
  }
  // canvas 生成图片
  onCanvasImage = () => {
    Taro.navigateTo({
      url: `/pages/resumeCard/resumeCard`
    })
  }
  render() {
    const { files, codeImgUrl } = this.state
    return (
      <View>
        <View className='item'>
          <AtButton onClick={this.onTestUid} type="primary">测试查看分享uid</AtButton>
        </View>
        <View className='item'>
          <AtButton openType='share' type="primary">分享uid</AtButton>
        </View>
        <View className='item'>
          <AtButton type="primary" onClick={this.onResumeShare}>获取小程序码</AtButton>
        </View>
        <View className='item'>
          <AtButton type="primary" onClick={this.onCanvasImage}>生成名片</AtButton>
        </View>
        {/* <Image src='https://wx-resume.oss-cn-hangzhou.aliyuncs.com/codeImg/location.png' /> */}
        <View className='item'>
          <AtImagePicker
            files={files}
            onChange={this.putImageChange}
            onImageClick={this.imageClick}
          />
        </View>
        <View className="canvas-box">
          <Canvas canvasId="myCanvas" style='width: 300px; height: 200px;' type="2d" />
        </View>
        <View>{codeImgUrl}</View>
        <Image src={codeImgUrl} />

      </View>
    )
  }
}
