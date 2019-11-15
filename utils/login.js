const domin = "https://duanju.58100.com"; //线上域名
const srcDomin = domin; //资源域名
const checkUserUrl = `${domin}/home/index/zixun_getuserinfo`;

let loginNum = 0;
let checkuserNum = 0;

// 登录promise
const loginUrl = function(app) {
    wx.login({
        success: res => {
            wx.request({
                url: `${domin}/home/index/zixun_dologin`,
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': '+json',
                },
                data: {
                    code: res.code
                },
                success: function(value) {
                    // console.log(value)
                    if (value.statusCode == 200 && value.data.status==1){
                        loginNum=0;
                        app.globalData.session_key = value.data.session_key;
                        wx.setStorageSync('u_open_id', value.data.openid);
                        wx.setStorageSync('u_id', value.data.uid);
                        wx.setStorageSync('is_new_user', value.data.newuser);
                        getSettingfnc(app);
                    }else{
                        if (resdata.statusCode == 404) {
                            console.log('loginsuccess')
                            return;
                        }
                        if (loginNum >= 2) { loginNum = 0; return}
                        loginNum++;
                        loginUrl(app);
                    }
                    
                },
                fail: function() {
                    if (loginNum >= 2) {
                        wx.showModal({
                            title: '提示',
                            content: '请求失败,请稍后再试',
                            showCancel: false,
                            success: function (res) {
                                loginNum = 0;
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        });
                        return
                    }
                    loginNum++;
                    loginUrl(app);
                },
            });
        }
    });

}

// requestURL封装
const requestUrl = (app, url, method, data, cb) => {
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': '+json',
        },
        data: data,
        method: method,
        success: function(resdata) {
            // console.log(url, '请求成功', resdata);
            if (resdata.statusCode == 200 && resdata.data.status == 1) {
                app.networkRequestsNum = 0;
                cb(resdata.data);
            }else{
                if (app.networkRequestsNum >= 2) {
                    wx.showModal({
                        title: '提示',
                        content: '请求失败,请稍后再试',
                        showCancel: false,
                        success: function (res) {
                            app.networkRequestsNum = 0;
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    }); 
                    return
                }else{
                    app.networkRequestsNum++;
                    console.log(app.networkRequestsNum)
                    requestUrl(app, url, method, data, cb);
                }
                
            }  
        },
        fail: function () {
            if (resdata.statusCode == 404) {
                console.log('fail')
                return;
            }
            if (app.networkRequestsNum >= 2) {
                wx.showModal({
                    title: '提示',
                    content: '请求失败,请稍后再试',
                    showCancel: false,
                    success: function (res) {
                        app.networkRequestsNum = 0;
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                });
                return
            }
            app.networkRequestsNum++;
            requestUrl(app, url, method, data, cb);
        },
    })
};

// 获取用户信息
const getSettingfnc = (app) => {
    wx.getSetting({
        success: res => {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                    lang: "zh_CN",
                    success: res => {
                        let iv = res.iv;
                        let encryptedData = res.encryptedData;
                        let session_key = app.globalData.session_key;
                        app.globalData.userInfo = res.userInfo;
                        checkUserInfo(app, res, iv, encryptedData, session_key);
                        if (app.userInfoReadyCallback) {
                            app.userInfoReadyCallback(res);
                        }
                    }
                })
            }
        }
    })
};

// 存储用户信息
const checkUserInfo = (app, res, iv, encryptedData, session_key, cb) => {
    if (wx.getStorageSync('rawData') != res.rawData) {
        wx.setStorage({
            key: "rawData",
            data: res.rawData
        })
        wx.request({
            url: checkUserUrl,
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': '+json',
            },
            data: {
                // rowData: res.rawData,
                // openid: wx.getStorageSync('u_open_id'),
                iv: iv,
                encryptedData: encryptedData,
                seesion_key: session_key,
                uid: wx.getStorageSync('u_id'),
            },
            success: function (value) {
                console.log(value)
                if (value.statusCode == 200 && value.data.status == 1) {
                    checkuserNum = 0;
                    if (cb) {
                        cb();
                    }
                } else {
                    if (resdata.statusCode == 404) {
                        console.log('checkUserInfo')
                        return;
                    }
                    if (checkuserNum >= 2) {
                        wx.showModal({
                            title: '提示',
                            content: '请求失败,请稍后再试',
                            showCancel: false,
                            success: function (res) {
                                checkuserNum = 0;
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        });
                        return
                    }
                    checkuserNum++;
                    loginUrl(app);
                }

            },
            fail: function () {
                if (checkuserNum >= 2) {
                    
                    wx.showModal({
                        title: '提示',
                        content: '请求失败,请稍后再试',
                        showCancel: false,
                        success: function (res) {
                            checkuserNum = 0;
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    });
                    return
                }
                checkuserNum++;
                loginUrl(app);
            },
        });
    }
};

module.exports = {
    domin: domin,
    wxlogin: loginUrl,
    requestUrl: requestUrl,
    srcDomin: srcDomin,
    checkUserInfo: checkUserInfo,
};