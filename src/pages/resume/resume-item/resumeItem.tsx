import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Map } from '@tarojs/components'
import './index.scss'
import { AtButton, AtCard, AtInput, AtForm, AtRadio } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    latitude: number,
    longitude: number,
    address: string,
    markers?: any,
    controls?:any

}
export default class ResumeItem extends Component<IProps, Istate> {
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
        }
    }
    config: Config = {
        navigationBarTitleText: '详情'
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
    render() {
        const { address, longitude, latitude,markers } = this.state
        return (
            <View>
                <Map markers={markers} onClick={this.onTap} longitude={longitude} latitude={latitude} scale={14} showLocation={true} subkey="SLSBZ-MRXKQ-LLW5C-GPCGS-BY7US-7XFN7" />
                
            </View>
        )
    }
}
