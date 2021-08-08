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
    apiVersion: '2018-01-20'
  },
  // 引入`towxml3.0`解析方法
	towxml:require('./dist/index'),
})
