// pages/video/video.js
import request from "../../utils/request"
//Page Object
//Page Object
Page({
    data: {
        videoGroupList: [],
        navId: "",
        videoList: [],
        vId:"",
        videoTimeList:[], //保存id和时间
        isTriggered:false  //标识下拉刷新是否触发
    },
    //options(Object)
    onLoad: function (options) {
        this.reqVideoNavListData()
    },
    // 获取nav列表
    async reqVideoNavListData() {
        let videoGroupList = await request("/video/group/list")
        videoGroupList = videoGroupList.data.slice(0, 14),
            this.setData({
                videoGroupList,
                navId: videoGroupList[0].id
            })
        this.reqVideoList(this.data.navId)
    },
    // 点击nav，添加下边框
    handleNav(e) {
        let navId = e.currentTarget.id
        this.setData({
            //    字符串转化为number
            navId: navId >>> 0
        })
        this.reqVideoList(this.data.navId)
    },
    // 获取标签下对应的视频列表
    async reqVideoList(navId) {
        let videoList = await request("/video/group", { id: navId })

     // 关闭下拉刷新
        
        let index = 0;
        videoList = videoList.datas.map(item => {
            item.id = index++;
            return item
        })
        this.setData({
            videoList,
            isTriggered:false
        })
    },

    // 点击当前视频，停止其他视频播放
    handleplay(e) {
       
        // 点击视频的id
        let vid = e.currentTarget.id
        //判断点击和上次的点击是否为同一个video，如果不是那么停止播放
        this.vid !== vid && this.videoContext && this.videoContext.stop()
        // 如果是则将点击的赋值给上一个，正常播放
        this.vid = vid
        this.videoContext = wx.createVideoContext(vid);
    },

    // 点击封面图片将图片转化为video
    handleplay(e){
        let vId = e.currentTarget.id
        this.setData({
            vId
        })
    },
    // 监视进度条长度的回调,实现再次播放跳转至指定位置功能
    handleVideoTime(e){
        let videoTimeObj = {currentTime:e.detail.currentTime,vId:e.currentTarget.id}
        let {videoTimeList} = this.data
        // videoTimeList是包裹videoTimeObj的数组，find查询里面对应属性,里面属性应该一模一样
         let videoItem = videoTimeList.find(item=>item.vId === videoTimeObj.vId)
         if(videoItem){
            videoItem.currentTime = videoTimeObj.currentTime
         }else{
             videoTimeList.push(videoTimeObj)
         }
         this.setData({
            videoTimeList
         })
    },
    // 播放到末尾删除数组中视频项
    handleEnd(e){
      let vid = e.currentTarget.id
      let {videoTimeList} = this.data
      let index =videoTimeList.findIndex(item=>item.vId === vid)
      videoTimeList.splice(index,1)
      this.setData({
        videoTimeList
      })
    },
    handleRefresher(e){
        let {navId} = this.data
        this.reqVideoList(navId)
        
    },
    //async handleToLower(){
        //let result =await erquest("xxxx")
        // list.push(result)
        //this.data({list})
    // },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },
    onPageScroll: function () {

    },
    //item(index,pagePath,text)
    onTabItemTap: function (item) {

    }
});