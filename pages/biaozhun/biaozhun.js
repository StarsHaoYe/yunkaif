// pages/biaozhun/biaozhun.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {value: 'CHN', name: '中国', checked: 'true'},
      {value: 'USA', name: '美国', checked: 'false'},
      {value: 'EU', name: '欧盟', checked: 'false'},
      {value: 'FRE', name: '自定义', checked: 'false'}
    ]
  },

  radioChange(e) {
    const checked = e.detail.value
    const changed = {}
    for (let i = 0; i < this.data.items.length; i++) {
      if (checked.indexOf(this.data.items[i].name) !== -1) {
        changed['items[' + i + '].checked'] = true
      } else {
        changed['items[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    
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