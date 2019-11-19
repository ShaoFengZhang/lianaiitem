import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
import MD5 from '../../utils/md5.js'
const app = getApp();
Page({

    data: {
        advisoryIfShow: false,
        commentArr: [],
        questionStr: '',
        commentsNum:0,
        commentHaveload:0,
        isios:1,
    },

    onLoad: function (options) {
        let _this = this;
        _this.setData({
            topViewHeight: app.windowHeight - 50,
        });
        this.commentxt = '';

        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        if (options && options.expert_id){
            this.expert_id = options.expert_id;
            this.loadExpertDetails();
            this.loadCommentNums();
        };

        wx.getSystemInfo({
            success(res) {
                if (res.system.slice(0, 3) != 'iOS') {
                    _this.setData({
                        isios: 0,
                    });
                }
            }
        });
        
    },

    onShow: function () {

    },

    catchtap: function () { },

    //分享
    onShareAppMessage: function () {

    },

    //加载提问题页面
    showAdvisoryView: function () {
        this.setData({
            advisoryIfShow: !this.data.advisoryIfShow,
        })
    },

    // 加载下一页
    nextpage: function () {
        if (this.cangetData) {
            this.page++;
            this.loadComment();
        } else {
            util.toast('没有更多数据了')
        }
    },

    //输入框输入时触发
    bindinput: function (e) {
        console.log(e);
        let content = e.detail.value;
        this.commentxt = content;
    },

    //输入框失去焦点
    bindblur: function () {
        // console.log(this.commentxt)
        this.setData({
            questionStr: this.commentxt,
        })
    },

    //加载专家详情
    loadExpertDetails: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/expert_detail';
        loginApi.requestUrl(app, url, "POST", {
            id:this.expert_id,
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    helpNum: res.list.times,
                    expert_id: res.list.id,
                    expertDes: res.list.label,
                    expertIcon: 'http://duanju.58100.com/qinggan/Uploads/' + res.list.icon,
                    price:res.list.price
                });
                _this.loadComment();
            }
        })
    },

    //加载评论
    loadComment: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/expert_evaluate';
        loginApi.requestUrl(app, url, "POST", {
            page: this.page,
            len: this.rows,
            expert_id: this.data.expert_id,
        }, function (res) {
            if (res.status == 1) {
                if (res.evaluate.length < _this.rows) {
                    _this.cangetData = false;
                }
                _this.setData({
                    commentArr: _this.data.commentArr.concat(res.evaluate),
                    commentHaveload:1,
                });
            }
        })
    },

    //获取评论数
    loadCommentNums: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/count_evaluate';
        loginApi.requestUrl(app, url, "POST", {
            expert_id: this.expert_id,
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    commentsNum:res.count
                });
            }
        })
    },

    //立即支付按钮
    lijizhifu: function () {
        if (!util.check(this.commentxt)) {
            util.toast("请输入有效内容~", 1200)
            return;
        };
        this.unitedPayRequest("恋爱咨询", parseInt(this.data.price))
        // this.unitedPayRequest("恋爱咨询", 0.01)
    },

    /*统一支付接口*/
    unitedPayRequest: function (bodyname, price) {
        var _this = this;
        //统一支付签名
        var openid = wx.getStorageSync("u_open_id");
        var appid = 'wx2df1a3c252717e21'; //appid必填
        var body = bodyname; //商品名必填
        var mch_id = '1542149431'; //商户号必填
        var nonce_str = util.randomString(); //随机字符串，不长于32位。  
        var notify_url = 'https://duanju.58100.com/home/index/yibu'; //通知地址必填
        var total_fee = parseInt(price * 100); //价格
        var trade_type = "JSAPI";
        var key = '45b3OoEhyk4vxqbPGxGJHjbYNOozXH6N'; //商户key必填，在商户后台获得
        var out_trade_no = wx.getStorageSync("u_id") + util.createTimeStamp(); //自定义订单号必填

        var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key;
        console.log("unifiedPayment", unifiedPayment);
        var sign = MD5.md5(unifiedPayment).toUpperCase();
        console.log("签名md5", sign);

        //封装统一支付xml参数
        var formData = "<xml>";
        formData += "<appid>" + appid + "</appid>";
        formData += "<body>" + body + "</body>";
        formData += "<mch_id>" + mch_id + "</mch_id>";
        formData += "<nonce_str>" + nonce_str + "</nonce_str>";
        formData += "<notify_url>" + notify_url + "</notify_url>";
        formData += "<openid>" + openid + "</openid>";
        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>" + trade_type + "</trade_type>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";
        console.log("formData", formData);
        //统一支付
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //别忘了把api.mch.weixin.qq.com域名加入小程序request白名单，这个目前可以加
            method: 'POST',
            head: 'application/x-www-form-urlencoded',
            data: formData, //设置请求的 header
            success: function (res) {
                console.log("返回商户", res.data);
                var result_code = util.getXMLNodeValue('result_code', res.data.toString("utf-8"));
                var resultCode = result_code.split('[')[2].split(']')[0];
                if (resultCode == 'FAIL') {
                    var err_code_des = util.getXMLNodeValue('err_code_des', res.data.toString("utf-8"));
                    var errDes = err_code_des.split('[')[2].split(']')[0];
                    wx.showToast({
                        title: errDes,
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    //发起支付
                    var prepay_id = util.getXMLNodeValue('prepay_id', res.data.toString("utf-8"));
                    var tmp = prepay_id.split('[');
                    var tmp1 = tmp[2].split(']');
                    //签名  
                    var key = '45b3OoEhyk4vxqbPGxGJHjbYNOozXH6N'; //商户key必填，在商户后台获得
                    var appId = 'wx2df1a3c252717e21'; //appid必填
                    var timeStamp = util.createTimeStamp();
                    var nonceStr = util.randomString();
                    var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
                    console.log("签名字符串", stringSignTemp);
                    var sign = MD5.md5(stringSignTemp).toUpperCase();
                    console.log("签名", sign);
                    var param = {
                        "timeStamp": timeStamp,
                        "package": 'prepay_id=' + tmp1[0],
                        "paySign": sign,
                        "signType": "MD5",
                        "nonceStr": nonceStr
                    }
                    console.log("param小程序支付接口参数", param);
                    _this.processPay(param, out_trade_no);
                }

            },
        })

    },

    /* 小程序支付 */
    processPay: function (param, out_trade_no) {
        let _this = this;
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function (res) {
                // success
                console.log("wx.requestPayment返回信息", res);
                wx.showModal({
                    title: '支付成功',
                    content: '您将在“微信支付”官方号中收到支付凭证',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            _this.uploadPayInfo(parseInt(_this.data.price), out_trade_no);
                        }
                    }
                })
            },
            fail: function (res) {
                console.log("支付失败", res);
                util.toast('支付失败')
            },
            complete: function (res) {
                console.log("支付完成(成功或失败都为完成)", res);
            }
        })
    },

    // 支付成功
    uploadPayInfo: function (price, orderNum) {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/Xiaochengxu/chongzhi';
        loginApi.requestUrl(app, url, "POST", {
            "price": price,
            "ordersn": orderNum,
            "uid": wx.getStorageSync("u_id"),
            "expert_id": this.data.expert_id,
        }, function (res) {
            if (res.status == 1) {
                _this.uploadQuestion();
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '请联系客服电话 17130049211 或者加客服微信 bxz201809',
                    showCancel: false,
                    success: function (res) {
                        _this.uploadQuestion();
                    }
                })
            }
        })
    },

    //提交问题
    uploadQuestion: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/question';
        loginApi.requestUrl(app, url, "POST", {
            "text": this.commentxt,
            "openid": wx.getStorageSync("u_open_id"),
            "expert_id": this.data.expert_id,
        }, function (res) {
            if (res.status == 1) {
                wx.navigateTo({
                    url: '/pages/myQuestion/myQuestion'
                })
            } else {
                wx.showModal({
                    title: '服务器异常',
                    content: '请联系客服电话 17130049211 或者加客服微信 bxz201809',
                    showCancel: false,
                    success: function (res) {
                        wx.navigateTo({
                            url: '/pages/mine/mine',
                        })
                    }
                })
            }
        })
    },
})