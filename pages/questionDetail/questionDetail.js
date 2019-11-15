import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

    data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),

        ifShowAdvisoryView: 0, //是否显示追问弹框
        ifShowCommentView: 0, //是否显示评论弹框
        answerArr: [],
        questionStr: '',
        commentTxt: '',
    },

    onLoad: function(options) {
        let _this = this;
		this.commentTxt = "";
		this.quescommentxt="";
        this.setData({
            topViewHeight: app.windowHeight - 6,
        });
        if (options && options.questionId) {
			this.questionId = options.questionId;
            this.expertId = options.expertId;
            this.loadQuestionDetails(options.questionId)
            this.questioOver(options.questionId)
            console.log(this.expertId)
			
        }
		if (app.globalData.userInfo){
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			});
		}
    },

    onShow: function() {

    },

    onShareAppMessage: function() {

    },

    catchtap: function() {},

    //提问输入框失去焦点
    quesbindblur: function(e) {
        this.setData({
            questionStr: this.quescommentxt,
        })
    },

    //评论框失去焦点
	combindblur: function(e) {
        this.setData({
            commentTxt: this.commentTxt,
        })
    },

    //提问输入框输入的时候
    quesbindinput: function(e) {
        let content = e.detail.value;
        this.quescommentxt = content;
    },

    //评论框输入的时候
	combindinput: function(e) {
        let content = e.detail.value;
        this.commentTxt = content;
    },

    //提交评论
    submitCommetn: function() {
		if (!util.check(this.commentTxt)) {
			util.toast("请输入有效内容~", 1200)
			return;
		};
		let _this = this;
		let url = loginApi.domin + '/qinggan/index.php/Home/index/evaluate';
		loginApi.requestUrl(app, url, "POST", {
			"text": this.commentTxt,
            "openid": wx.getStorageSync("u_open_id"),
			"expert_id": this.expertId,
			"username": app.globalData.userInfo.nickName,
			"photo": app.globalData.userInfo.avatarUrl,
		}, function (res) {
			if (res.status == 1) {
				_this.showHideCommentView()
				_this.commentTxt = ""
				_this.setData({
					commentTxt: '',
				})
				util.toast("评价成功~")
			} else {
				wx.showModal({
					title: '服务器异常',
					showCancel: false,
					success: function (res) {
						wx.reLaunch({
							url: '/pages/index/index',
						})
					}
				})
			}
		})
    },

    //提交追问
    submitquestion: function() {
		if (!util.check(this.quescommentxt)) {
			util.toast("请输入有效内容~", 1200)
			return;
		};
        let _this = this;
		let url = loginApi.domin + '/qinggan/index.php/Home/index/answer';
        loginApi.requestUrl(app, url, "POST", {
			"text": this.quescommentxt,
            "openid": wx.getStorageSync("u_open_id"),
			"expert_id": this.expertId,
			"question_id": this.questionId,
        }, function(res) {
            if (res.status == 1) {
				_this.loadQuestionDetails(_this.questionId)
				_this.questioOver(_this.questionId)
				_this.showHidedAvisoryView()
            } else {
				wx.showModal({
					title: '服务器异常',
					showCancel: false,
					success: function (res) {
						wx.reLaunch({
							url: '/pages/index/index',
						})
					}
				})
            }
        })

    },

    //等待回复toast
    showmask: function() {
        util.toast("请耐心等待~");
		this.loadQuestionDetails(this.questionId)
		this.questioOver(this.questionId)
    },

    //显示追问弹窗
    showHidedAvisoryView: function() {
        this.setData({
            ifShowAdvisoryView: !this.data.ifShowAdvisoryView,
        })
    },

    //显示评论弹窗
    showHideCommentView: function() {
        this.setData({
            ifShowCommentView: !this.data.ifShowCommentView,
        })
    },

    //加载问题详情
    loadQuestionDetails: function(id) {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/question_detail';
        loginApi.requestUrl(app, url, "POST", {
            "id": id,
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    answerArr: res.answer,
                    question: res.question,
                });
            }
        })
    },

    //此问题是否已经结束
    questioOver: function(id) {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/count';
        loginApi.requestUrl(app, url, "POST", {
            "id": id,
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    count: parseInt(res.count),
                });
            }
        })
    },

	//获取用户头像信息
	onGotUserInfo: function (e) {
		if (!e.detail.userInfo) {
			util.toast("评论需要授权哦亲~", 1200)
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
	},
})