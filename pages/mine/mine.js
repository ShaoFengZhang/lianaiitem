import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()

Page({
    data: {
        bartype: 2,
    },

    onLoad: function () {
        
    },

    onShow: function () {
        this.setData({
            bartype: 2,
        })
    },

    onShareAppMessage: function () {
        return util.shareObj;
    },

    navMyQuesAndAns:function(){
        wx.navigateTo({
            url: '/pages/myQuestion/myQuestion',
        })
    },

})