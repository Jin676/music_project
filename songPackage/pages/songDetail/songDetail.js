import PubSub from "pubsub-js"
import moment from "moment"
import request from "../../../utils/request"
// 获取全局app
const appinstans = getApp()
// pages/songDetail/songDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //控制开关
        ids: "",
        song: {},
        musicLink:"",
        currentTime:"00:00", //实时时间
        duration:"00:00",  //总时长
        currentWidth:0, //实时进度条宽度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    //   options专门接受路由跳转query参数
    onLoad: function (options) {
        let ids = options.ids
        this.reqMusicDetail(ids)

        // 判断音乐是否在播放
        if (appinstans.globalData.isMusicPlay && appinstans.globalData.musicId === ids) {
            this.setData({
                isPlay: true
            })
        }

        this.backAudioManager = wx.getBackgroundAudioManager();
        this.backAudioManager.onPlay(() => {
            this.setData({
                isPlay: true
            })
            appinstans.globalData.isMusicPlay = true
            appinstans.globalData.musicId = ids

        })
        this.backAudioManager.onPause(() => {
            this.setData({
                isPlay: false
            })
            appinstans.globalData.isMusicPlay = false
        })
        // 音乐播放器x号按钮监听
        this.backAudioManager.onStop(() => {
            this.setData({
                isPlay: false
            })
            appinstans.globalData.isMusicPlay = false
        })
        this.backAudioManager.onTimeUpdate(()=>{
            // moment()传入时间为毫秒
            let {duration} = this.data
         let currentTime = moment(this.backAudioManager.currentTime*1000).format("mm:ss")  
         let currentWidth = this.backAudioManager.currentTime/this.backAudioManager.duration*450
         this.setData({
            currentTime,
            currentWidth
         })
        }),
        // 背景音频自然结束
        this.backAudioManager.onEnded(()=>{
            //切换下一首音乐,不需要调用切歌回调，直接调用publish就行
            PubSub.publish("type", next)
            
            this.setData({
                currentWidth:0,
                currentTime:"00:00"
            })
        })
    },

    // 获取音乐详情
    async reqMusicDetail(ids) {
        let MusicDetailData = await request("/song/detail", { ids })
        
        //获取音乐总时长 ,将毫秒转化为秒和分
        let durationTime =moment(MusicDetailData.songs[0].dt).format("mm:ss") 
        this.setData({
            song: MusicDetailData.songs[0],
            ids,
            duration:durationTime
        })

        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name,
        });
    },
    // 开始和暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        // this.setData({
        //     isPlay
        // })
        this.musicControl(isPlay, this.data.ids,this.data.musicLink)
    },

    // 控制音乐停止或者播放
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {//播放\
            if (!musicLink) {
                let musicLinkData = await request("/song/url", { id: musicId })
                musicLink = musicLinkData.data[0].url

                this.setData({
                    musicLink
                })
            }
            this.backAudioManager.src = musicLink
            this.backAudioManager.title = this.data.song.name
        } else {//暂停
            // 不添加on
            this.backAudioManager.pause()
        }
    },
    // 前后切换歌曲
    handleSwitch(e) {
        // 关闭当前播放的音乐
        this.backAudioManager.stop()
        PubSub.subscribe("musicId", (msg, musicId) => {
            console.log(musicId);
            //获取音乐详情
            this.reqMusicDetail(musicId)
            //s

            PubSub.unsubscribe("musicId")
        })
        let type = e.currentTarget.id
        PubSub.publish("type", type)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})