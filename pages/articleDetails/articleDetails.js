import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()

Page({
    data: {

    },

    onLoad: function (options) {
        if (options && options.articleId){
            this.articleId = options.articleId
            this.loadArticleDeatils();
        }
    },

    onShow: function () {

    },

    onShareAppMessage: function (e) {
        return {
            title: this.data.articleDetails.title,
            path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}&articleId=${this.articleId}`,
            imageUrl: `https://duanju.58100.com/qinggan/Uploads/${this.data.articleDetails.pic}`
        }
    },

    //加载文章详情
    loadArticleDeatils: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/article_detail';
        loginApi.requestUrl(app, url, "POST", {
            id: this.articleId,
        }, function (res) {
            _this.setData({
                articleDetails: res.article,
            })
        })
    },

})