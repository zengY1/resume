import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
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
    birthday:string,
    provice:string,
    city:string,
    price:string,
    resumeInfo?:any
}
export default class User extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            mobile: undefined,
            realName: '',
            sex: '',
            birthday:'',
            provice:'',
            city:'',
            price:'',
            resumeInfo:{}

        }
    }
    config: Config = {
        navigationBarTitleText: '首页'
    }
    onSubmit = () => {
        const {  mobile, realName, sex,birthday,provice,city,price } = this.state
        httpUtil.request({
            url:'/info/edit',
            method:'POST',
            data:{
                mobile,
                realName,
                sex,
                birthday,
                province:provice,
                city,
                salary:price
            },
            success(res){
                console.log('edit',res)
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
        this.setState({ sex: data })
    }
    changeDate = (data) => {
        this.setState({birthday:data.detail.value})
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
    // 获取当前的resume信息
    getResumeInfo=()=>{
        const that=this
        httpUtil.request({
            url:'/info/get',
            method:'GET',
            success(res){
                console.log(res)
                that.setState({
                    resumeInfo:res.data
                })
            }
        })
    }
    render() {
        const {  mobile, realName, sex,birthday,provice,city,price,resumeInfo } = this.state
        return (
            <View>
                <AtCard
                    title='新增、修改Resume信息-post'
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
                        <AtRadio
                            options={[
                                { label: '男', value: '男' },
                                { label: '女', value: '女' }
                            ]}
                            value={sex}
                            onClick={this.changeSex}
                        />
                        <View>出生日期：
                            <Picker mode='date' onChange={this.changeDate}>
                                <View>
                                    当前选择：{birthday}
                                </View>
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
                            title='省'
                            type='text'
                            placeholder='省'
                            value={provice}
                            onChange={(data) => this.changeProvice(data)}
                        />
                        <AtInput
                            name='city'
                            border={false}
                            title='城市'
                            type='text'
                            placeholder='城市'
                            value={city}
                            onChange={(data) => this.changeCity(data)}
                        />
                        <AtInput
                            name='price'
                            border={false}
                            title='价格'
                            type='text'
                            placeholder='价格'
                            value={price}
                            onChange={(data) => this.changePrice(data)}
                        />
                    </AtForm>

                    <AtButton onClick={this.onSubmit} type="primary">确认</AtButton>
                </AtCard>
                <View className='item'>
                    <AtCard
                     title='获取当前Resume的信息-get'>
                         <AtButton onClick={this.getResumeInfo}>resume信息</AtButton>
                        <View>
                            <View>姓名：{resumeInfo.realName}</View>
                            <View>性别：{resumeInfo.sex}</View>
                            <View>生日：{resumeInfo.birthday}</View>
                            <View>地址：{resumeInfo.province}-{resumeInfo.city}</View>
                            <View>价格：{resumeInfo.salary}</View>
                            <View>联系方式：{resumeInfo.mobile}</View>
                        </View>
                    </AtCard>
                </View>
            </View>
        )
    }
}
