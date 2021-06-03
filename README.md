
<!-- 用户通过系统提供的暂停，页面不知道从而导致两者同时 -->
<!-- 解决方法 -->
    解决方法：
        1、通过控制音频实例去监视音乐播放/暂停
        2、三个势力方法调用
    this.backAudioManager = wx.getBackgroundAudioManager();
      this.backAudioManager.scr=musicLinkData 必须要有连接
      this.backAudioManager.title = "名称"  必须要有
    this.backAudioManager.onPlay(()=>{
        // 音乐开始
        this.changePlayState(true)
    })
    this.backAudioManager.onPause(()=>{
         // 音乐暂停
         this.changePlayState(false)
    })
    this.backAudioManager.onStop(()=>{
        //音乐停止
        this.changePlayState(false)
    })
  },

  this.backAudioManager.pause() 停止播放不添加on，停止播放回调添加on
  <!--详情页后退到每日推荐，详情页被销毁在进入状态是错的 -->
  解决方法：
    1、全局app.js的globalData中设置数据的id和播放状态
    2、在详情页创建const appinstans = getApp()  
    3、在3个背景音乐的实例中appinstans.xxx修改状态


 <!-- 小程序页面通信 npm包 pubsub-->

 <!--定义事件相关  -->
    1、分类
        1)标准DOM事件
        2)自定义事件
    2、标准DOM事件
        1)举例click、input
        2)事件名固定，事件由浏览器触发   
    3、自定义事件
        1)绑定事件   例子:bindtap="xx" ，bindtap就是绑定事件，xx就是事件名
            ①事件名  
            ②回调函数
            ③订阅方：PubSub.subscribe("xxx",()=>{})  绑定事件 需要提供事件名和回调函数
        2)触发事件
            ①事件名
            ②调用回调，提供数据    
            ③发布方  PubSub.publish("xxx",data)  
  订阅放入到切歌中，订阅是会累加的，第三方库不删除会一直累加，使用卸载订阅PubSub.unsubscribe("musicId")
  放入到onload中也不行，因为第三方库在本地，对象在本地，因此销毁不了本地的pubsub中数据

  下一首注意：播放下一首要停止上一首的播放


  <!-- 播放或者暂停就会发请求 -->
        判断是否有音乐链接,如果没有的话则按照创建的方法创建，有的话则用那个data中链接

<!-- 下拉刷新APi和上啦加载api -->
        scrollview的下拉和上拉：
        下拉刷新：
        bindrefresherrefresh	eventhandle		否	自定义下拉刷新被触发   js
        绑定该事件

        refresher-enabled	boolean	false	否	开启自定义下拉刷新   html

        efresher-triggered	boolean	false	否	设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
        布尔值设置：true或者false  控制下拉或者回弹  在获取数据列表中设置

        上拉加载：
        bindscrolltolower	eventhandle		否	滚动到底部/右边时触发 
        绑定事件 加载显示更多内容，拿更多数据显示内容



<!--日期转换  -->
    使用第三方库moment.js库  let durationTime = moment(songData.songs[0].dt).format('mm:ss'); mm秒ss毫秒

<!--监听背景音频更新进度事件  -->
    <!-- 更新进度事件 -->
    BackgroundAudioManager.onTimeUpdate(function callback)

    监听背景音频播放进度更新事件，只有小程序在前台时会回调。
    <!-- 进度条实时时间 -->
    number duration 总时长
    当前音频的长度（单位：s），只有在有合法 src 时返回。（只读）

    number currentTime 实时时间
    当前音频的播放位置（单位：s），只有在有合法 src 时返回。（只读）

<!--音频优化  -->
    点击上一首下一首停止当前音乐播放：
    播放下一首停止上一首播放this.backAudioManager.stop(),

    音乐暂停/开始发送多次连接
    在请求背景音乐前判断，是否有当前音乐连接，如果有则用，没有在发请求


<!--音频进度条相关  -->
    总时长：请求数据中的dt数据，赋值给data中duration

    监督进度条更新事件（小程序前台才会调用，放到onload中监听）： BackgroundAudioManager.onTimeUpdate(function callback)
    onTimeUpdate身上有duration和currentTime事件

    实时时长：
    实例.currentTime 当前时间
    将实时时间转化为毫秒，格式化成00：00
    let currentTime = moment(this.backAudioManager.currentTime*1000).format("mm:ss") 

    进度条宽度实时动态增长：
    currentWidth: 实时时间/总时间*总长度

    监听背景音频自然播放结束：
    BackgroundAudioManager.onEnded(function callback)
    监听背景音频自然播放结束事件


<!-- 搜索功能 -->
    模糊匹配：
        表单项有2种事件input和change，change需要失去焦点才会触发.
        1、收集表单项数据       绑定input事件，e.detail.value收集输入数据
        2、发送请求
        3、函数节流，不能给input添加异步函数，而是需要外部封装，内部调用
        4、显示搜索内容，热搜榜需要隐藏

    问题1：收集的表单是对象，[object,promise]绑定的事件返回的，也就是e.detail.value，人为给表单事件async 
    value返回的是promise对象，因此input事件不能绑定async

    解决办法：外部封装async函数，内部调用。 


    问题2：删除搜索字的时候,也会发送空字符串请求 
    解决办法：发送请求前判断是否有输入内容,并且将列表清空
    
    残留问题：删除的过快，搜索列表依旧存在，输入过快不会实时发送请求



<!-- 历史记录 -->
    history外部包裹的高度不能写死，否则会被热搜榜压住




<!--获取用户登录  -->
   前端通过wx.login获取用户临时凭证，
   后端：接收用户id，还有小程序商家id和秘钥，fly发送给微信客户端
   微信客户端返回用户信息，result.data中包含openid(用户的id)，后端接收到openid后通过jwt.sign(数据,想要添加的秘钥)加密，在通过jwt.verify(token,秘钥名)解密

    前端：wx.login({
            timeout: 10000,
            success: async (result) => {
                let code = result.code

                // 将用户登录凭证发送到服务器端
                let reqData = await request("/getOpenId", { code })
            },
            fail: () => { },
            complete: () => { }
        });
    后端：接收用户id，还有小程序商家id和秘钥，发送给微信客户端，用fly这个库发送给微信服务器
    为什么用fly？因为axios不支持小程序，只支持浏览器  



<!--分包下载  -->
小程序要求包最高上限为2m，分包将一个大包拆为多个小包，总大小不能超过16m
package就是子包，被拆出去的小包