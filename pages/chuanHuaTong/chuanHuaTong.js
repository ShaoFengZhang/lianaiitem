import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()
Page({

    data: {
        userNickName:'',
        userMessage:'',
    },

    onLoad: function(options) {
        this.userNickName='';
        this.userMessage='';
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function() {

    },

    inputBindInput:function(e){
        console.log(e.detail.value);
        this.userNickName = e.detail.value;
        
    },

    inputBindBlur:function(){
        this.setData({
            userNickName: this.userNickName
        });
    },

    textBindInput:function(e){
        console.log(e.detail.value);
        this.userMessage = e.detail.value;
        this.setData({
            userMessage: e.detail.value
        })
    },

    textBindBlur: function () {
        this.setData({
            userMessage: this.userMessage
        });
    },

    // 检查文字
    judgeTextFunc:function(){
        if (!util.check(this.data.userNickName) || !util.check(this.data.userMessage)) {
            util.toast("请输入有效内容", 1200)
            return;
        };

        this.navQrCode();
    },

    //获取用户头像信息
    onGotUserInfo: function(e) {
        if (!e.detail.userInfo) {
            util.toast("我们需要您的授权哦亲~", 1200)
            return
        }
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let session_key = app.globalData.session_key;
        loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key)
        this.judgeTextFunc();
    },

    // 收集formid
    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

    catchtap:function(){},

    navQrCode: function() {
        wx.navigateTo({
            url: '/pages/qrCode/qrCode',
        })
    },
})