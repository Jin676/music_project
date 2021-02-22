// pages/video/video.js
import request from "../../utils/request"
//Page Object
Page({
    data: {
        groupList: [],
        navId: "",
        videoList: [],
        videoId: "",//video标识
        videoUpdateTime: [],//视频播放时间
    },
    //options(Object)
    onLoad: function (options) {
        this.groupListReq()
    },
    async groupListReq() {
        let groupData = await request("/video/group/list")
        this.setData({
            groupList: groupData.data.slice(0, 15),
            navId: groupData.data[0].id
        })
        this.videoListData(this.data.navId)
    },
    //视频列表数据
    async videoListData(navId) {
        if (!navId) { return }
        let videoList = await request("/video/group", { id: navId })
        wx.hideLoading();
        let index = 0;
        let videoListNew = videoList.datas.map(item => {
            item.id = index++
            return item
        })
        this.setData({
            videoList: videoListNew
        })
    },
    change(e) {
        let navId = e.currentTarget.id
        //  原因加了scroll字符串会导致字符串转换成number失败，因此删除通过replace删除scroll字符串便可以
        navId = navId.replace("scroll", "")

        this.setData({
            navId: navId >>> 0,
            // 功能：切换nav不显示上一个页面数据
            videoList: []
        })

        //显示正在加载
        wx.showLoading({
            title: "正在加载中"
        });
        console.log(navId);
        //获取当前导航的视频列表
        this.videoListData(this.data.navId)
    },
    // 点击播放的回调
    handlePlay(e) {
        // 功能：点击当前视频，停止播放其他视频
        let vid = e.currentTarget.id;
        // this.vid是上次的vid，vid是这次点击的vid
        //this.videoContext上一次的点击视频的实例，必须要有，否则停止不了
        //上次的id和这次的不同，并且上次要点击过，才能停止
        this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid = vid
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid);
        let {videoUpdateTime} = this.data
        let videoItem = videoUpdateTime.find(item=>item.vid === vid)
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play()
    },
    // 监听视频播放进度回调
    handleTimeUpdate(e) {
        //videoTimeObj.vid是点击的，item.vid是遍历的
        let videoTimeObj = { vid: e.currentTarget.id, currentTime: e.detail.currentTime }
        let { videoUpdateTime } = this.data;
        let videoUpdateTimeItem = videoUpdateTime.find(item=> item.vid === videoTimeObj.vid)
        if(videoUpdateTimeItem){
            videoUpdateTimeItem.currentTime = videoTimeObj.currentTime
        }else{
            videoUpdateTime.push(videoTimeObj);
        }
        this.setData({
            videoUpdateTime
        })
    },
    handleVideoEnd(e){
        let endId = e.currentTarget.id
        let { videoUpdateTime } = this.data;
        let videoUpdateTimeItem = videoUpdateTime.findIndex(item=> item.vid === endId)
        videoUpdateTime.splice(videoUpdateTimeItem,1)
        this.setData({
            videoUpdateTime
        })
    },
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