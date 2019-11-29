import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea,AtTag } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
    records?: any,
    record?: number,
    schoolName?: string,
    projectName?: string,
    beginDate?: string,
    overDate?: string,
    schoolList?: any

}
export default class School extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            records: ['博士后', '博士', '硕士', '本科', '大专', '高中', '中专', '初中', '小学'],
            record: 0,
            schoolName: '',
            projectName: '',
            beginDate: '',
            overDate: '',
            schoolList: []
        }
    }
    config: Config = {
        navigationBarTitleText: 'school'
    }
    componentDidMount() {
        this.getSchoolList(4)

    }
    goToAddSchool = () => {
        Taro.navigateTo({ url: `../addSchool/addSchool` })
    }
    getSchoolList = (uid) => {
        const that = this
        httpUtil.request({
            url: '/school/list',
            data: { uid: uid },
            success(res) {
                console.log('res', res)
                let list =res.data
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
    // 删除教育经验
    deleteSchool = (data) => {
        const that = this
        httpUtil.request({
            url: '/school/delete',
            method: 'POST',
            data: {
                sid: data.id
            },
            success(res) {
                that.componentDidMount()
                console.log('res', res)
            }
        })
    }
    // 编辑教育经验
    editSchool = (data) => {
        Taro.navigateTo({ url: `../addSchool/addSchool?sid=${data.id}` })
    }
    render() {
        const { records, record, schoolName, projectName, beginDate, overDate, schoolList } = this.state
        return (
            <View>
                <AtButton onClick={this.goToAddSchool} type="primary">新增教育经历</AtButton>
                <AtCard
                    title='教育经历'>
                    {schoolList ? schoolList.map((item, index) => {
                        return (
                            <View key={index} className='school-item'>
                                <View>学校：{item.schoolName}</View>
                                <View>学历：{records[item.record]}</View>
                                <View>专业：{item.projectName}</View>
                                <View>入学日期：{item.schoolBeginDate}</View>
                                <View>毕业日期：{item.schoolOverDate}</View>
                                <AtTag type='primary' size='small' active={true} circle onClick={() => this.editSchool(item)}>编辑</AtTag>
                            <AtTag size='small' active={true} circle onClick={() => this.deleteSchool(item)}>删除</AtTag>
                            </View>
                        )
                    }) : ''}

                </AtCard>
            </View>
        )
    }
}
