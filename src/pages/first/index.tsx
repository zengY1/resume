import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtNoticebar, AtList, AtListItem, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { records, getImgUrl, dateUtil } from '../../utils/static'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  resumeInfo?: any,
  schoolList?: any,
  timeLineArr?: any,
  skillList?: any,
  workList?: any,
  noticeString: string,
  columnArr?: any,
  noticeModalVisible?: boolean,
  noticeModalData?: boolean
}
export default class First extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      resumeInfo: {},
      schoolList: [],
      timeLineArr: [],
      skillList: [],
      workList: [],
      noticeString: '',
      columnArr: [],
      noticeModalVisible: true,
      noticeModalData: false
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
    navigationBarTitleText: '预览简历'
  }

  componentWillMount() {
    const notice = Taro.getStorageSync('noticeModal')
    if (notice) {
      this.setState({
        noticeModalVisible: false
      })
    }
  }

  componentDidMount() {
    const user = Taro.getStorageSync('userInfo')

    if (user) {
      this.getResumeNotice()
    }
  }
  // 获取简历的通知信息
  getResumeNotice = () => {
    const that = this
    httpUtil.request({
      url: '/notice/list',
      method: 'GET',
      success(res) {
        that.getResumeInfo()
        that.getResumeSchool()
        that.getResumeCompany()
        that.getResumeSkill()
        that.getResumeArtWork()
        if (res.data) {
          const noticeArr = res.data
          let rowArr = []//滚动的通知
          let columnArr = []//弹框的通知
          noticeArr.map((item: any) => {
            if (item.noticeType == '1') {
              columnArr.push(item)
            } else {
              rowArr.push(item.noticeContent)
            }
          })
          if (rowArr.length > 0) {
            let st = ''
            rowArr.map((item, index) => {
              const order = index + 1
              st = st + order + '，' + item
            })
            that.setState({ noticeString: st })
          }
          if (columnArr.length > 0) {
            that.setState({ noticeModalData: true })
          }
          that.setState({ columnArr: columnArr })
        }
      }
    })
  }
  // 获取简历的用户信息
  getResumeInfo = () => {
    const that = this
    httpUtil.request({
      url: '/info/get',
      method: 'GET',
      success(res) {
        if (res.data) {
          that.setState({
            resumeInfo: res.data,
          })
        }
      }
    })
  }
  //获取学历信息
  getResumeSchool = () => {
    const that = this
    httpUtil.request({
      url: '/school/list',
      method: 'GET',
      success(res) {
        let list = res.data
        list.sort(function (a, b) {
          const date1 = new Date(a.schoolBeginDate).getTime()
          const date2 = new Date(b.schoolBeginDate).getTime()
          return date2 - date1
        })
        that.setState({
          schoolList: list
        })
      }
    })
  }
  // 获取工作信息
  getResumeCompany = () => {
    const that = this
    httpUtil.request({
      url: '/company/list',
      method: 'GET',
      success(res) {
        const timeLineArr = res.data
        timeLineArr.sort(function (a, b) {
          const date1 = new Date(a.beginDate).getTime()
          const date2 = new Date(b.beginDate).getTime()
          return date2 - date1

        })
        that.setState({
          timeLineArr: timeLineArr
        })
      }
    })
  }
  // 获取个人技能
  getResumeSkill = () => {
    const that = this
    httpUtil.request({
      url: '/skill/list',
      success(res) {
        if (res.errorCode == '00000') {
          let list = res.data
          list.sort(function (a, b) {
            return a.skillGrade - b.skillGrade
          })
          that.setState({
            skillList: list
          })
        }
      }
    })
  }
  // 获取个人作品
  getResumeArtWork = () => {
    const that = this
    httpUtil.request({
      url: '/work/list',
      success(res) {
        if (res.errorCode == '00000') {
          let list = res.data
          that.setState({
            workList: list
          })
        }
      }
    })
  }
  // 点击复制
  cloneArtWordUrl = (data) => {
    const url = data.workUrl
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
  //通知的确定 
  modalOk = () => {
    Taro.setStorageSync('noticeModal', true)
    this.setState({
      noticeModalVisible: false
    })
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  goToSchoolInfo = (data) => {
    Taro.navigateTo({ url: `/pages/resume/schoolInfo/schoolInfo?sid=${data.id}` })
  }
  goToCompanyInfo = (data) => {
    Taro.navigateTo({ url: `/pages/resume/companyInfo/companyInfo?cid=${data.id}` })
  }
  gotoSkillList = (data) => {
    Taro.navigateTo({ url: `/pages/resume/skillList/skillList` })
  }
  render() {
    const { resumeInfo, schoolList, timeLineArr, skillList, workList, noticeString, noticeModalVisible, columnArr, noticeModalData } = this.state
    const time = timeLineArr.map((item, index) => {
      return (
        <View key={item.id}>
          <View className='timeLine-item'>
            <View className='circle-line'>
              <View className='circle'></View>
              <View className='line'></View>
            </View>
            <View className='content'>
              <View onClick={() => this.goToCompanyInfo(item)}>
                <View className='infoItem'>
                  <View className='infoLabel'><Text>公司名称：</Text></View>
                  <View className='infoContent'><Text>{item.companyName}</Text></View>
                </View>
                <View className='infoItem'>
                  <View className='infoLabel'><Text>岗位名称：</Text></View>
                  <View className='infoContent'><Text>{item.postName}</Text></View>
                  <View className='right-arrow'></View>
                </View>
                <View className='infoItem'>
                  <View className='infoLabel'><Text>在职时间：</Text></View>
                  <View className='infoContent'><Text>{item.beginDate}至{item.overDate}</Text></View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    })
    return (
      <View>
        {/* 系统的通知提醒 */}
        <AtModal isOpened={noticeModalVisible && noticeModalData} closeOnClickOverlay={false}>
          <AtModalHeader>{columnArr[0].noticeTitle}</AtModalHeader>
          <AtModalContent>
            <View className="modal-content">
              <View>{columnArr[0].noticeContent}</View>
            </View>
          </AtModalContent>
          <AtModalAction><Button onClick={this.modalOk}>确定</Button> </AtModalAction>
        </AtModal>
        {noticeString == '' ? '' :
          <View className='notice'>
            <AtNoticebar icon='volume-plus' marquee>
              {noticeString}
            </AtNoticebar>
          </View>
        }
        <View className='wrapper'>
          {Object.keys(resumeInfo).length > 0 ? <View>
            <View className='fist-card'>
              <View className='user-info'>
                <View className='name'>{resumeInfo.realName}</View>
                <View className='others'>
                  <View>{resumeInfo.sex == '0' ? '男' : '女'}</View>
                  <View>{resumeInfo.mobile}</View>
                  <View>{resumeInfo.city}</View>
                  <View>{dateUtil(resumeInfo.birthday)}岁</View>
                </View>
              </View>
            </View>
            <View className='item'>
              <AtCard title='求职期望' className='card-model'>
                <View className='expect'>
                  <View className='post'>
                    <Text>{resumeInfo.province}</Text>,<Text>{resumeInfo.city}</Text>
                  </View>
                  <View>
                    {resumeInfo.salary}
                  </View>
                </View>
              </AtCard>
            </View>
          </View> : ''}

          {
            schoolList.length > 0 ? <View className='item'>
              <AtCard title='教育经历'>
                <AtList hasBorder={false}>
                  {
                    schoolList.map((item, index) => {
                      return (
                        <AtListItem
                          arrow='right'
                          title={item.schoolName}
                          extraText={item.projectName}
                          note={records[item.record]}
                          onClick={() => this.goToSchoolInfo(item)}
                          key={item.id}
                        />
                      )
                    })
                  }
                </AtList>
              </AtCard>
            </View> : ''
          }
          {
            timeLineArr.length > 0 ? <View className='item'>
              <AtCard
                title='工作经历'>

                <View className='timeLine'>
                  {time}
                </View>
              </AtCard>
            </View> : ''
          }

          {
            skillList.length > 0 ? <View className='item'>
              <AtCard title='个人技能'>
                <AtList hasBorder={false}>
                  <View onClick={this.gotoSkillList} className='skill-item'>
                    <View className='skill'>
                      {skillList.map((item, index) => {
                        let targe
                        if (item.skillGrade == 0) {
                          targe = <View className='skill-tag tag-one' key={item.id}>{item.skillName}</View>
                        } else if (item.skillGrade == 1) {
                          targe = <View className='skill-tag tag-two' key={item.id}>{item.skillName}</View>
                        } else if (item.skillGrade == 2) {
                          targe = <View className='skill-tag tag-three' key={item.id}>{item.skillName}</View>
                        } else if (item.skillGrade == 3) {
                          targe = <View className='skill-tag tag-four' key={item.id}>{item.skillName}</View>
                        } else if (item.skillGrade == 4) {
                          targe = <View className='skill-tag tag-five' key={item.id}>{item.skillName}</View>
                        }
                        return (
                          targe
                        )
                      })}
                    </View>
                    <View className='skill-right-arrow'></View>
                  </View>
                </AtList>
              </AtCard>
            </View> : ''
          }

          {
            workList.length > 0 ? <View className='item'>
              <AtCard title='个人作品'>
                <View className='art'>
                  {
                    workList.map((item, index) => {
                      return (
                        <View className='art-item' onClick={() => { this.cloneArtWordUrl(item) }} key={item.id}>
                          <Image className='item-img' src={getImgUrl(item.imgType)}></Image>
                          <View className='item-title'>{item.workName}</View>
                        </View>
                      )
                    })
                  }
                </View>
              </AtCard>
              <View className='bottomBtn'>
                <AtButton openType='share' circle type="primary">分享我的简历</AtButton>
              </View>
            </View> : ''
          }
          {
            Taro.getStorageSync('token')&&Object.keys(resumeInfo).length < 1 ? <View className='empty'>当前简历为空，请完善您的简历！</View> : ''
          }
          {
            Taro.getStorageSync('token') ?"": <View className='empty'>当前未登录，请您先登录！</View> 
          }
        </View>
      </View>
    )
  }
}
