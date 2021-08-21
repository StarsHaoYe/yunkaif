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
    as: "fckba2VKNHJvCTeJQfZWFOq9rZWALW",//AccessKey Secret
    productKey: "a13oNCbs4id",
    deviceName: "test01",
    endpoint: "https://iot.cn-shanghai.aliyuncs.com",
    ai: "LTAI5tMcoYhyUc4CAGZs6Pfa", //AccessKeyId
    apiVersion: '2018-01-20',
    myname: "test01",

    shebeiList:[//多设备数组，将独立的设备信息转移到如下数组中
      {
        myname: "test01", //可自定义的设备名
        deviceName: "test01", //物联网平台的设备名
        as: "fckba2VKNHJvCTeJQfZWFOq9rZWALW",//AccessKey Secret
        productKey: "a13oNCbs4id",
        ai: "LTAI5tMcoYhyUc4CAGZs6Pfa" //AccessKeyId
      },
      {//这是复制的：）
        myname: "test02", //可自定义的设备名
        deviceName: "test02", //物联网平台的设备名
        as: "fckba2VKNHJvCTeJQfZWFOq9rZWALW",//AccessKey Secret
        productKey: "a13oNCbs4id",
        ai: "LTAI5tMcoYhyUc4CAGZs6Pfa" //AccessKeyId
      }
    ],

    standard:{
      Temp: 24,
      Humidity: 25,
      co2: 10,
      PM25: 26,
      PVOC: 30
    }
  },
  // 引入`towxml3.0`解析方法
	towxml:require('./dist/index'),
})
