import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		questionsArr:[],
        apihaveload:0,
	},

	onLoad: function (options) {
		let _this = this;
		_this.setData({
			topViewHeight: app.windowHeight - app.globalData.topbarHeight,
		});

		this.page = 1;
		this.rows = 10;
		this.cangetData = true;

		this.loadlianaiProblem()
	},

	onShow: function () {

	},

	onShareAppMessage: function () {

	},

	gotoDeatils:function(e){
		let id=e.currentTarget.dataset.id;
        let expertId = e.currentTarget.dataset.expertid;
		wx.navigateTo({
            url: `/pages/questionDetail/questionDetail?questionId=${id}&expertId=${expertId}`,
		})
	},

	// 加载下一页
	nextpage: function () {
		if (this.cangetData) {
			this.page++;
			this.loadlianaiProblem();
		} else {
			util.toast('没有更多数据了')
		}
	},

	//加载恋爱问题
	loadlianaiProblem: function () {
		let _this = this;
		let url = loginApi.domin + '/qinggan/index.php/Home/index/user_question';
		loginApi.requestUrl(app, url, "POST", {
			page: this.page,
			len: this.rows,
            "openid": wx.getStorageSync("u_open_id"),
		}, function (res) {
			if (res.status == 1) {
				if (res.question.length < _this.rows) {
					_this.cangetData = false;
				}

				if (res.question.length == 0) {
					_this.cangetData = false;
					_this.page == 1 ? null : _this.page--;
					util.toast("暂无更多更新");
					return;
				};
				_this.setData({
					questionsArr: _this.data.questionsArr.concat(res.question),
                    apihaveload:0,
				});
			}
		})
	},

})