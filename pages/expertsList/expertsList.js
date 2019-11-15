import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()

Page({
    data: {
        expertsArr:[],
    },

    onLoad: function (options) {
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;

        if (options && options.classId){
            this.classId = options.classId;
            this.loadExpertsList();
        }else{
            this.loadExpertsLists();
        }
    },

    onShow: function () {
        
    },

    onShareAppMessage: function () {

    },

    // 页面触底时执行
    onReachBottom: function () {
        if (this.cangetData) {
            this.page++;
            this.classId ? this.loadExpertsList() : this.loadExpertsLists();
        }
    },

    // 加载专家列表
    loadExpertsList: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/expert';
        loginApi.requestUrl(app, url, "POST", {
            page: this.page,
            len: this.rows,
            id: this.classId,
        }, function (res) {
            if (res.list.length < _this.rows) {
                _this.cangetData = false;
            }
            _this.setData({
                expertsArr: _this.data.expertsArr.concat(res.list)
            })
        })
    },

    // 加载专家列表
    loadExpertsLists: function () {
        let _this = this;
        let url = loginApi.domin + '/qinggan/index.php/Home/index/experts';
        loginApi.requestUrl(app, url, "POST", {
            page: this.page,
            len: this.rows,
        }, function (res) {
            if (res.list.length < _this.rows) {
                _this.cangetData = false;
            }
            _this.setData({
                expertsArr: _this.data.expertsArr.concat(res.list)
            })
        })
    },
    
    navExpertDetails:function(e){
        let id=e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/expertsDetails/expertsDetails?expert_id=${id}`,
        })
    },

})