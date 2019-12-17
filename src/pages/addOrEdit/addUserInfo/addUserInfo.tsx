import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio, AtMessage } from 'taro-ui'
import {salaryArr} from '../../../utils/static'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    userInfo?: any,
    getUserInfo?: any,
    modalVisible?: boolean,
    userList?: any[],
    mobile?: string,
    realName?: string,
    sex?: string,
    birthday: string,
    provice: string,
    city: string,
    resumeInfo?: any,
    cardTitle?: string,
    selector?: any,
    buttonType?: string,
    editId?: number,
    address?: string,
    salary?: string,
    salaryColumn?: any
}
export default class AddUserInfo extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            mobile: undefined,
            realName: '',
            sex: '',
            birthday: '',
            provice: '',
            city: '',
            salary: '',
            resumeInfo: {},
            cardTitle: '新增',
            selector: ['男', '女'],
            buttonType: 'add',
            editId: 0,
            address: '',
            salaryColumn: [[], []]
        }
    }
    componentDidMount() {
        console.log(this.$router.params)
        const salaryColumn = [salaryArr, salaryArr]
        this.setState({
            salaryColumn
        })
        const infoId = this.$router.params.id
        if (infoId) {
            this.getResumeInfoById(infoId)
            Taro.setNavigationBarTitle({
                title: '编辑个人信息'
            })
        } else {
            Taro.setNavigationBarTitle({
                title: '新增个人信息'
            })
        }

    }
    // 编辑的回显
    getResumeInfoById = (id) => {
        const that = this
        httpUtil.request({
            url: '/info/get/byId',
            method: 'GET',
            data: {
                id: id
            },
            success(res) {
                console.log(res)
                const buttonType = res.data ? 'edit' : 'add'
                const resumeInfo = res.data
                that.setState({
                    mobile: resumeInfo.mobile,
                    realName: resumeInfo.realName,
                    sex: resumeInfo.sex,
                    birthday: resumeInfo.birthday,
                    provice: resumeInfo.province,
                    city: resumeInfo.city,
                    salary: resumeInfo.salary,
                    buttonType: buttonType,
                    editId: resumeInfo.id,
                    cardTitle: '编辑',
                    address: resumeInfo.address
                })
            }
        })
    }
    // 提交
    onSubmit = () => {
        const { mobile, realName, sex, birthday, provice, city, salary, address } = this.state
        if (mobile == '') {
            Taro.atMessage({
                'message': '联系方式不能为空！',
                'type': 'error',
            })
            return
        } else if (realName == '') {
            Taro.atMessage({
                'message': '姓名不能为空！',
                'type': 'error',
            })
            return
        } else if (sex == '') {
            Taro.atMessage({
                'message': '性别不能为空！',
                'type': 'error',
            })
            return
        } else if (birthday == '') {
            Taro.atMessage({
                'message': '出生日期不能为空！',
                'type': 'error',
            })
            return
        } else if (provice == '') {
            Taro.atMessage({
                'message': '应聘岗位不能为空！',
                'type': 'error',
            })
            return
        } else if (city == '') {
            Taro.atMessage({
                'message': '工作城市不能为空！',
                'type': 'error',
            })
            return
        } else if (salary == '') {
            Taro.atMessage({
                'message': '期望薪资不能为空！',
                'type': 'error',
            })
            return
        }
        httpUtil.request({
            url: '/info/edit',
            method: 'POST',
            data: {
                mobile,
                realName,
                sex,
                birthday,
                province: provice,
                city,
                salary: salary,
                address
            },
            success(res) {
                if (res.code === '00000') {
                    Taro.navigateBack()
                    Taro.showToast({
                        title: '操作成功！'
                    })
                }
                console.log('edit', res)
            }
        })
    }
    changeRealName = (data) => {
        this.setState({ realName: data })
    }
    changeMobile = (data) => {
        this.setState({ mobile: data })
    }
    changeSex = (data) => {
        this.setState({ sex: data.detail.value })
    }
    changeDate = (data) => {
        this.setState({ birthday: data.detail.value })
    }
    changeCity = (data) => {
        this.setState({ city: data })
    }
    changeProvice = (data) => {
        this.setState({ provice: data })
    }
    changeAddress = (data) => {
        this.setState({ address: data })
    }
    changeSalary = (data) => {
        const salary = data.detail.value
        const firstIndex = salary[0]
        const lastIndex = salary[1] + salary[0]
        if (firstIndex === lastIndex || firstIndex === lastIndex) {
            this.setState({
                salary: salaryArr[firstIndex]
            })
        } else {
            this.setState({
                salary: salaryArr[firstIndex] + '~' + salaryArr[lastIndex]
            })
        }
        console.log('salary', salary)
    }
    salaryColumnChange = (data) => {
        const column = data.detail.column
        const value = data.detail.value
        const newArr = salaryArr.slice(value, salaryArr.length)
        if (column == 0) {
            this.setState({
                salaryColumn: [salaryArr, newArr]
            })
        }

    }
    render() {
        const { mobile, realName, sex, birthday, provice, city, resumeInfo, cardTitle, selector, address, salaryColumn, salary } = this.state
        return (
            <View>
                <AtMessage />
                <AtCard
                    title={cardTitle}
                >
                    <AtForm>
                        <AtInput
                            name='realName'
                            border={true}
                            title='姓名'
                            type='text'
                            placeholder='姓名'
                            value={realName}
                            onChange={(data) => this.changeRealName(data)}
                        />

                        <View className='form-item'>
                            <View className='label'>性别</View>
                            <Picker mode='selector' onChange={this.changeSex} range={selector}>
                                <View className='content'>{sex ? selector[sex] : '请选择'}</View>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <View className='label'>出生日期</View>
                            <Picker mode='date' onChange={this.changeDate}>
                                <View className='content'>{birthday ? birthday : '请选择'}</View>
                            </Picker>
                        </View>
                        <AtInput
                            name='mobile'
                            border={true}
                            title='联系方式'
                            type='phone'
                            placeholder='联系方式'
                            value={mobile}
                            onChange={(data) => this.changeMobile(data)}
                        />
                        <AtInput
                            name='address'
                            border={true}
                            title='居住地址'
                            type='text'
                            placeholder='居住地址'
                            value={address}
                            onChange={(data) => this.changeAddress(data)}
                        />
                        <AtInput
                            name='provice'
                            border={true}
                            title='应聘岗位'
                            type='text'
                            placeholder='应聘岗位'
                            value={provice}
                            onChange={(data) => this.changeProvice(data)}
                        />
                        <AtInput
                            name='city'
                            border={true}
                            title='工作城市'
                            type='text'
                            placeholder='工作城市'
                            value={city}
                            onChange={(data) => this.changeCity(data)}
                        />
                        <View className='form-item'>
                            <View className='label'>期望薪资</View>
                            <Picker mode='multiSelector' range={salaryColumn} onChange={this.changeSalary} onColumnChange={this.salaryColumnChange} value={[0, 0]}>
                                <View className='content'>{salary ? salary : '请选择'}</View>
                            </Picker>
                        </View>
                    </AtForm>

                    <AtButton onClick={this.onSubmit} type="primary">确认</AtButton>
                </AtCard>
            </View>
        )
    }
}
