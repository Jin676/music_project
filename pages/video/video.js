// pages/video/video.js
import request from "../../utils/request"
//Page Object
//Page Object
Page({
    data: {
        videoGroupList:[],
        navId:"",
        videoGroup:[]
    },
    //options(Object)
    onLoad: function(options){
        this.reqVideoGroupListData()
    },
    // nav列表获取
   async reqVideoGroupListData(){
      let videoGroupData = await request("/video/group/list")
     
        videoGroupData && (videoGroupData = videoGroupData.data.slice(0,14))
        this.setData({
            videoGroupList:videoGroupData,
            navId:videoGroupData[0].id
        })
        this.reqVideoListData(this.data.navId)
    },
    // 点击列表item加上bor边框
    handleNav(e){
        // navId:string,item.id:number
        let navId = e.currentTarget.id
        this.setData({
            navId:navId>>>0,
        })

        this.reqVideoListData(this.data.navId)
    },

    // 获取视频列表
   async reqVideoListData(navId){
         let VideoList = await request("/video/group",{id:navId})
            this.setData({
                videoGroup:VideoList.datas
            })
         
    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onShareAppMessage: function(){

    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});