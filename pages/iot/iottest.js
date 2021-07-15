// pages/iot/iottest.js
const aliSdk = require("../../utils/aliIot-sdk.js")
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomTemp: "--",
    roomHumidity: "--",
    co2: "--",
    lightLux: "--",
    soundDecibel: "--",
    pm25: "--",
    openedDevice: false,
    buttonDisabled: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        console.log("success")
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
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
        this.setPropertyData(null)
      },
      (res) => {
        console.log("complete")
      })
  },

  //设置前端数据
  setPropertyData: function (infos) {
    var that = this
    if (infos) {
      var propertys = that.convertPropertyStatusInfo(infos)
      that.setData({
        roomTemp: propertys.CurrentTemperature,
        roomHumidity: propertys.RelativeHumidity,
        co2: propertys.CO2Value,
        lightLux: propertys.LightLuxValue,
        soundDecibel: propertys.SoundDecibelValue,
        pm25: propertys.PM25Value,
      })
    } else {
      that.setData({
        roomTemp: "--",
        roomHumidity: "--",
        co2: "--",
        lightLux: "--",
        soundDecibel: "--",
        pm25: "--"
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
    that.setData({
      buttonDisabled: true
    })
    
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
        console.log("success")
        console.log(res) //查看返回response数据
        that.setData({
          openedDevice: !that.data.openedDevice
        })
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
      },
      (res) => {
        console.log("complete")
        that.setData({
          buttonDisabled: false
        })
      })
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