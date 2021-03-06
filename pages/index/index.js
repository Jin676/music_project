// pages/index/index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    tuijianList:[],
    topDataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad:async function (options) {
   
    //  轮播图
  let bannerListData =  await request("/banner",{type:2})
    if(bannerListData.code === 200){
        // console.log(bannerListData.banners);
        this.setData({
            bannerList:bannerListData.banners
        })
    }
    //推荐区
    let tuijianData= await request("/personalized")
    if(tuijianData.code ===200){
       
        this.setData({
            tuijianList:tuijianData.result
        })
    }
    // 排行榜
        let index=0;
        let topDataSave=[];
        while(index<5){
            let topData = await request("/top/list",{idx:index++})
            console.log(topData);
            topDataSave.push({name:topData.playlist.name,data:topData.playlist.tracks})
            this.setData({
                topDataList:topDataSave
            })
        }

    
},
 //   跳转至toReacommentSong
toReacommentSong(){
    wx.navigateTo({
        url: '/songPackage/pages/recommendSong/recommendSong'
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