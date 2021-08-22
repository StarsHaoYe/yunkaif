// pages/shouye/shouye.js
import * as echarts from '../../ec-canvas/echarts';
const aliSdk = require("../../utils/aliIot-sdk.js")
const app = getApp()
//引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'6OLBZ-JPD64-7GJUT-XWAB5-H3ONT-5HFLX'
});
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    title: {
      left: 'center'
    },
    color: ["#37A2DA"],
    legend: {
      data: ['A','B'],
      top: 20,
      left: 'center',
      backgroundColor: '#dbdbdb',
      z: 100
    },
    grid: {
        left: 0,//折线图距离左边距
        right: 50,//折线图距离右边距
        top: 30,//折线图距离上边距
        bottom: 10,
        containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: app.globalData.Temp_h,
      // show: false
      axisLabel: {
        interval: 0,
        rotate: 90, // 90度角倾斜显示
        textStyle: {
          color: '#00c5d7'
        }
      },
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    dataZoom: [{
      type: 'slider', //图表下方的伸缩条
      realtime: true
    }],
/*
      // axisTick: {
      //   alignWithLabel:false
      // },
      // axisLine: {
      //   lineStyle: {
      //     color: '#666666'
      //   }
      // },
      //设置x轴的样式
      axisLabel: {
        //横坐标最后的标注颜色变深
        // interval: 0,
        show: true,
        textStyle: {
          color: '#000',
          fontSize: '14',
        }
      },
      show: true
    },
    yAxis: {
      name: '值',
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'solid'
        }
      },
      //设置y轴字体样式
      axisLabel: {
        show: true,
        textStyle: {
          color: '#000',
          fontSize: '14',
        }
      },
      show: true
    },*/
    /*series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [-50,-18, 45, 65, 30, 78, 40, 0]
    },{
        name: 'B',
        type: 'line',
        smooth: true,
        data: [-26, -12, 40, 56, 85, 65, 20, 10]
      }]*/
  };
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    GPS:"暂无位置信息",
    Temp: "--",
    Humidity: "--",
    co2: "--",
    PM10: "--",
    level:"优",
    tips:"大自然的每一个领域都是美妙绝伦的。————亚里士多德",
    //下面三个数据有关下拉刷新
    bgTextStyle: 'dark',
    scrollTop: undefined,
    nbLoading: false, 
    ec: {
      onInit: initChart
    }
  },
  //下拉刷新 待修改！
  onLoad() {
    var math = '$$ CO_2 $$'
    let result = app.towxml(math, 'markdown', {
      base: 'http://towxml.vvadd.com/?tex', // 相对资源的base路径
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
    this.loadData();
    this.loadData_history()
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
      } 
      else {
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
  var gps
  if (infos) {
    var gpsdata={lati:0.000000,long:0.000000}
    var propertys = that.convertPropertyStatusInfo(infos)
    this.gps_convert1(propertys.GeoLocation,gpsdata)
    var latitude=gpsdata.lati
    var longitude=gpsdata.long
    qqmapsdk.reverseGeocoder({//SDK调用
      location: { latitude, longitude },
      get_poi: 1,
      poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
      success: function (res) {
      console.log(res)
      gps=res.result.address
      that.setData({
        GPS:gps,
        Temp: propertys.IndoorTemperature,
        Humidity: propertys.CurrentHumidity,
        co2: propertys.data,
      })      
     }
    })
  } else {
    that.setData({
      Temp: "--",
      Humidity: "--",
      co2: "--",
      GPS:"无法获取位置信息"
    })
  }
},
//gps位置转换
gps_convert1:function(infos,gpstemp){
  let j
  if(infos[13]=='.'){
    if(infos[34]=='.'){j=0}
    else if(infos[35]=='.'){j=1}
    else if(infos[36]=='.'){j=2}
    gpstemp.lati=this.gps_convert2(infos,12,0)
    gpstemp.long=this.gps_convert2(infos,33,j)
  }
  else if(infos[14]=='.'){
    if(infos[35]=='.'){j=0}
    else if(infos[36]=='.'){j=1}
    else if(infos[37]=='.'){j=2}
    gpstemp.lati=this.gps_convert2(infos,12,1)
    gpstemp.long=this.gps_convert2(infos,34,j)
  }
},
//GPS位置转换辅助函数
gps_convert2:function(infos,n,j){  
  var gtemp=0
  let i,m=j
  for(i=n;i<(n+8+m);i++){
    if(i!=(n+1+m)){
      gtemp=gtemp+infos[i]*(Math.pow(10,j));
      j--
    } 
  };
  return gtemp;
},
//将返回结果转成key,value的json格式方便使用
convertPropertyStatusInfo: function (infos) {
  var data = {}
  infos.forEach((item) => {
    data[item.Identifier] = item.Value ? item.Value : null
  })
  return data
},
//历史数据QueryDevicePropertyData
/*StartTime=1516538300303,
      EndTime=1516541900303,
      PageSize=10,
      Asc=1
      lastActiveTime=1629280811872
      */
loadData_history: function () {
  var that = this
  aliSdk.request({
      Action: "QueryDevicePropertyData",
      ProductKey: app.globalData.productKey,
      DeviceName: "test01",
      Identifier:"室内温度",
      StartTime:1600724610402,
      EndTime:1618551096876,
      PageSize:10,
      Asc:1
    }, {
      method: "POST"
    },
    (res) => {
      console.log("success2")
      console.log(res) //查看返回response数据
      if (res.data.Code) {
        console.log("eeee")
        wx.showToast({
          title: '设备连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
       // that.setPropertyData(null)
      } 
      else {
        for (var i = 0; i < res.data.Data.List.PropertyInfo.length; i++) {
          //将数据库的数据 遍历到每个对应的数组中 
          app.globalData.Temp_h[i] = res.data.Data.List.PropertyInfo[i].IndoorTemperature
        }  
        console.log(res.data.Data.List.PropertyInfo)
        console.log(app.globalData.Temp_h)
        console.log("7777")
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
     // this.setPropertyData(null)
    },
    (_res) => {
      console.log("complete2")
    })
},
/*跳动到某个位置  以下皆是
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
  onPullDownRefresh() {},*/

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
