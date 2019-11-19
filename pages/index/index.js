import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        bartype:1,
        topClassArr:[],
        hotArticleArr:[],
    },

    onLoad: function(options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        };

        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.loadHotArticle();

        this.loadTopClass();

        // 跳转文章详情
        if (options && options.articleId){
            util.loading();
            setTimeout(function(){
                wx.hideLoading();
                wx.navigateTo({
                    url: `/pages/articleDetails/articleDetails?articleId=${options.articleId}`,
                })
            },800)
        };

        if (options && options.scene) {//记得改条件
            util.loading();
            console.log('SCENE', options);
            let scene = decodeURIComponent(options.scene);
            this.posterUid = scene.split('&')[0];
            this.posterImgId = scene.split('&')[1];
            wx.navigateTo({
                url: '',
            });
            wx.hideLoading();
        };

    },

    onShow: function() {
        this.setData({
            bartype:1,
        })
    },

    onShareAppMessage: function() {
        return util.shareObj;
    },

    // 页面触底时执行
    onReachBottom: function () {
        if (this.cangetData) {
            this.page++;
            this.loadHotArticle();
        }
    },

    //跳转专家列表
    navExpertsList:function(e){
        let id=e.currentTarget.dataset.id;
        let url=null;
        if(id){
            url = `/pages/expertsList/expertsList?classId=${id}`
        }else{
            url = `/pages/expertsList/expertsList`
        }
        wx.navigateTo({
            url: url,
        })
    },

    //跳转文章列表
    navArticleDetails:function(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/articleDetails/articleDetails?articleId=${id}`,
        })
    },

    //加载顶部分类
    loadTopClass: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/type';
        loginApi.requestUrl(app, url, "POST", {
        }, function (res) {
            _this.setData({
                topClassArr: _this.data.topClassArr.concat(res.type)
            })
        })
    },

    //加载hot
    loadHotArticle: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/article';
        loginApi.requestUrl(app, url, "POST", {
            page: this.page,
            len: this.rows,
        }, function (res) {
            if (res.article.length < _this.rows) {
                _this.cangetData = false;
            }
            _this.setData({
                hotArticleArr: _this.data.hotArticleArr.concat(res.article)
            })
        })
    },

    //传话通
    navChuanHua:function(){
        wx.navigateTo({
            url: `/pages/chuanHuaTong/chuanHuaTong`,
        })
    },

    // 收集formid
    formSubmit: function (e) {
        util.formSubmit(app, e);
    },

})