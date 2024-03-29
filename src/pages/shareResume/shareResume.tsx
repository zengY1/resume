import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtList, AtListItem } from 'taro-ui'
import { records, getImgUrl, dateUtil } from '../../utils/static'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
  resumeInfo?: any,
  schoolList?: any,
  timeLineArr?: any,
  skillList?: any,
  workList?: any
}
export default class ShareResume extends Component<IProps, Istate> {
  constructor(props) {
    super(props)
    this.state = {
      resumeInfo: {},
      schoolList: [],
      timeLineArr: [],
      skillList: [],
      workList: []
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
    const params = this.$router.params
    const uid = params.uid || params.scene
    if (uid) {
      this.getResumeInfo(uid)
      this.getResumeSchool(uid)
      this.getResumeCompany(uid)
      this.getResumeSkill(uid)
      this.getResumeArtWork(uid)
    }
  }
  // 获取简历的用户信息
  getResumeInfo = (uid) => {
    const that = this
    httpUtil.request({
      url: '/info/get/share',
      method: 'GET',
      data: { uid },
      success(res) {
        if (res.data) {
          Taro.setNavigationBarTitle({ title: res.data.realName + '的简历' })
          that.setState({
            resumeInfo: res.data,
          })
        }
      }
    })
  }
  //获取学历信息
  getResumeSchool = (uid) => {
    const that = this
    httpUtil.request({
      url: '/school/list/share',
      method: 'GET',
      data: { uid },
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
  getResumeCompany = (uid) => {
    const that = this
    httpUtil.request({
      url: '/company/list/share',
      method: 'GET',
      data: { uid },
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
  getResumeSkill = (uid) => {
    const that = this
    httpUtil.request({
      url: '/skill/list/share',
      data: { uid },
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
  getResumeArtWork = (uid) => {
    const that = this
    httpUtil.request({
      url: '/work/list/share',
      data: { uid },
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
  // 打电话功能
  callMobile = () => {
    const { resumeInfo } = this.state
    const mobile = resumeInfo.mobile
    Taro.showModal({
      title: '拨打电话！',
      content: mobile,
      success(res) {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: mobile
          })
        }
        else {

        }
      }
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
    const { resumeInfo, schoolList, timeLineArr, skillList, workList } = this.state

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
          </View> : ''
        }
        <View className='bottomBtn'>
          <AtButton circle onClick={this.callMobile} type='primary'>立即联系</AtButton>
        </View>
      </View>
    )
  }
}
