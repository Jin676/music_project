// pages/personal/personal.js
import request from "../../utils/request"
let touchStartY=0;//点击初始y坐标
let touchMoveY=0; //滑动y坐标
let distance = 0 ; //滑动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:`translateY(0)`,
    coveTransition:``,
    userInfo:{},
    recordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let userInfo = wx.getStorageSync("userInfo");
   if(userInfo){
    this.setData({
        userInfo:JSON.parse(userInfo)
    })
   }
   this.ReqRecordData(this.data.userInfo.profile.userId)
  },
  async ReqRecordData(userId){
   let RecordData = await request("/user/record",{uid:userId,type:0})  
   let index = 0 
   let recordList = RecordData.allData.splice(0,15).map(item=>{
       item.id =index++
       return item
   })
   this.setData({
    recordList
   })
  },

  handleLogin(){
    wx.navigateTo({
        url: '/pages/login/login',
    });
  },
  handleTouchStart(e){
    touchStartY = e.touches[0].clientY
  },
  handleTouchMove(e){
    this.setData({
        coveTransition:``
    })
    touchMoveY = e.touches[0].clientY
    distance = touchMoveY - touchStartY
    if(distance<0){
        return
    }
    if(distance>60){
        distance=60
    }
    console.log(distance);
    this.setData({
        coverTransform:`translateY(${distance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
        coverTransform:`translateY(0rpx)`,
        coveTransition:`transform 1s`
    })
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