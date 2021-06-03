// pages/search/search.js
import request from "../../utils/request"
let isSend = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: "", //placeholder默认内容
        hotList: [],
        searchContent: "",
        searchList: [], //模糊匹配数据
        historyList: [], //搜索历史记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInitData()
        this.getSearchHistory()

    },

     getSearchHistory() {
         
         let historyList = JSON.parse(wx.getStorageSync("searchHistory"))
         console.log(historyList);
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },

    //获取初始化数据
    async getInitData() {
        let placeholderData = await request("/search/default")
        // 热搜榜
        let hotListData = await request("/search/hot/detail")
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hotListData.data
        })
    },
    //   表单项内容改变回调
    handleInputChange(e) {
        let searchContent = e.detail.value.trim()
        this.setData({
            searchContent
        })
        //函数节流300ms内一直return
        if (isSend) {
            return
        }
        isSend = true
        this.getSearchList()
        setTimeout(() => {
            // 300ms以后进来

            isSend = false
        }, 300)
    },
    // 获取搜索数据的功能函数
    async getSearchList() {
        if (!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return
        }
        let { searchContent, historyList } = this.data

        let searchListData = await request("/search", { keywords: this.data.searchContent, limit: 10 })
        this.setData({
            searchList: searchListData.result.songs
        })
        // 判断数组中有没有添加过的内容
        if (historyList.indexOf(searchContent) !== -1) {
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
            // 将搜索关键字添加到搜索历史记录中
            historyList.unshift(searchContent)
        
        
        this.setData({
            historyList
        })
       
            wx.setStorageSync("searchHistory", JSON.stringify(historyList));
        
    },
    // 清空搜索内容
    clearSearchContent() {
        this.setData({
            searchContent: "",
            searchList: []
        })
    },

    // 删除历史记录
    deleteSearchHistory() {
        // 模态框
        wx.showModal({
            content: '确认删除吗',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    //清空data中历史list
                    this.setData({
                        historyList: []
                    })
                    // 还要移除本地的
                     wx.removeStorageSync("searchHistory");
                }
            },
            fail: () => { },
            complete: () => { }
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