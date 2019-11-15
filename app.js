import loginApi from './utils/login.js';
// const ald = require('./utils/ald-stat.js');

App({
    onLaunch: function() {
        let _this = this;
 
        this.networkRequestsNum = 0;
        
        // 获取系统信息
        wx.getSystemInfo({
            success(res) {
                _this.pixelRatio = res.pixelRatio;
                _this.windowHeight = res.windowHeight;
                _this.windowwidth = res.windowWidth;
                if (res.system.slice(0, 3) != 'iOS') {
                    _this.globalData.isIosPhone=0;
                }
            }
        });

        loginApi.wxlogin(this);

    },

    onShow: function() {


        // 强制更新
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function(res) {
            // console.log(res.hasUpdate)
            if (res.hasUpdate) {
                wx.showLoading({
                    title: '更新下载中...',
                })
            }
        })

        updateManager.onUpdateReady(function() {
            wx.hideLoading();
            wx.showModal({
                title: '更新提示',
                content: '版本更新啦，立即试用~',
                showCancel: false,
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        });

    },

    globalData: {
        userInfo: null,
        isIosPhone:1,
    },

})