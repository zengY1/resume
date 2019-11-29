import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio,AtTextarea } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
    latitude: number,
    longitude: number,
    address: string,
    markers?: any,
    controls?:any,
    companyDsc?:any

}
export default class MapTest extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            address: '',
            markers:[{
                id:1,
                longitude:118.73145,
                latitude:32.00335,
                title:'泽坤科技',
                iconPath:'https://elingou.oss-cn-hangzhou.aliyuncs.com/img/wx/index1.png',
                width:50,
                height:50
              }],
              companyDsc:''
        }
    }
    config: Config = {
        navigationBarTitleText: '地图'
    }
    componentDidMount() {
        const that = this
        Taro.getLocation({
            success(res) {
                console.log('res',res)
                that.setState({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            }
        })
    }
    onTap = (e) => {
        console.log(e)
    }
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
    changeCompanyDsc=()=>{
        console.log('text')
    }
    render() {
        const { address, longitude, latitude,markers ,companyDsc} = this.state
        return (
            <View>
                <Map markers={markers} onClick={this.onTap} longitude={longitude} latitude={latitude} scale={14} showLocation={true} subkey="SLSBZ-MRXKQ-LLW5C-GPCGS-BY7US-7XFN7" />

                <AtButton onClick={this.getLocation}>获取位置</AtButton>
                <View>地址：{address}</View>
                <AtTextarea value={companyDsc} onChange={this.changeCompanyDsc} maxLength={200} placeholder='公司的简单介绍'/>
                        
            </View>
        )
    }
}
