// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"hello world!",
    userInfo:{},
    hasUserInfo:false,
    canIuseGetUserProfile:false

  },

  // 获取用户信息
  getUserProfile(e){
    wx.getUserProfile({
      desc: '用于用户登录',
      success: (res) => {
        this.setData({
          userInfo:res.userInfo,
          hasUserInfo:true
        }),
        console.log(res)
      }
    })
  },

  toLogs(){
    wx.navigateTo({
      url: '/pages/logs/logs', 
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIuseGetUserProfile:true
      })
    }
    
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