// pages/recommendSong/recommendSong.js
import PubSub from "pubsub-js"
import request from "../../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: "00",
        month: "00",
        reCommendList: [],
        musicId: "",
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })

        this.reqRecommend()

        PubSub.subscribe("type", (msg, type) => {
            let {reCommendList,index} = this.data
            
           if (type === "pre") {
                index === 0 && (index = reCommendList.length);
                    index -= 1
            } else {
                (index === reCommendList.length -1) && (index = -1);
                    index += 1
            }
            this.setData({
                index
            })
            // 不更新下标index永远是固定的2个
            let musicId = reCommendList[index].id
           
            PubSub.publish("musicId",musicId)
        })
    },
    async reqRecommend() {
        let recommendData = await request("/recommend/songs")
        this.setData({
            reCommendList: recommendData.recommend
        })
    },
    songDetailTo(e) {
        // 点击的那一项的id
        let musicId = e.currentTarget.id
        let index = e.currentTarget.dataset.index
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?ids=' + musicId,
        });
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