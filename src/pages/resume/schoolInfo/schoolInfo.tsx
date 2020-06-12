import Taro, { Component} from '@tarojs/taro'
import { View, Text, Map } from '@tarojs/components'
import './index.scss'
import { records } from '../../../utils/static'
import { AtTabs, AtTabsPane } from 'taro-ui'
const httpUtil = require('../../../utils/httpUtil')
interface IProps {

}
interface Istate {
    latitude: number,
    longitude: number,
    address: string,
    markers?: any,
    timeLine?: any,
    companyName?: string,
    postName?: string,
    record?: string,
    beginDate?: string,
    overDate?: string,
    timeLineArr?: any,
    cid?: any,
    current: number,
    schoolDsc?: string,
    itemArr?: any,
    tabList?: any,

}
export default class SchoolInfo extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            address: '',
            companyName: '',
            postName: '',
            record: '',
            beginDate: '',
            overDate: '',
            timeLineArr: [],
            cid: '',
            markers: [],
            current: 0,
            schoolDsc: '',
            itemArr: [],
            tabList: [{ title: '学校简介' }],
        }
    }
    componentDidShow() {
        const params = this.$router.params
        const sid = params.sid
        if (sid) {
            this.getCompanyInfoByCid(sid)

        }
    }
    // 公司的详情
    getCompanyInfoByCid = (sid) => {
        const that = this
        httpUtil.request({
            url: '/school/schoolBySid',
            data: { sid: sid },
            success(res) {
                Taro.setNavigationBarTitle({
                    title: res.data.schoolName
                })
                that.setState({
                    cid: sid,
                    address: res.data.address,
                    longitude: res.data.longitude,
                    latitude: res.data.latitude,
                    companyName: res.data.schoolName,
                    postName: res.data.projectName,
                    record: res.data.record,
                    beginDate: res.data.schoolBeginDate,
                    overDate: res.data.schoolOverDate,
                    schoolDsc: res.data.schoolDsc,
                    markers: [{
                        id: 1,
                        longitude: res.data.longitude,
                        latitude: res.data.latitude,
                        title: res.data.schoolName,
                        iconPath: '',
                        width: 50,
                        height: 50,
                        label: {
                            content: res.data.schoolName,
                            color: '#000',
                            display: 'ALWAYS',
                            textAlign: 'center',
                            padding: 2,
                            bgColor: '#fff'
                        }
                    }],
                })
            }
        })
    }

    tabChange = (data) => {
        this.setState({
            current: data
        })
    }
    // go here
    locationGoHere = () => {
        const { longitude, latitude } = this.state
        const lat = Number(latitude)
        const log = Number(longitude)
        Taro.openLocation({
            latitude: lat,
            longitude: log,
            scale: 18
        })
    }
    render() {
        const { itemArr, schoolDsc, current, tabList, longitude, latitude, companyName, postName, record, beginDate, overDate, timeLineArr, markers, address } = this.state

        return (
            <View>
                <View className='company-info'>
                    <Map markers={markers} longitude={longitude} latitude={latitude} scale={15} showLocation={true} subkey="SLSBZ-MRXKQ-LLW5C-GPCGS-BY7US-7XFN7" style="width: 100%;" />
                    <AtTabs current={current} onClick={(data) => this.tabChange(data)} tabList={tabList} scroll>
                        <AtTabsPane current={current} index={0} >
                            <View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>学校名称：</Text></View>
                                    <View className='infoContent'><Text>{companyName}</Text></View>
                                </View>
                                {postName == '' ? '' : <View className='infoItem'>
                                    <View className='infoLabel'><Text>专业名称：</Text></View>
                                    <View className='infoContent'><Text>{postName}</Text></View>
                                </View>}

                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>学历：</Text></View>
                                    <View className='infoContent'><Text>{records[record]}</Text></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>学校地址：</Text></View>
                                    <View className='infoContent'><View>{address}<Text className='goHere' onClick={this.locationGoHere}>去这里</Text></View></View>
                                </View>
                                <View className='infoItem'>
                                    <View className='infoLabel'><Text>在职时间：</Text></View>
                                    <View className='infoContent'><Text>{beginDate}至{overDate}</Text></View>
                                </View>
                                {schoolDsc == '' ? '' : <View className='infoItem'>
                                    <View className='infoLabel'><Text>学校简介：</Text></View>
                                    <View className='infoContent'><Text>{schoolDsc}</Text></View>
                                </View>
                                }

                            </View>
                        </AtTabsPane>
                        {
                            itemArr ? itemArr.map((item, index) => {
                                return (
                                    <AtTabsPane current={current} index={index + 1} key={item.id}>
                                        {/* 修改和删除项目经验 */}
                                        {/* <AtTag type='primary' size='small' active={true} circle onClick={() => this.editItem(item)}>编辑</AtTag>
                                        <AtTag size='small' active={true} circle onClick={() => this.deleteItem(item)}>删除</AtTag> */}
                                        <View className='infoItem'>
                                            <View className='infoLabel'><Text>项目名称：</Text></View>
                                            <View className='infoContent'><Text>{item.itemName}</Text></View>
                                        </View>
                                        <View className='infoItem'>
                                            <View className='infoLabel'><Text>项目时间：</Text></View>
                                            <View className='infoContent'><Text>{item.itemBeginDate}至{item.itemOverDate}</Text></View>
                                        </View>
                                        <View className='infoItem'>
                                            <View className='infoLabel'><Text>职位：</Text></View>
                                            <View className='infoContent'><Text>{item.postName}</Text></View>
                                        </View>
                                        <View className='infoItem'>
                                            <View className='infoLabel'><Text>项目描述：</Text></View>
                                            <View className='infoContent'><Text>{item.itemDsc}</Text></View>
                                        </View>
                                        <View className='infoItem'>
                                            <View className='infoLabel'><Text>我的分工：</Text></View>
                                            <View className='infoContent'><Text>{item.myDivision}</Text></View>
                                        </View>
                                    </AtTabsPane>
                                )
                            }) : ''
                        }
                    </AtTabs>
                </View>
            </View>
        )
    }
}
