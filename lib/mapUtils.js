/* 
 * @author yangqianfang
 * @time 2019-11-01
 * @首页地图lib
 **/
/**
 * 地图运营区域  
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据
 * @param type 1: 主运营区域，2:不可还车区域 3:网点运营区域 notreturn  不可还车区域 
 * 
 */
export function drawArea( AMap, map, data, PolygonArry, type = 1 ) {
	if ( data.length == 0 ) {
		return;
	}
	let style = {
		fillOpacity: 0.2,
		//fillColor: "#FFA500",
		strokeWeight: 2,
		strokeColor: "#ff9025"
	}
	switch ( type ) {
		case 2:
			style.fillOpacity = 0.5;
			style.strokeColor = "#000";
			style.strokeWeight = 1;
			break;
		case 3:
			style.fillOpacity = 0.2;
			style.strokeColor = "#2b9939";
			style.fillColor = "#2b9939";
			style.strokeWeight = 1;
			/* 隐藏 其他多边形*/
			PolygonArry.forEach( ( item ) => {
				item.hide();
			} );
			break;
	}
	data.forEach( ( v, k ) => {
		AMap.convertFrom( v.fence, 'gps', function( status, result ) {
			if ( result.info === 'ok' ) {
				var polygon = new AMap.Polygon( {
					map: map,
					fillOpacity: style.fillOpacity,
					path: result.locations,
					fillColor: style.fillColor,
					strokeColor: style.strokeColor,
					strokeWeight: style.strokeWeight
				} );
				if ( type == 3 ) {
					PolygonArry.push( polygon );
				}
			}
		} );
	} );
}
/**
 * 点击网点显示距离mark  
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据  
 */
function getHtml( data ) {
	let address = data.store_name ? data.store_name : data.address;
	let str = '<div style="height:60px;">';
	str += '<div style="color:#ff9025;font-size:12px;height:20px;line-height:20px;padding-left:25px; white-space:nowrap ">' + address +
		'</div>';
	str +=
		'<div style="width: 90px; height: 30px; background: url(/static/icon_33.png) no-repeat;background-size: cover;color:#fff;font-size:12px;height:30px;line-height:30px;padding-left:30px; "> 距离' +
		fromatkm(parseInt( data.dis )) + '</div>';
	str += '</div>';
	return str;
}
/* 首页 距离 marks */
export async function drawDisMarks( AMap, map, data, callback, maskArray ) {
	if ( data.length == 0 ) {
		return;
	}
	let image = "/static/icon_33.png";
	data.type = "4"; //距离详情
	gpsToamp( AMap, [ data.lng, data.lat ] ).then( ( res ) => {
		let html = getHtml( data );
		let icons = new AMap.Icon( {
			size: new AMap.Size( 106, 30 ),
			image: image,
			imageSize: new AMap.Size( 106, 30 )
		} );
		let marker = new AMap.Marker( {
			position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
			offset: new AMap.Pixel( -10, -60 ),
			icon: icons,
			zIndex: 200,
			zoom: 10,
			content: html,
			extData: {
				data: data
			}
		} );
		marker.on( "click", function( e ) {
			//callback( this.getExtData( "data" ) );
		} );
		map.add( marker );
		maskArray.push( marker );
	} )
}
/* 还车页网点详情 marks */
export function drawInfoWindow( AMap, map, data ) {
	let html = '';
	html += "<div >";
	html +=
		"<div style='height:30px;line-height:30px;color:#000;font-size:12px;background:#fff;border-radius:15px;padding:0 15px'>" +
		data.address + "</div>";
	html +=
		"<div style='position:absolute;bottom: 0;left: 50%;margin-left: -8px;border-left: 8px solid transparent;border-right: 8px solid transparent;border-top: 8px solid #fff;'></div>";
	html += "</div>";
	let infoWindow = new AMap.InfoWindow( {
		anchor: 'bottom-center',
		isCustom: true,
		content: html,
		offset: new AMap.Pixel( 0, -25 )
	} );
	infoWindow.open( map, data.amplocation );
	return infoWindow;
}
/**
 * 附近网点渲染  
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据  
 */
export function drawStoreMarks( AMap, map, data, callback, maskArray ) {
	if ( data.length == 0 ) {
		return;
	}
	let iconList = [ "/static/store_0.png", "/static/store_1.png", "/static/store_2.png", "/static/store_3.png",
		"/static/store_4.png", "/static/store_5.png", "/static/store_more.png"
	];
	data.forEach( ( v, k ) => {
		v.type = "1";
		gpsToamp( AMap, [ v.lng, v.lat ] ).then( ( res ) => {
			v.amplocation = [ res[ 0 ], res[ 1 ] ]
			let icons = new AMap.Icon( {
				size: new AMap.Size( 40, 48 ),
				image: v.car_cnt < 6 ? iconList[ v.car_cnt ] : iconList[ 6 ],
				imageSize: new AMap.Size( 40, 48 )
			} );
			let marker = new AMap.Marker( {
				position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
				offset: new AMap.Pixel( -20, -48 ),
				icon: icons,
				zIndex: 500,
				title: v.store_name,
				extData: {
					data: v
				},
				zoom: 13
			} );
			marker.on( "click", function( e ) {
				callback( this.getExtData( "data" ), marker );
			} );
			map.add( marker )
			maskArray.push( marker );
		} );
	} );
}
/**
 * 附近送车点渲染  
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据  
 */
export async function drawPointMarks( AMap, map, data, callback, maskArray ) {
	if ( data.length == 0 ) {
		return;
	}
	let image = "/static/point_1.png";
	data.forEach( ( v, k ) => {
		v.type = "0";
		gpsToamp( AMap, [ v.lng, v.lat ] ).then( ( res ) => {
			v.amplocation = [ res[ 0 ], res[ 1 ] ]
			let icons = new AMap.Icon( {
				size: new AMap.Size( 40, 48 ),
				image: image,
				imageSize: new AMap.Size( 40, 48 )
			} );
			let marker = new AMap.Marker( {
				position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
				offset: new AMap.Pixel( -20, -48 ),
				icon: icons,
				zIndex: 500,
				title: v.address,
				zoom: 13,
				extData: {
					data: v
				}
			} );
			marker.on( "click", function( e ) {
				callback( this.getExtData( "data" ) );
			} );
			map.add( marker );
			maskArray.push( marker );
		} )
	} );
}
/**
 * 附近汽车点 
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据  
 */
export function drawCarMarks( AMap, map, data, callback, maskArray ) {
	if ( data.length == 0 ) {
		return;
	}
	let image = "/static/cart_01.png";
	data.forEach( ( v, k ) => {
		v.type = "3";
		gpsToamp( AMap, [ v.lng, v.lat ] ).then( ( res ) => {
			v.amplocation = [ res[ 0 ], res[ 1 ] ]
			let icons = new AMap.Icon( {
				size: new AMap.Size( 16, 30 ),
				image: image,
				imageSize: new AMap.Size( 16, 30 )
			} );
			let marker = new AMap.Marker( {
				position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
				offset: new AMap.Pixel( -5, -30 ),
				icon: icons,
				title: v.address,
				zoom: 13,
				extData: {
					data: v
				}
			} );
			marker.on( "click", function( e ) {
				callback( this.getExtData( "data" ) );
			} );
			map.add( marker );
			maskArray.push( marker );
		} );
	} );
}
/**
 * 附近停车点 
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * @param {object} data  数据  
 */
export function drawStopStoreMarks( AMap, map, data, callback, maskArray ) {
	if ( data.length == 0 ) {
		return;
	}
	let image = "/static/store_stop.png";
	data.forEach( ( v, k ) => {
		v.type = "4"; //还车点前端自定义
		gpsToamp( AMap, [ v.lng, v.lat ] ).then( ( res ) => {
			v.amplocation = [ res[ 0 ], res[ 1 ] ]
			let icons = new AMap.Icon( {
				size: new AMap.Size( 40, 48 ),
				image: image,
				imageSize: new AMap.Size( 40, 48 )
			} );
			let marker = new AMap.Marker( {
				position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
				offset: new AMap.Pixel( -20, -24 ),
				icon: icons,
				title: v.address,
				zoom: 13,
				extData: {
					data: v
				}
			} );
			marker.on( "click", function( e ) {
				callback( this.getExtData( "data" ) );
			} );
			map.add( marker );
			maskArray.push( marker );
		} );
	} );
}

function getDisData( AMap, data, location ) {
	var allArry = data.point.concat( data.store ),
		newArry = [];
	allArry.forEach( ( v, k ) => {
		let np = new Promise( resolve => {
			AMap.convertFrom( [ v.lng, v.lat ], 'gps', function( status, result ) {
				if ( result.info === 'ok' ) {
					let lgnlat = result.locations[ 0 ];
					var p2 = [ lgnlat.lng, lgnlat.lat ];
					var dis = AMap.GeometryUtil.distance( location, p2 );
					resolve( {
						dis: dis,
						data: v
					} )
				}
			} );
		} )
		newArry.push( np );
	} )
	return newArry;
}

function getMin( data ) {
	let min = data[ 0 ].dis,
		node;
	data.map( item => {
		if ( parseInt( item.dis ) <= parseInt( min ) ) {
			min = item.dis;
			node = item;
		}
	} );
	return node;
}
/**
 * 计算离自己最近的网点 送车点 距离 
 * @param {object} AMap AMap对象
 * @param {object} data  
 * @param {object} location  数据  
 * @param {function } 回调
 */
export function getMinDistance( AMap, data, location, callback ) {
	let allp = getDisData( AMap, data, location );
	Promise.all( allp ).then( ( res ) => {
		var res = getMin( res ); //最近网点数据  
		callback( res ); //调用点击网点获取数据
	} ).catch( ( error ) => {} )
}
/* 
  formatData("2018-05-28 23:24:12") 
  return 时间戳
 */
export function formatData( strtime ) {
	var date = new Date( strtime.replace( /-/g, '/' ) );
	return Date.parse( date ) / 1000;
}
/*
  gps 转高德 坐标 
  AMap :[]
  return promise
 */
export function gpsToamp( AMap, lnglatarr ) {
	return new Promise( resolve => {
		AMap.convertFrom( lnglatarr, 'gps', function( status, result ) {
			if ( result.info === 'ok' ) {
				let lgnlat = result.locations[ 0 ];
				resolve( [ lgnlat.lng, lgnlat.lat ] )
			}
		} );
	} )
}
/*
  根据坐标找到地址标 
  AMap 
  lnglat
 */
export function getAddressByLnglat( AMap, lnglat ) {
	return new Promise( resolve => {
		var geocoder = new AMap.Geocoder();
		geocoder.getAddress( lnglat, function( status, result ) {
			if ( status === 'complete' && result.regeocode ) {
				var address = result.regeocode.formattedAddress;
				resolve( address )
			} else {
				console.log( '根据经纬度查询地址失败' )
			}
		} );
	} )
}
/*
  步行路线
  start:[],
  end : []
 */
export async function drawWalkLine( AMap, map, start, end ) {
	return new Promise( resolve => {
		AMap.plugin( 'AMap.Walking', () => {
			let walking = new AMap.Walking( {
				map: map,
				hideMarkers: true
			} );
			walking.search( new AMap.LngLat( ...start ), new AMap.LngLat( ...end ), function( status, result ) {} );
			resolve( walking );
		} );
	} )
}
/*
  骑行路线
  start:[],
  end : []
 */
export async function drawRidingLine( AMap, map, start, end ) {
	return new Promise( resolve => {
		AMap.plugin( 'AMap.Riding', () => {
			let riding = new AMap.Riding( {
				map: map,
				hideMarkers: true
			} );
			riding.search( new AMap.LngLat( ...start ), new AMap.LngLat( ...end ), function( status, result ) {} );
			resolve( riding );
		} );
	} )
}
/*
  驾车路线
  start:[],
  end : []
 */
export async function drawDrivingLine( AMap, map, start, end, hideMarkers = true ) {
	return new Promise( resolve => {
		AMap.plugin( 'AMap.Driving', () => {
			let driving = new AMap.Driving( {
				map: map,
				hideMarkers: hideMarkers
			} );
			driving.search( new AMap.LngLat( ...start ), new AMap.LngLat( ...end ), function( status, result ) {} );
			resolve( driving );
		} );
	} )
}
/*
 15分钟内
 计算订单结束时间
 */
export function getLastTime( start ) {
	/* 	var nowTime = parseInt( new Date().getTime() / 1000 );
		let min = Math.round( Math.round( ( nowTime - start ) / 60 ) );
		console.log(); */
	return Math.round( start / 60 ).toString();
}
/**
 * 运维人员，汽车 终点  marks  
 * @param {object} AMap AMap对象
 * @param {object} map  map对象
 * type 0 配送员图标 1汽车图标，2 终点图标
 * @param {object} data  坐标 []  
 */
export async function drawMarks( AMap, map, data, type = 0, maskArray = [] ) {
	if ( data.length == 0 ) {
		return;
	}
	let image = [ {
		size: [ 30, 30 ],
		pixe: [ -15, -15 ],
		image: "/static/icon_25.png"
	}, {
		size: [ 40, 40 ],
		pixe: [ -20, -20 ],
		image: "/static/icon_26.png"
	}, {
		size: [ 20, 29 ],
		pixe: [ -10, -15 ],
		image: "/static/icon_27.png"
	} ];
	let img = image[ type ];
	gpsToamp( AMap, data ).then( ( res ) => {
		let icons = new AMap.Icon( {
			size: new AMap.Size( img.size[ 0 ], img.size[ 1 ] ),
			image: img.image,
			imageSize: new AMap.Size( img.size[ 0 ], img.size[ 1 ] )
		} );
		let marker = new AMap.Marker( {
			position: new AMap.LngLat( res[ 0 ], res[ 1 ] ),
			offset: new AMap.Pixel( -13, -19 ),
			icon: icons,
			zoom: 13,
		} );
		map.add( marker );
		maskArray.push( marker );
	} )
}
/**
 获取定位信息
 */
export function getLocal( AMap, map ) {
	return new Promise( resolve => {
		AMap.plugin( 'AMap.Geolocation', () => {
			let geolocation = new AMap.Geolocation( {
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：5s
				buttonPosition: 'RB', //定位按钮的停靠位置
				buttonOffset: new AMap.Pixel( 10, 20 ), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点		
			} );
			map.addControl( geolocation );
			geolocation.getCurrentPosition( ( status, result ) => {
				if ( status == 'complete' ) {
					resolve( result ); 
				} else {
					console.log( "定位失败" )
				}
			} );
		} )
	} );
}
/**
 获取送达
 */
export function getSendArrvedTime( time ) {
	return parseInt( time / 60 );
}

function addZoo( n ) {
	return n.toString().length == 1 ? "0" + n : n;
}
/* 两个时间相差多久
 start end :时间戳 秒
 */
export function timeDiff( start, end ) {
	let lasttime = end - start,
		str = "";
	var days = Math.floor( lasttime / ( 24 * 3600 * 1000 ) )
	//计算出小时数 
	var leave1 = lasttime % ( 24 * 3600 )
	var hours = Math.floor( leave1 / ( 3600 ) )
	//计算相差分钟数
	var leave2 = leave1 % ( 3600 )
	var minutes = Math.floor( leave2 / ( 60 ) )
	//计算相差秒数
	var leave3 = leave2 % ( 60 )
	var seconds = Math.round( leave3 );
	if ( days > 0 ) {
		str += days + "天";
	}

	str += addZoo( hours ) + ":" + addZoo( minutes ) + ":" + addZoo( seconds );
	 
	return str;
}

/*  
获取固定数据条数
data: 数据列表 limit: 返回数据条数
*/
export function getLimitData( data, limit ) {
	if ( data.length <= limit ) {
		return data
	} else {
		return data.slice( 0, limit )
	}
}

/* 格式化区域数组 */
export function getFence( fence ) {
	return fence.map( ( item ) => {
		return [ item.lng, item.lat ]
	} );
}

/*  
判断点是否在多变性能内部
 point, path 
*/
export function isPointInRing( AMap, point, path ) {
	return AMap.GeometryUtil.isPointInRing( point, path );
}

/* 地图两点之间距离 */
export function getDistance( AMap, start,end) {
	return AMap.GeometryUtil.distance( start, end );
}

/* 格式化距离 m -> km */
export function fromatkm( m ) {	  
	 if(m < 1000){
		 return  m + "m"; 
	 } else if(m > 1000){
		 return (Math.round(m/100)/10).toFixed(1) + "km"
	 }
	  
}


/* 
处理区域数据
data : 
[
	{
		fence:[lng,lat]
	}
]

 return :
 [
	 [lng,lat],
	 [lng,lat]
 ]
 */
export function formatFence (AMap,data) { 
	var arr = [];
	data.forEach(function(v,k){
		let s =[] 
		v.fence.forEach(function(v1,k1){ 
			s.push([v1.lng,v1.lat])
		});
		arr.push(s)
	}); 	
	return arr; 
} 

/* 地图 点是否在某些区域内 */
export function checkPointInPolygon(AMap,point,path){
	return AMap.GeometryUtil.isPointInPolygon(point,path);
}
	 
/* 
let s = formatFence(value.area);
// AMap.GeometryUtil.isPointInPolygon(point,path);
this.AMap.convertFrom( lnglatarr, 'gps', function( status, result ) {
if ( result.info === 'ok' ) {
	let lgnlat = result.locations[ 0 ];
	resolve( [ lgnlat.lng, lgnlat.lat ] )
}
} ); */
