import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/map/map',
      'pages/shareResume/shareResume',
      'pages/myPage/phone/index',
      'pages/myPage/web/index',
      'pages/addOrEdit/addTimeLine/addTimeLine',
      'pages/addOrEdit/addItem/addItem',
      'pages/addOrEdit/addSchool/addSchool',
      'pages/addOrEdit/addUserInfo/addUserInfo',
      'pages/addOrEdit/skill/skill',
      'pages/addOrEdit/addArtWork/addArtWork',
      'pages/resume/companyInfo/companyInfo',
      'pages/resume/resume-item/resumeItem',
      'pages/resume/userInfo/userInfo',
      'pages/resume/school/school',
      'pages/resume/timeLine/timeLine',
      'pages/resume/skill/skill',
      'pages/resume/artWork/artWork',
      'pages/resume/schoolInfo/schoolInfo',
      'pages/resume/skillList/skillList',
      'pages/resumeCard/resumeCard'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'My简历',
      navigationBarTextStyle: 'black'
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    }
  }

  componentDidMount() { }

  componentDidShow() {
   }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
