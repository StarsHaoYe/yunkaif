// pages/shouye/shouye.js
import * as echarts from '../../ec-canvas/echarts';//画图工具引入
const aliSdk = require("../../utils/aliIot-sdk.js")//阿里云调用
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');//引入SDK核心类----map
var qqmapsdk = new QQMapWX({key:'6OLBZ-JPD64-7GJUT-XWAB5-H3ONT-5HFLX'});// 实例化API核心类-----map
const app = getApp()
var productKey=app.globalData.productKey;
var deviceName= app.globalData.deviceName;
var Time=[];
var Tem_h=[];
var Humid_h=[];
var CO2_h=[];
var Id_set=["PM25","CurrentTemperature","RelativeHumidity"];//画图用
var Chart1=null;
var option1={}; 
//获取当前时间戳  
var timestart= Date.parse(new Date());
var timeEnd = timestart - 30*24*60*60*1000  //30天后的时间戳
//Unix时间戳转化为北京时间
function toDate1(number) {
  var date = new Date(number);
  var Y = date.getFullYear() + '.';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())+'  ';
  var H = (date.getHours() < 10 ? '0' + date.getHours() : +date.getHours())+':';
  var Minu =(date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes());
  var S =(date.getSeconds() < 10 ? '0' + date.getSeconds():date.getSeconds())+'.';
  var SM =date.getMilliseconds() < 10 ? '0' + date.getMilliseconds():date.getMilliseconds();
  return ( Y+M+D+H+Minu)
  }
  function toDate(number) {
    var date = new Date(number);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())+' ';
    var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())+':';
    var Minu =(date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes());
    var S =(date.getSeconds() < 10 ? '0' + date.getSeconds():date.getSeconds())+'.';
    var SM =date.getMilliseconds() < 10 ? '0' + date.getMilliseconds():date.getMilliseconds();
    return ( H+Minu)
    }
Page({
  data: {    
    GPS:"暂无位置信息",//设备数据
    Temp: "--",
    Humidity: "--",
    co2: "--",
    PM2_5: "--",
    latitu: "--",
    longitu: "--",
    ltime: "--", //实时时间
    //下面三个数据有关下拉刷新
    bgTextStyle: 'dark',
    //scrollTop: undefined,
    //nbLoading: false, 
    ec1: {
      lazyLoad: true // 延迟加载
    },
    //导航栏
    select: 0,
    height: 0,
    sortList: [{
        name: app.globalData.deviceName
      },
      {
        name:  app.globalData1.deviceName
      },
    ],
  },
  //下拉刷新 待修改！ 
  /*setTimeout(() => {
      this.setData({
        bgTextStyle: 'dark',
        //nbLoading: true,
      })
    }, */
    upper(e) {
      console.log(e)
    },
    lower(e) {
      console.log(e)
    },
    scroll(e) {
      console.log(e)
    },
    scrollToTop() {
      this.setAction({
        scrollTop: 0
      })
    },
  onLoad() {
    this.echartsComponnet1 = this.selectComponent('#mychart1');//画图
    //this.echartsComponnet2 = this.selectComponent('#mychart2');
   // this.watchHeight();//watch  swiper高度
    (async ()=>{
      let temp_h=[];//临时变量 
      for(var i=0;i<3;i++){
      var Id=Id_set[i];
      switch(i) {
        case 0:temp_h=CO2_h;break;   
        case 1:temp_h=Tem_h;break;
        case 2:temp_h=Humid_h;break; 
      }     
      await this.getHistroyData(Id, temp_h);
      } ;
      this.loadData();//页面显示设备当前值     
   })()
  },
    /**
   * 生命周期函数--监听页面显示
   */
onShow: function () {
  
},
// 触发tab导航栏
activeTab: function(e) {
  this.setData({
    select: e.currentTarget.dataset.index,
  })
  this.generalEv()
  this.watchHeight()
},
// 滑动swiper
activeSw:function(e) {
  var index=e.detail.current
  this.setData({
    select: index
  })
  this.setKeyName(index);
  this.generalEv()
  this.watchHeight()
},
// 监听swiper高度
watchHeight() {
  var query = wx.createSelectorQuery()
  query.select('.box').boundingClientRect((res) => {
    this.setData({
      height: parseInt(res.height)
    })
  }).exec()
},
// 初始化值
generalEv() { 
 // 回到顶部
  wx.pageScrollTo({
    scrollTop: 0
  })
},
//设置productkey和devicename
setKeyName: function(number){
  if(number=='0'){
    productKey=app.globalData.productKey,
    deviceName= app.globalData.deviceName
  }
  if(number=='1'){
    productKey=app.globalData1.productKey,
    deviceName= app.globalData1.deviceName
  }
},
 /**
   * 页面上拉触底事件的处理函数
   */
onReachBottom: function () {
  this.watchHeight()
},
//获取设备当前值
loadData: function () {
  var that = this
  aliSdk.request({
      Action: "QueryDevicePropertyStatus",
      ProductKey: productKey,
      DeviceName: deviceName
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
  var gps   //接收GPS的转换数据
  if (infos) {
    var gpsdata={lati:0.000000,long:0.000000}
    var propertys = that.convertPropertyStatusInfo(infos)
    this.gps_convert1(propertys.GeoLocation,gpsdata)
    var latitude=gpsdata.lati
    var longitude=gpsdata.long
    qqmapsdk.reverseGeocoder({//SDK调用
      location: { latitude,longitude },
      get_poi: 1,
      poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
      success: function (res) {
      console.log(res)
      gps=res.result.address
     
      that.setData({
        GPS:gps,
        Temp: propertys.CurrentTemperature,
        Humidity: propertys.RelativeHumidity,
        co2: propertys.co2,
        PM2_5: propertys.PM25,
        latitu: latitude,
        longitu:longitude,
        ltime:toDate1(timestart)
      })}
    })
  } else {
    that.setData({
      Temp: "--",
      Humidity: "--",
      co2:"--",
      PM2_5: "--",
      GPS:"无法获取位置信息",
      latitu: "--",
      longitu: "--",
      ltime: "--", //实时时间
    })}
},
//gps位置转换
gps_convert1:function(infos,gpstemp){
  let j 
  let count=35
  if(infos[13]=='.'){
    if(infos[20-1]==','){
      count=count-1}
    if(infos[count-1]=='.'){j=0}
    else if(infos[count]=='.'){j=1}
    else if(infos[count+1]=='.'){j=2}
    gpstemp.lati=this.gps_convert2(infos,12,0)
    gpstemp.long=this.gps_convert2(infos,count-2,j)
  }
  else if(infos[14]=='.'){
    if(infos[20]==','){
      count=count-1}
    if(infos[count]=='.'){j=0}
    else if(infos[count+1]=='.'){j=1}
    else if(infos[count+2]=='.'){j=2}
    gpstemp.lati=this.gps_convert2(infos,12,1)
    gpstemp.long=this.gps_convert2(infos,count-1,j)
  }
},
//GPS位置转换辅助函数
gps_convert2:function(infos,n,j){  
  var gtemp=0
  let i,m=j
  for(i=n;i<(n+8+m);i++){
    if(i!=(n+1+m)&& infos[i]!=',' ){
      gtemp=gtemp+infos[i]*(Math.pow(10,j));
      j--
    }}; return gtemp;
},
//将返回结果转成key,value的json格式方便使用
convertPropertyStatusInfo: function (infos) {
  var data = {}
  infos.forEach((item) => {
    data[item.Identifier] = item.Value ? item.Value : null
  })
  return data
},
//调用历史数据
getHistroyData: function (Id,temp_h){
  aliSdk.request({
      Action: "QueryDevicePropertyData",
      ProductKey: productKey,
      DeviceName: deviceName,
      Identifier:Id,
      StartTime:timeEnd,
      EndTime:timestart,
      PageSize:50,
      Asc:1
    },
    {method: "POST"},        
    (res) => {
      console.log("success2")
      console.log(res) //查看返回response数据
      if (res.data.Code) {
        wx.showToast({title: '设备连接失败',icon: 'none', duration: 1000,complete: () => {}})
        temp_h=null
      } 
      else {   
        for(var i=0;i<res.data.Data.List.PropertyInfo.length;i++){
          temp_h[i]=res.data.Data.List.PropertyInfo[i].Value*1  //获取设备历史数据  
          if(temp_h==Humid_h){Time[i]=toDate(res.data.Data.List.PropertyInfo[i].Time*1); }//时间获取              
        } 
        console.log(temp_h)
        if(temp_h==Humid_h){console.log(Time),this.loadChart()}  //加载图像    
      }
    },
    (_res) => {
      console.log("fail")      
      wx.showToast({ title: '网络连接失败', icon: 'none',duration: 1000,complete: () => {}})
      temp_h=null    },
    (_res) => {console.log("complete2")}
    )
},
//图像加载函数
loadChart: function(){
  option1 = {
    canvasId: 'columnCanvas',
    type: 'column',
    title: {
      text:'历史数据显示',
      left: 'center'
    },
   /* dataZoom: [{
      type: 'slider', //图表下方的伸缩条
      realtime: true
    }],*/
    color: ['#FFB228', '#FD6767',"#37A2DA"],
    legend: {
      data: ['温度','湿度','CO2'],   
      left: 'center',
      backgroundColor: '#dbdbdb',
      z: 100
    },
   tooltip: {
      show: true,
      trigger: 'axis'
    }, 
   // grid: { containLabel: true},    
      xAxis: {
        data: [Time],
        type: 'category',
        boundaryGap: false,
      },
      /*yAxis: {
        disableGrid: false,
        gridColor: "#ffffff",
        fontColor: "#ffffff",
        min: 0,
        max: 600,
        disabled: true,
        fontColor: "#ff6700"
      },*/
      yAxis: { name: '值',
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        //设置y轴字体样式
        /*axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
            fontSize: '14',
          }
        },*/
        show: true
      },
      series:[{
        name: '温度',
        type: 'line',
        smooth: true,
        data: Tem_h
      },{
        name: '湿度',
        type: 'line',
        smooth: true,
        data: Humid_h
      },{
        name: 'CO2',
        type: 'line',
        smooth: true,
        data: CO2_h
      }]
  };
  if (!Chart1){
    this.init_echarts1(); //初始化图表
  }else{
    this.setOption(Chart1); //更新数据
  }
},
//初始化图表
init_echarts1: function () {
  this.echartsComponnet1.init((canvas, width, height,dpr) => {
    Chart1 = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    Chart1.setOption(option1);
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return Chart1;
  });
},
//图像---更新数据
setOption: function (Chart) {
  Chart.clear(); 
  Chart.setOption(option1);  //获取新数据
},
/*init_echarts2: function () {
  this.echartsComponnet1.init((canvas, width, height) => {
    Chart1 = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    Chart1.setOption(option2);
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return Chart2;
  });
},*/

/**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  pageScroll: function () {
   
  },

  onPullDownRefresh() {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

})
