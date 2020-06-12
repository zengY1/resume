import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Canvas } from '@tarojs/components'
import './index.scss'
import { AtButton } from 'taro-ui'
const httpUtil = require('../../utils/httpUtil')
interface IProps {

}
interface Istate {
    userInfo?: any,
    getUserInfo?: any,
    modalVisible?: boolean,
    userList?: any[],
    mobile?: number | undefined,
    codeImgUrl?: any,
    files?: any,
    imageTempPath?: any,
    imgUrl?: any,
    canvas?: any,
    cardInfo?: any,
    tip?: string
}
export default class ResumeCard extends Component<IProps, Istate> {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            mobile: undefined,
            codeImgUrl: '',
            files: [],
            imageTempPath: '',
            imgUrl: '',
            canvas: '',
            cardInfo: {},
            tip: ''
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
        navigationBarTitleText: '简历名片'
    }

    componentWillMount() {
        this.getUserInfo()
        this.getCodeImage()
        this.getOneTip()
    }

    componentDidShow() {
    }
    // 爬虫获取tip
    getOneTip = () => {
        const that = this
        httpUtil.request({
            url: '/wx/desc',
            method: 'GET',
            success(res) {
                that.setState({
                    tip: res.oneTips
                })
                that.drawBall(res.oneTips)
            }
        })
    }
    // 获取当前的用户信息
    getUserInfo = () => {
        const that = this
        httpUtil.request({
            url: '/info/get',
            method: 'GET',
            success(res) {
                that.setState({
                    cardInfo: {
                        name: res.data.realName,
                        mobile: res.data.mobile,
                        email: res.data.email,
                        post: res.data.province
                    },
                })
            }
        })
    }
    // 获取二维码图片
    getCodeImage = () => {
        const that = this
        httpUtil.request({
            url: '/wx/code',
            success(res) {
                const codeImg = res
                that.setState({
                    codeImgUrl: codeImg
                })
            }
        })
    }
    // canvas绘制
    drawBall(tip) {
        const query = Taro.createSelectorQuery()
        const that = this
        query.select('#mycanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
                that.testDraw(res, tip)
            })

    }
    testDraw = (res, tip) => {
        const { codeImgUrl, cardInfo } = this.state
        const name = cardInfo.name
        const post = cardInfo.post
        const mobile = cardInfo.mobile
        const email = cardInfo.email
        const dscArr = tip.split('')
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const device = Taro.getSystemInfoSync()
        const windowWidth = device.windowWidth
        const dpx = device.pixelRatio
        const dpr = windowWidth / 375
        const ctxW = res[0].width * dpx
        const ctxH = res[0].height * dpx
        canvas.width = ctxW
        canvas.height = ctxH
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, ctxW, ctxH)
        ctx.scale(dpx, dpx)
        ctx.save()
        ctx.fillStyle = 'black'
        ctx.font = '30px sans-serif'
        ctx.fillText(name, 100 * dpr, 60)
        ctx.save()
        const img2 = canvas.createImage()
        img2.src = 'https://wx-resume.oss-cn-hangzhou.aliyuncs.com/codeImg/resume-model.jpg'
        img2.onload = () => {
            ctx.restore()
            ctx.drawImage(img2, 0, 80, 300, 200)
            ctx.fillStyle = 'black'
            ctx.font = '15px sans-serif'
            ctx.fillText(post, 77 * dpr, 120)
            ctx.fillText(mobile, 77 * dpr, 190)
            ctx.fillText(email, 77 * dpr, 255)
            ctx.save()
        }
        const img = canvas.createImage()
        img.src = codeImgUrl
        img.onload = () => {
            ctx.restore()
            ctx.drawImage(img, 110 * dpr, 310, 80, 80);
            ctx.strokeStyle = "black";
            ctx.strokeRect(110 * dpr, 310, 81, 81)
            ctx.font = '12px sans-serif'
            ctx.fillStyle = 'rgba(7,17,27,0.7)'
            ctx.fillText('查看我的简历', 112 * dpr, 411)
            ctx.save()
            ctx.restore()
            ctx.strokeStyle = 'rgba(7,17,27,1)'
            ctx.moveTo(0 * dpr, 420)
            ctx.lineTo(ctxW * dpr, 420)
            ctx.stroke()
            var h0 = 0
            for (var i = 0; i <= Math.ceil(dscArr.length / 15) + 1; i++) {
                if (dscArr.length > 15) {
                    if (i === 0) {
                        ctx.font = '13px sans-serif'
                        ctx.fillStyle = 'black'
                        const newDsc = dscArr.splice(0, 13)
                        ctx.fillText(newDsc.join(''), 80 * dpr, 440)
                    } else {
                        const newDsc = dscArr.splice(0, 15)
                        ctx.fillText(newDsc.join(''), 55 * dpr, 440 + h0)
                    }
                    h0 += 15
                } else {
                    if (i === 0) {
                        ctx.font = '13px sans-serif'
                        ctx.fillStyle = 'black'
                        ctx.fillText(dscArr.join(''), 80 * dpr, 440 + h0)
                    } else {
                        ctx.fillText(dscArr.join(''), 55 * dpr, 440 + h0)
                    }
                }
            }

        }
        this.setState({ canvas: canvas })
    }

    saveImg = () => {
        const { canvas } = this.state
        const that = this
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            destHeight: canvas.height,
            destWidth: canvas.width,
            canvas: canvas,
            success(res) {
                that.setState({
                    imageTempPath: res.tempFilePath
                })
            }
        })
        Taro.getSetting({
            success(res) {
                if (!res.authSetting['secope.writePhotosAlbum']) {
                    Taro.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            Taro.saveImageToPhotosAlbum({
                                filePath: that.state.imageTempPath,
                                success() {
                                    Taro.showModal({
                                        title: '保存成功！'
                                    })
                                }
                            })
                        }
                    })
                } else {
                    Taro.saveImageToPhotosAlbum({
                        filePath: that.state.imageTempPath,
                        success() {
                            Taro.showModal({
                                title: '保存成功！'
                            })
                        }
                    })
                }
            }
        })

    }
    render() {
        const { cardInfo, codeImgUrl, tip } = this.state
        return (
            <View className='resume-card'>
                <View>
                    <View className='resume-canvas'>
                        <View className='card-name'>{cardInfo.name}</View>
                        <View className='card-main'>
                            <View className='main-info'>
                                <View className='main-post'>{cardInfo.post}</View>
                                <View className='main-mobile'>{cardInfo.mobile}</View>
                                <View className='main-email'>{cardInfo.email}</View>
                            </View>
                        </View>
                        <View className='card-code'>
                            <View className='card-code-img'>
                                <Image src={codeImgUrl} style='width:160rpx;height:160rpx;' />
                            </View>
                            <View className='card-code-title'>查看我的简历</View>
                        </View>
                        <View className='card-line'>
                        </View>
                        <View className='card-bottom-text'>
                            {tip}
                        </View>
                        <Canvas
                            id='mycanvas'
                            type='2d'
                            style='width:300px; height:500px;background:rgba(0,0,0,.5);position:fixed;top:-10000px'
                        />
                    </View>
                </View>
                <View className='card-btn'>
                    <AtButton
                        onClick={this.saveImg}
                        type='primary'
                        circle
                    >
                        保存到手机
                    </AtButton>
                </View>
            </View>
        )
    }
}
