const app = getApp();
Component({

    properties: {
        bartype: {
            type: Number,
            value: 1
        },

    },

    data: {
        index_select_icon:'https://duanju.58100.com/upload/lianai/bot_bar_index_select.png',
        index_noselect_icon:'https://duanju.58100.com/upload/lianai/bot_bar_index_noselect.png',
        mine_select_icon:'https://duanju.58100.com/upload/lianai/bot_bar_mine_select.png',
        mine_noselect_icon:'https://duanju.58100.com/upload/lianai/bot_bar_mine_noselect.png',
    },

    created() {
        
    },

    attached() {
        this.setData({
            bartype: this.data.bartype,
        })

    },
    methods: {
        botBarClickEvent:function(e){
            let path=e.currentTarget.dataset.path;
            let url=null;
            if (path == this.data.bartype){
                return;
            };
            this.setData({
                bartype: path,
            });
            if (path==1){
                url='/pages/index/index';
                wx.navigateBack({
                    delta: 50
                })
            }else if(path==2){
                url = '/pages/mine/mine';
                wx.navigateTo({
                    url: url,
                })
            }else{
                url = '/pages/expertsList/expertsList';
                wx.navigateTo({
                    url: url,
                })
            }
            
        },
    }
})