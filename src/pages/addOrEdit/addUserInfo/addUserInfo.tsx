import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    userInfo?: any,
    getUserInfo?: any,
    modalVisible?: boolean,
    userList?: any[],
    mobile?: number | undefined,
    realName?: string,
    sex?: string,
    birthday: string,
    provice: string,
    city: string,
    price: string,
    resumeInfo?: any,
    cardTitle?: string,
    selector?: any,
    buttonType?: string,
    editId?: number
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
            price: '',
            resumeInfo: {},
            cardTitle: '新增',
            selector: ['男', '女'],
            buttonType: 'add',
            editId: 0
        }
    }
    componentDidMount() {
        console.log(this.$router.params)
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
                    price: resumeInfo.salary,
                    buttonType: buttonType,
                    editId: resumeInfo.id,
                    cardTitle: '编辑'
                })
            }
        })
    }
    onSubmit = () => {
        const { mobile, realName, sex, birthday, provice, city, price } = this.state
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
                salary: price
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
    changePrice = (data) => {
        this.setState({ price: data })
    }
    changeCity = (data) => {
        this.setState({ city: data })
    }
    changeProvice = (data) => {
        this.setState({ provice: data })
    }

    render() {
        const { mobile, realName, sex, birthday, provice, city, price, resumeInfo, cardTitle, selector, origoArr } = this.state
        return (
            <View>
                <AtCard
                    title={cardTitle}
                >
                    <AtForm>
                        <AtInput
                            name='realName'
                            border={false}
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
                            border={false}
                            title='手机号码'
                            type='phone'
                            placeholder='手机号码'
                            value={mobile}
                            onChange={(data) => this.changeMobile(data)}
                        />
                        <AtInput
                            name='provice'
                            border={false}
                            title='户籍省'
                            type='text'
                            placeholder='户籍省'
                            value={provice}
                            onChange={(data) => this.changeProvice(data)}
                        />
                        <AtInput
                            name='city'
                            border={false}
                            title='户籍市'
                            type='text'
                            placeholder='户籍市'
                            value={city}
                            onChange={(data) => this.changeCity(data)}
                        />
                        <AtInput
                            name='price'
                            border={false}
                            title='期望薪资'
                            type='text'
                            placeholder='价格'
                            value={price}
                            onChange={(data) => this.changePrice(data)}
                        />
                    </AtForm>

                    <AtButton onClick={this.onSubmit} type="primary">确认</AtButton>
                </AtCard>
            </View>
        )
    }
}
