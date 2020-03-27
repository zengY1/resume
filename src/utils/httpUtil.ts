import Taro from '@tarojs/taro'
const baseUrl = 'https://wx.znike.top'
// const baseUrl = 'http://localhost:9090'

function request(resquestHeader) {
    const accessToken = Taro.getStorageSync('token')
    const data = resquestHeader.data
    const url = baseUrl + resquestHeader.url
    console.log('url', url)
    Taro.request({
        url,
        data,
        method: resquestHeader.method || 'GET',
        header: {
            'Authorization': accessToken || ''
        },
        success: function (res) {
            if (res.data.code == '40001') {
                const tag = Taro.getStorageSync('tag')
                if (tag != 1) {
                    Taro.showModal({
                        title: '未登陆',
                        content: '请登陆',
                        success(resd) {
                            if (resd.confirm) {
                                Taro.reLaunch({
                                    url: '/pages/index/index?tab=2'
                                })
                                Taro.setStorageSync('tag', 1)
                            }
                            else {

                            }
                        }
                    })
                }else{
                   
                }
            }
            else if (res.data.code == '40003') {
                Taro.showModal({
                    title: '登陆已过期',
                    content: '请重新登陆',
                    success(resd) {
                        if (resd.confirm) {
                            Taro.clearStorage()
                            Taro.reLaunch({
                                url: '/pages/index/index?tab=2'
                            })
                            Taro.setStorageSync('tag', 1)
                        }
                        else {

                        }
                    }
                })
            } else {
                resquestHeader.success(res.data)
            }
        },
        fail: function (res) {
            Taro.showToast({
                title: res.data.msg,
                duration: 500,
                icon: 'none'
            })
        }
    })

}

module.exports = { request }