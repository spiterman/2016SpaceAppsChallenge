var julianStart = 2451545;
var julianStop = 2457135;

var clock = new Cesium.Clock({
  startTime: new Cesium.JulianDate(julianStart),
  stopTime: new Cesium.JulianDate(julianStop),
  multiplier: 1,
  clockRange: Cesium.ClockRange.LOOP_STOP
});
var viewer = new Cesium.Viewer('cesiumContainer', {
  clock: clock
});
var currentInterval;

var intervals = [];
for(var i = julianStart; i <= julianStop; i += 365){
  intervals.push(new Cesium.TimeInterval({
    start: new Cesium.JulianDate(i),
    stop: new Cesium.JulianDate(i + 365),
    isStartIncluded: true,
    isStopIncluded: false,
    data: i
  }));
}
var intervalCollection = new Cesium.TimeIntervalCollection(intervals);


var redCircle = function(long,lat,pop,size,name) {
   return {
     position: Cesium.Cartesian3.fromDegrees(long, lat),
     name : pop,
     ellipse : {
       semiMinorAxis : size,
       semiMajorAxis : size,
       height: 200000.0,
       material : Cesium.Color.RED.withAlpha(0.5)
     },
     label: {
      
     }
   };
};

var circleMaker = function(objArr) {
 var popArr = [], long, lat, pop, size, name; 
 for(var i = 0; i < objArr.length; i++) {
  if(!objArr[i].long){
    continue;
  }
   pop = objArr[i].population;
   long = objArr[i].long;
   lat = objArr[i].lat;
   size = sizer(pop);
   name = objArr[i].name;
   popArr.push(viewer.entities.add(redCircle(long, lat, pop, size)));
 }
 return popArr;
};

var sizer = function(pop) {
 var popLimit = 100000000, base = 100000;
 return size = (pop/popLimit) * base;
};

var updateMap = function(e){
  var interval = intervalCollection.findIntervalContainingDate(viewer.clock.currentTime);
  if(!(interval === currentInterval)){
    viewer.entities.removeAll();
    currentInterval = interval;
    $.ajax({
      url: '/data/population?year=2009',
      success: function(res){
        viewer.entities.add(circleMaker(res));
      }
    });
  }
};
viewer.clock.onTick.addEventListener(updateMap); 

