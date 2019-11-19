import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {

    },

    onLoad: function (options) {

    },

    onShow: function () {

    },

    onShareAppMessage: function () {

    },

    //生成二维码
    generateQrCode: function () {
        let _this = this;
        let url = loginApi.domin + '/home/index/chuanhuatong';
        loginApi.requestUrl(app, url, "POST", {
            'uid': wx.getStorageSync('u_id'),
            'name': '',
            'bname': '',
            'text': '',
        }, function (res) {
            _this.setData({

            })
        })
    },
    
})