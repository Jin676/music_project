//Page Object
import request from "../../utils/request"
Page({
    data: {
        phone:"",
        password:""
    },
    //options(Object)
    onLoad: function(options){
        
    },
    handleInput(e){
        let type = e.currentTarget.id
        this.setData({
            [type]:e.detail.value
        })
        
    },
    login(){
        //前端验证
        let {phone,password} = this.data
        if(!phone){
            wx.showToast({
                title:"手机号不能为空",
                icon:"none"
            })
            return
        }
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(!phoneReg.test(phone)){
            wx.showToast({
                title:"请输入正确手机号码",
                icon:"none"
            })
            return 
        }
        if(!password){
            wx.showToast({
                title:"密码错误",
                icon:"none"
            })
        }
        wx.showToast({
            title:"前端验证成功"
        })

        //后端验证
        this.phoneLoginReq(phone,password)
    },
   async phoneLoginReq(phone,password){
     let req = await request("/login/cellphone",{phone,password,isLogin:true})
     if(req.code === 200){
         wx.showToast({
             title:"登陆成功"
         })
         wx.setStorageSync("userInfo",JSON.stringify(req));
         wx.reLaunch({
             url: '/pages/personal/personal',
         });
     }else if(req.code === 400){
        wx.showToast({
            title:"手机号码错误",
            icon:"none"
        })
     }else if(req.code === 502){
         wx.showToast({
             title:"密码错误",
             icon:"none"
         })
     }else{
        wx.showToast({
            title:"其他未知错误",
            icon:"none"
        })
     }
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