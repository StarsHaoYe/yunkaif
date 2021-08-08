// pages/shouye/shouye.js
const aliSdk = require("../../utils/aliIot-sdk.js")
const app = getApp()

Page({
  data: {
    GPS:"暂无位置信息",
    Temp: "--",
    Humidity: "--",
    co2: "--",
    PM10: "--",
    level:"优",
    tips:"大自然的每一个领域都是美妙绝伦的。————亚里士多德",
    openedDevice: false,
    deviceSwitch: false,//switch
    //下面三个数据有关下拉刷新
    bgTextStyle: 'dark',
    scrollTop: undefined,
    nbLoading: false,
    
  },
  /**switch
  switchChange: function (e){
    console.log(`Switch样式点击后是否选中：`, e.detail.value)
  },*/
  //下拉刷新 待修改！
  onLoad() {
    var math = '$$ CO_2 $$'
    let result = app.towxml(math, 'markdown', {
      //base: 'https://xxx.com', // 相对资源的base路径
      theme: 'light', // 主题，默认`light`
      events: { // 为元素绑定的事件方法
        tap: (e) => {
          console.log('tap', e);
        }
      }
    });
 
    // 更新解析数据
    this.setData({
      article: result,
    });
    /*setTimeout(() => {
      this.setData({
        bgTextStyle: 'dark',
        //nbLoading: true,
      })
    }, 5000)*/
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
    this.loadData()

  },
//通过封装的sdk读取物联网平台数据
loadData: function () {
  var that = this
  aliSdk.request({
      Action: "QueryDevicePropertyStatus",
      ProductKey: app.globalData.productKey,
      DeviceName: app.globalData.deviceName
    }, {
      method: "POST"
    },
    (res) => {
      console.log("success1")
      console.log(res) //查看返回response数据
      if (res.data.Code) {
        console.log(res.data.ErrorMessage)
        wx.showToast({
          title: '设备连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
        that.setPropertyData(null)
      } else {
        that.setPropertyData(res.data.Data.List.PropertyStatusInfo)
      }
    },
    (_res) => {
      console.log("fail")
      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        duration: 1000,
        complete: () => {}
      })
      this.setPropertyData(null)
    },
    (_res) => {
      console.log("complete1")
    })
},
//设置前端数据
setPropertyData: function (infos) {
  var that = this
  if (infos) {
    var propertys = that.convertPropertyStatusInfo(infos)
    that.setData({
      //GPS:propertys.GPS,
      Temp: propertys.IndoorTemperature,
      Humidity: propertys.CurrentHumidity,
      co2: propertys.data,
      //lightLux: propertys.LightLuxValue,
     // soundDecibel: propertys.SoundDecibelValue,
     // pm25: propertys.PM25Value,
    })
  } else {
    that.setData({
      Temp: "--",
      Humidity: "--",
      co2: "--",
      GPS:"无法获取位置信息",
      soundDecibel: "--",
      PM10: "--"
    })
  }
},

//将返回结果转成key,value的json格式方便使用
convertPropertyStatusInfo: function (infos) {
  var data = {}
  infos.forEach((item) => {
    data[item.Identifier] = item.Value ? item.Value : null
  })
  return data
},

//调用服务改变设备状态
changeDeviceStatus: function () {
  var that = this
  //防止重复点击
  /*that.setData({
    deviceSwitch: true
  })*/
  
  aliSdk.request({
      Action: "InvokeThingService",
      ProductKey: app.globalData.productKey,
      DeviceName: app.globalData.deviceName,
      Identifier: that.data.openedDevice ? "CloseDevice" : "OpenDevice",
      Args: "{}" //无参服务，所以传空
    }, {
      method: "POST"
    },
    (res) => {
      console.log("success2")
      console.log(res) //查看返回response数据
      that.setData({
        openedDevice: !that.data.openedDevice,
        deviceSwitch: true
      })
    },
    (_res) => {
      console.log("fail")
      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        duration: 1000,
        complete: () => {}
      })
    },
    (_res) => {
      console.log("complete2")
      that.setData({
        deviceSwitch: false
      })
    })
},
//跳动到某个位置  以下皆是
  scrollTo100: function () {
    this.setData({
      scrollTop: '200rpx'
    })
  },
  pageScroll: function (e) {
    console.log('scroll', e.detail)
  },
  pageResize: function (e) {
    console.log('resize', e.detail)
  },
  pageScrollDone: function (e) {
    console.log('scrolldone', e.detail)
  },
  onPullDownRefresh() {},

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
