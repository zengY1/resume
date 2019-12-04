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
    id?: number,
    cardTitle?: string



}
export default class AddSchool extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            records: ['博士后', '博士', '硕士', '本科', '大专', '高中', '中专', '初中', '小学'],
            record: -1,
            schoolName: '',
            projectName: '',
            beginDate: '',
            overDate: '',
            schoolDsc: '滁州学院，位于安徽省滁州市',
            address: '',
            longitude: '',
            latitude: '',
            id: 0,
            cardTitle: '新增学历信息',
        }
    }
    config: Config = {
        navigationBarTitleText: '新增学历信息'
    }
    componentDidMount() {
        const params = this.$router.params
        const sid = params.sid
        if (sid) {
            this.getOneSchool(sid)
            Taro.setNavigationBarTitle({
                title: '编辑学历信息'
            })
            this.setState({
                cardTitle: '编辑学历信息'
            })
        }
    }
    // 学历的回显
    getOneSchool(sid) {
        const that = this
        httpUtil.request({
            url: '/school/schoolBySid',
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
                    overDate: data.schoolOverDate,
                    latitude: data.latitude,
                    longitude: data.longitude

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
        const that = this
        if (schoolName == '') {
            Taro.atMessage({
                'message': '学校名称不能为空！',
                'type': 'error',
            })
            return
        } else if (projectName == '') {
            Taro.atMessage({
                'message': '专业名称不能为空！',
                'type': 'error',
            })
            return
        } else if (record == -1) {
            Taro.atMessage({
                'message': '学历不能为空！',
                'type': 'error',
            })
            return
        } else if (address == '') {
            Taro.atMessage({
                'message': '学校地址不能为空！',
                'type': 'error',
            })
            return
        } else if (beginDate == '') {
            Taro.atMessage({
                'message': '入学时间不能为空！',
                'type': 'error',
            })
            return
        } else if (overDate == '') {
            Taro.atMessage({
                'message': '毕业时间不能为空！',
                'type': 'error',
            })
            return
        } else if (schoolDsc == '') {
            Taro.atMessage({
                'message': '学校简介不能为空！',
                'type': 'error',
            })
            return
        }
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
                    Taro.navigateBack()
                    Taro.showToast({
                        title: '编辑成功！'
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
                    Taro.navigateBack()
                    Taro.showToast({
                        title: '新增成功！'
                    })
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
        const { records, record, schoolName, projectName, beginDate, overDate, address, schoolDsc, cardTitle } = this.state
        return (
            <View>
                <AtCard
                    title={cardTitle}>
                    <AtForm>
                        <AtInput
                            name='school'
                            border={false}
                            title='学校名称'
                            type='text'
                            placeholder='请输入学校名称'
                            value={schoolName}
                            onChange={(data) => this.changeSchoolName(data)}
                        />
                        <AtInput
                            name='school'
                            border={false}
                            title='专业名称'
                            type='text'
                            placeholder='请输出专业名称'
                            value={projectName}
                            onChange={(data) => this.changeProjectName(data)}
                        />
                        <View className='form-item'>
                            <View className='label'>学历</View>
                            <Picker mode='selector' range={records} onChange={this.onRecordsChange}>
                                <View className='content'>{record == -1 ? '请选择' : records[record]}</View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>入学时间</View>
                            <Picker mode='date' onChange={this.changeBeginDate}>
                                <View className='content'>
                                    {beginDate == '' ? '请选择入学时间' : beginDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>毕业时间</View>
                            <Picker mode='date' onChange={this.changeOverDate}>
                                <View className='content'>
                                    {overDate == '' ? '请选择毕业时间' : overDate}
                                </View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>学校地址</View>
                            <Text onClick={this.getLocation} >{address == '' ? '选择学校地址' : address}</Text>
                        </View>
                        <View className='form-item'>
                            <View className='label'>学校简介</View>
                            <View className='content'>
                                <AtTextarea value={schoolDsc} onChange={this.changeSchoolDsc} maxLength={200} placeholder='请输入学校简介' className='schoolDsc' />
                            </View>
                        </View>

                    </AtForm>
                    <AtButton onClick={this.addSchool} type="primary">提交</AtButton>
                </AtCard>
            </View>
        )
    }
}
