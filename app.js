// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  globalData: {
    as: "kinbeCBNktSOVZWabuKcjLqacDvFtt",//AccessKey Secret
    productKey: "a1QpJvLtxim",
    deviceName: "EC20",
    endpoint: "https://iot.cn-shanghai.aliyuncs.com",
    ai: "LTAI5tDHsYbtmBkxeKgpBqdH", //AccessKeyId
    apiVersion: '2018-01-20',
    Time:{},
    Temp_h:[],   
    Humid_h:[],
    CO2_h:[],
    histroyData:[{Temp_h:[50],Humid_h:[50],CO2_h:[50]}],
//=======
    myname: "EC20",
 
    shebeiList:[//多设备数组，将独立的设备信息转移到如下数组中
      {
        myname: "EC20", //可自定义的设备名
        deviceName: "EC20", //物联网平台的设备名
        as: "kinbeCBNktSOVZWabuKcjLqacDvFtt",//AccessKey Secret
        productKey: "a1QpJvLtxim",
        ai: " LTAI5tDHsYbtmBkxeKgpBqdH" //AccessKeyId
      },
      {//这是复制的：）
        myname: "test02", //可自定义的设备名
        deviceName: "test02", //物联网平台的设备名
        as: "kinbeCBNktSOVZWabuKcjLqacDvFtt",//AccessKey Secret
        productKey: "a1QpJvLtxim",
        ai: "LTAI5tDHsYbtmBkxeKgpBqdH" //AccessKeyId
      }
    ],
   /* standard:{
      Temp: 24,
      Humidity: 25,
      co2: 10,
      PM25: 26,
      PVOC: 30
    }*/
  },
  globalData1: {
    productKey: "a1QpJvLtxim",
    deviceName: "EC20",
    endpoint: "https://iot.cn-shanghai.aliyuncs.com",
    ai: "LTAI5tDHsYbtmBkxeKgpBqdH", //AccessKeyId
    apiVersion: '2018-01-20'
    }
})
