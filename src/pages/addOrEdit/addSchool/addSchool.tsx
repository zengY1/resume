import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtTimeline, AtTextarea } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    records?: any,
    record?: number,
    schoolName?: string,
    projectName?: string,
    beginDate?: string,
    overDate?: string,
    schoolDsc?: string,
    address?: string,
    longitude?: string,
    latitude?: string,
    id?: number



}
export default class AddSchool extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            records: ['博士后', '博士', '硕士', '本科', '大专', '高中', '中专', '初中', '小学'],
            record: 0,
            schoolName: '',
            projectName: '',
            beginDate: '',
            overDate: '',
            schoolDsc: '滁州学院，位于安徽省滁州市',
            address: '',
            longitude: '',
            latitude: '',
            id: 0
        }
    }
    config: Config = {
        navigationBarTitleText: 'school'
    }
    componentDidMount() {
        const params = this.$router.params
        const sid = params.sid
        if (sid) {
            this.getOneSchool(sid)
        }
    }
    // 获取一个school
    getOneSchool(sid) {
        const that = this
        httpUtil.request({
            url: '/school/schoolByUid',
            data: { id: sid },
            success(res) {
                console.log('res', res)
                const data = res.data
                that.setState({
                    address: data.address,
                    schoolName: data.schoolName,
                    schoolDsc: data.schoolDsc,
                    id: data.id,
                    record: data.record,
                    projectName: data.projectName,
                    beginDate: data.schoolBeginDate,
                    overDate: data.schoolOverDate

                })
            }
        })
    }
    // 学历
    onRecordsChange = (data) => {
        console.log('data', data)
        this.setState({ record: data.detail.value })
    }
    // 学校名称
    changeSchoolName = (data) => {
        this.setState({
            schoolName: data
        })
    }
    // 专业名称
    changeProjectName = (data) => {
        this.setState({
            projectName: data
        })
    }
    // 开始时间
    changeBeginDate = (data) => {
        this.setState({ beginDate: data.detail.value })
    }
    // 结束时间
    changeOverDate = (data) => {
        this.setState({ overDate: data.detail.value })
    }
    // 提交
    addSchool = () => {
        const { id, record, schoolName, projectName, beginDate, overDate, schoolDsc, address, latitude, longitude } = this.state
        console.log('data', record, schoolName, projectName, beginDate, overDate)
        const that = this
        if (id) {
            httpUtil.request({
                url: '/school/edit',
                method: 'POST',
                data: {
                    id: id,
                    record: record,
                    schoolName: schoolName,
                    projectName: projectName,
                    schoolBeginDate: beginDate,
                    schoolOverDate: overDate,
                    schoolDsc: schoolDsc,
                    address: address,
                    latitude: latitude,
                    longitude: longitude
                },
                success(res) {
                    that.setState({
                        id: 0
                    })
                }
            })
        } else {
            httpUtil.request({
                url: '/school/add',
                method: 'POST',
                data: {
                    record: record,
                    schoolName: schoolName,
                    projectName: projectName,
                    schoolBeginDate: beginDate,
                    schoolOverDate: overDate,
                    schoolDsc: schoolDsc,
                    address: address,
                    latitude: latitude,
                    longitude: longitude
                },
                success(res) {
                    console.log('res', res)
                }
            })
        }

    }
    // 学校地址
    getLocation = (e) => {
        const that = this
        Taro.chooseLocation({
            success(res) {
                console.log(res)
                that.setState({
                    address: res.address,
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            }
        })
    }
    // 学校的简介
    changeSchoolDsc = (data) => {
        this.setState({
            schoolDsc: data.detail.value
        })
    }
    render() {
        const { records, record, schoolName, projectName, beginDate, overDate, address, schoolDsc } = this.state
        return (
            <View>
                <AtCard
                    title='新增教育经历'>
                    <AtForm>
                        <AtInput
                            name='school'
                            border={false}
                            title='学校'
                            type='text'
                            placeholder='学校'
                            value={schoolName}
                            onChange={(data) => this.changeSchoolName(data)}
                        />
                        <AtInput
                            name='school'
                            border={false}
                            title='专业'
                            type='text'
                            placeholder='专业'
                            value={projectName}
                            onChange={(data) => this.changeProjectName(data)}
                        />
                        <View className='page-section'>
                            <Text>学历</Text>
                            <View>
                                <Picker mode='selector' range={records} onChange={this.onRecordsChange}>
                                    <View className='picker'>
                                        当前选择：{record}
                                    </View>
                                </Picker>
                            </View>
                        </View>
                        <View>
                            <AtButton onClick={this.getLocation}>选择地址</AtButton>
                            <Text>地址：{address}</Text>
                        </View>
                        <View className='addItem'>开始时间：
                            <Picker mode='date' onChange={this.changeBeginDate}>
                                <View>
                                    当前选择：{beginDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='addItem'>结束时间：
                            <Picker mode='date' onChange={this.changeOverDate}>
                                <View>
                                    当前选择：{overDate}
                                </View>
                            </Picker>
                        </View>
                        <View>学校简介：</View>
                        <AtTextarea value={schoolDsc} onChange={this.changeSchoolDsc} maxLength={200} placeholder='学校简介' />

                    </AtForm>
                    <AtButton onClick={this.addSchool} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
