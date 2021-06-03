import localhost from "./config"
export default (url,data={},methods="GET")=>{
    return new Promise((resolve,reject)=>{
      
        wx.request({
            url:localhost.host+url,
            data,
            methods,
            header:{
                cookie:wx.getStorageSync("cookies")?wx.getStorageSync("cookies").find(item=> item.indexOf("MUSIC_U")!== -1):""
            },
            success:(res)=>{
                console.log(res)
                if(data.isLogin){
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    });
                }
                resolve(res.data)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}