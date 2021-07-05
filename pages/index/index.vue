<template>
	<view class="wrap">
		<view class="loadingMask"
		 v-if="loadingMask"></view>
		<topbar :localCityName="localCityName"
		:cityname = "cityName"
		:citylist = "cityList"
		 @getCityInfo="changeCity"
		 @switchDrawer="switchDrawer"></topbar>
		<view class="map-wrap"
		 :style="{height:mapHeight}">
			<view class="map"
			 id="amapContainer"></view>
			<view class="map-center-wrap"
			 v-show="showCenterIcon">
				<view class="map-content-text "
				 :class="centerIconText?'':'map-content-text-active'">在此用车</view>
				<view class="map-center-icon"></view>
			</view>
		</view>
		<view class="plan-order" @tap="gotoPlanList"  v-if="planOrder && planOrder.plan_cnt > 0">您有{{planOrder.plan_cnt}}个预约订单</view>
		<!-- <view class="testbox">
				<navigator url="../unlockcar/unlockcar">开锁用车</navigator>
			</view> -->
		<!-- status-01 start  -->
		<!-- <searchbar @switchDrawer="switchDrawer"></searchbar> -->
		<!-- status-01 end  -->
		<!-- index panel-->
		<index-panel v-show="locationData"
		 ref="indexPanel"
		 :listData="listdata"
		 :cityInfo="cityInfo"
		 :startAddressTextValue="startAddressTextValue"
		 :startAddressLngLat="startAddressLngLat"
		 :endAddressTextValue="endAddressTextValue"
		 :status="driveValidState"
		 :currentStore="currentStore"
		 :location="locationData"
		 :mapCenterData="mapCenterData"
		 :ampa="AMap"
		 :endAddressLngLat="endAddressLngLat"
		 @removeEndAddress="removeEndAddress"
		 @switchShowOrder="switchShowOrder"
		 @removeDriving="removeDriving"
		 @validDriveState="validDriveState"
		 @getYuyueCarList="getYuyueCarList"
		 @getNowCarList="getNowCarList"
		 @switchShowCheck="switchShowCheck"
		 @switchShowFace="switchShowFace"
		 @getPlanOrder = "getPlanOrder"></index-panel>
		<!-- 车辆解锁 -->
		<!-- <unlockPanel class="none" @isShowCheck="switchShowCheck"></unlockPanel> -->
		<!-- 认证驾驶证 layer-->
		<layer-check :visible="isShowCheck"
		 @close="switchShowCheck"
		 :status="driveValidState"></layer-check>
		<!-- 人脸识别 layer-->
		<layer-face :visible="isShowFace"
		 @close="switchShowFace"></layer-face>
		<!--  订单确认 layer-->
		<!-- <layer-order :visible="isShowOrder" @close="switchShowOrder"></layer-order> -->
		<!-- <button class="location" hover-class="active-local"></button>
		<button class="loca-fresh" hover-class="active-local"></button> -->
	</view>
</template>
<script>
	import layerCheck from './layer-cover/layer-check.vue';
	import layerOrder from './layer-cover/layer-order.vue';
	import layerFace from './layer-cover/layer-face.vue';
	// import indexPanel from './index-page/index-panel.vue'; 
	import topbar from './index-page/top-bar.vue';
	import coordtransform from 'coordtransform';
	import { mapState } from 'vuex'; 
	import {
		getCityinfo,
		getNearbyList,
		getCarlist,
		getCity
	} from '@/api/index';
	import {
		localStorageKey
	} from '@/lib/base';
	import {
		drawArea,
		getLocal,
		drawDrivingLine,
		drawStoreMarks,
		drawPointMarks,
		removeMarks,
		drawCarMarks,
		getMinDistance,
		getGpsLanlat,
		gpsToamp,
		getAddressByLnglat,
		drawDisMarks,
		getLimitData,
		isPointInRing,
		getFence,
		getDistance,
		formatFence,
		checkPointInPolygon
	} from '@/lib/mapUtils';
	import {
		getOrdrData,
		getOpsInfo
	} from '@/api/pickcar';
	import {
		bindBodyEvent,
		removeBodyEvent
	} from '@/lib/utils';
	let app = null
	export default {
		components: {
			layerCheck,
			layerOrder,
			layerFace,
			// indexPanel, 
			topbar,
			'index-panel': () => import( './index-page/index-panel' ) //异步组件，仅h5支持
		},
		data() {
			return {
				cityName: '',
				localCityName:"定位中...",
				showCenterIcon: false,
				centerIconText: true,
				loadingMask: true,
				mapHeight: "100%",
				map: "",
				AMap: null,
				isShowCheck: false, //驾驶证认证 
				isShowOrder: false, //确认订单
				isShowFace: false, //人脸识别				 
				startAddressTextValue: "定位中...", //出发地位置名称 
				endAddressTextValue: "", // 目的地名称				
				startAddressLngLat: [], // 开始当前位置坐标
				endAddressLngLat: [], // 目的地坐标 
				mapBeforCenterData: [], //地图移动前中心坐标
				mapCenterData: [], //地图移动后中心坐标
				beforCenter: [],
				driving: null,
				walking: null,
				cityInfo: null,
				isLocal: true,
				nearList: null, //附近网点数据 
				PolygonArry: [],
				maskArray: [],
				driveValidState: 0,
				listData: {
					point_title: ""
				}, //汽车 列表数据
				carParms: {
					// 默认立即用车
				},
				currentStore: {}, //点前网点数据
				orderData: "",
				locationData: null,
				loadingnearDataLock: false,
				disMarker: [],
				storeFlushDataLnglat: [],
				pointFlushDataLnglat: [],
				carFlushDataLnglat: [],
				flush_store_distanceL: "1000",
				flush_point_distance: "300",
				flush_car_distance: "1000",
				nearby_point_limit: "3",
				nearby_store_limit: "5",
				flushTimes: 0,
				storeMask: [],
				pointMask: [],
				carMask: [],
				formatStoreData: {
					store: [],
					point: []
				},
				planOrder:"",
				intervalTime:10000,//查询订单数据间隔秒数,
				panelMaxHeigth:300,
				panelMimheigth:140,
				 cityList: [],
				 FenceArea:[]
			}
		},
		created() { 
			
		},
		computed: {
			...mapState("user",{
				information: (state) => state.information
			}),
			listdata: function() {
				return this.listData
			},
			planorder:function () {				 
				return this.planOrder
			},
			localdataCitylist:function () {
				let localdata = this.locationData 
				let citylist = this.cityList
				return {localdata,citylist}
			},
			cityinfoInformation(){
				let information = this.information
				let cityinfo = this.cityInfo   
				return {cityinfo,information}
			}
		},
		watch: { 
			//定位和城市列表信息
			localdataCitylist(value){
				if(value){
					let localdata = value.localdata
					let citylist = value.citylist;
					if(localdata && citylist.length > 0){
						let cityname = localdata.addressComponent.province
						let res = citylist.filter(item => item.cf_city == cityname );
							//列表不存在当前城市
							if(res.length == 0 ){ 
								 cityname = this.cityList[0].cf_city
							}else
							this.setMapCenterData( this.locationData.position.lng, this.locationData.position.lat );
							this.setMapBeforCenterData( this.locationData.position.lng, this.locationData.position.lat );
							this.changeCity(cityname); 
					} 
				}
			},
			cityinfoInformation(value){
					if(value && value.cityinfo && value.information){
						//执行一次
						if(!this.isbind){  
							 this.bindMovestartEvent();
							 this.bindMoveendEvent();
							 this.showcenterIcon();
							 this.validDriveState();  
							 this.getPlanOrder() 
							 this.isbind = true;
						}
						
					}
			},
			orderData( value ) {
				if ( value && value.order_info ) {
					let orderStatus = value.order_info.order_status;
					/*  订单状态（0新建，2进行中 3待支付 4已完成 103已取消） */
					switch ( orderStatus ) {
						case 0:
							this.gotoPickCar(value.order_info.order_id);
							break;
						case 2:
							this.gotoReturnCar();
							// 到用车也;
							break;
						case 3:
							// 到支付页;
							this.gotoPay( value.order_info.order_id );
							break;
					}
					/* 违约金支付 */
					if(value.pay_record_info.pay_id){
						this.gotoPay( value.pay_record_info.pay_id, 1);
					}
				}
			},
			locationData( value ) { 
				this.setStartAddressData( value.formattedAddress, [value.position.lng, value.position.lat] )				
				this.localCityName  =  value.addressComponent.province
				/* 记录初始刷新数据的坐标点 */
				this.storeFlushDataLnglat = this.pointFlushDataLnglat = this.carFlushDataLnglat = [ value.position.lng, value.position
					.lat
				];
			},
			mapCenterData( value ) {
				/* 获取画附近网点数据 */
				if ( value.length > 0 && !this.loadingnearDataLock ) {
					//this.getCarlist();
				}
			},
			cityInfo( value ) {
				!this.isLocal && this.setCenter( value.city.longitude, value.city.latitude, false ) 
				drawArea( this.AMap, this.map, value.area );
				drawArea( this.AMap, this.map, value.not_return, 2 );  
				this.flush_store_distance = value.map.flush_store_distance
				this.flush_point_distance = value.map.flush_point_distance
				this.flush_car_distance = value.map.flush_car_distance
				this.nearby_point_limit = value.map.nearby_point_limit
				this.nearby_store_limit = value.map.nearby_store_limit
				if(this.isLocal){
					this.mapMoveend();
				}
				try {
					uni.setStorageSync( localStorageKey.CITY_INFO, value );
				} catch ( e ) {}
			},
			nearList( value ) {
				if ( value ) { 
					let store = value.store,
						point = value.point,
						car = value.car;
					if ( store.length > 0 ) {
						let data = getLimitData( store, this.nearby_store_limit );
						this.drawStoreMarks( data );
						//this.drawStoreMarks();
						this.formatStoreData.store = data;
					}
					if ( point.length > 0 ) {
						let data = getLimitData( point, this.nearby_point_limit );
						this.formatStoreData.point = data;
						this.drawPointMarks( data )
					}
					if ( car.length > 0 ) {						
						this.drawCarMarks(car);
					}
					this.autoToStore()
				}
			},
			/* 有预约订单数据轮询查询订单状态 状态变化跳到相应页面*/
			planorder( value ) {
				if(value && value.plan_cnt > 0){
					this.startInteval();
				}
			},
			currentStore(value){  
				let maxh = this.panelMaxHeigth;  
				if(value && value.address){ 
						this.setStartAddressData(value.store_name?value.store_name:value.address,[value.lng,value.lat]);
				} 
				if(value && value.type == 3){
					this.getSystemHeight(this.panelMimheigth)
				}else{ 
				  this.getSystemHeight(maxh)
				}
			
			},
		},
		async onLoad() {			
			app = getApp()
			await app.globalData.onUserInfo()
			this.clearInterval();
			this.getOrderData();			 
		},
		mounted() {
			try {
				uni.removeStorageSync( localStorageKey.END_ADDRESS_TEXT );
			} catch ( e ) {}
			this.getCityList();
			this.initLocal();
		}, 
		methods: { 
			initLocal() {
				this.$aMapJSAPILoader.load().then( ( AMap ) => {
					this.AMap = AMap, this.map;
					this.map = new AMap.Map( 'amapContainer', {
						resizeEnable: true
					} );
					let res = getLocal( AMap, this.map );
					res.then( ( result ) => {
						this.locationData = result; 
					} );
				} );
			},
			async getCityList() {
			  this.cityList = await getCity();
			  // this.cityList = [{"cf_city":"武汉市","cf_city_code":"027","cf_city_simple":"武汉","longitude":114.41092,"latitude":30.478958,"city_hash":"4df942c54a26a7a41357175ceb7fe88f"},{"cf_city":"西安市","cf_city_code":"029","cf_city_simple":"西安","longitude":108.870704,"latitude":34.230967,"city_hash":"e48f5c3de57ed84cd990f8cde04892fb"},{"cf_city":"郑州市","cf_city_code":"0371","cf_city_simple":"郑州","longitude":113.616765,"latitude":34.789666,"city_hash":"d59b41c2bc2f222dbeb2c0f6b2dd9ee5"},{"cf_city":"深圳市","cf_city_code":"0755","cf_city_simple":"深圳","longitude":114.062551,"latitude":22.655835,"city_hash":"2593c2905a50421e4fd266042e0cc826"},{"cf_city":"舟山市","cf_city_code":"0580","cf_city_simple":"舟山","longitude":122.122342,"latitude":30.037056,"city_hash":"d0bc0f53c8492436c97b4bb6b8252816"},{"cf_city":"大理白族自治州","cf_city_code":"0872","cf_city_simple":"大理","longitude":100.160233,"latitude":25.70038,"city_hash":"357350ec2b1fde59c71f6dfbd4a27caf"},{"cf_city":"太原市","cf_city_code":"0351","cf_city_simple":"太原","longitude":112.720264,"latitude":37.748552,"city_hash":"fb120dd693813ef61143f47a2d291e72"}]
			},
			async getPlanOrder(){ 
				let	loc = coordtransform.gcj02towgs84(this.locationData.position.lng,this.locationData.position.lat);
				let res = await getOpsInfo({location:loc});

				this.planOrder = res;

				// 20191206 21：00  Fix  预约订单已支付跳转
				//"pay_status": 0,//支付状态(0:不需支付,1:待支付,2:已支付) 
				if(res && res.plan_info){
					if(res.plan_info.pay_status === 0){
						this.gotoPickCar(res.plan_info.order_id)
					}else if(res.plan_info.pay_status === 1){
						this.gotoPay(res.plan_info.order_id)
					}
				}
			}, 
			startInteval(){
				this.intervalTimeout =setInterval(()=>{
					this.getOrderData();
				},this.intervalTime); 
			},
			clearInterval(){
				clearInterval(this.intervalTimeout);
			},
			bindMovestartEvent() {
				this.map.on( "movestart", this.mapDragStart );
			},
			unbindMoveendEvent() {
				this.map.off( "moveend", this.mapMoveend );
			},
			bindMoveendEvent() {
				this.map.on( "moveend", this.mapMoveend );
			},
			/* 设置地图中心点 */
			setMapCenterData( lng, lat ) {
				this.mapCenterData = [ lng, lat ]
			},
			/* 设置地图中心点 */
			setMapBeforCenterData( lng, lat ) {
				this.mapBeforCenterData = [ lng, lat ]
			},
			mapDragStart() {
				this.centerIconText = false
				let mapcenter = this.map.getCenter();
				this.setMapBeforCenterData( mapcenter.lng, mapcenter.lat )
			},
			async mapMoveend() { 
				if ( this.loadingnearDataLock ) {
					return
				}
				/* 中心图标显示 */
				this.centerIconText = true
				let mapcenter = this.map.getCenter();				 
				let endcenter = [ mapcenter.lng, mapcenter.lat ]
				this.setMapCenterData( mapcenter.lng, mapcenter.lat );
				if ( !this.loadingnearDataLock ) {
					let resaddress = await getAddressByLnglat( this.AMap, endcenter );
					this.setStartAddressData( resaddress, endcenter )
				}
				clearTimeout( this.moveOut );
				this.moveOut = setTimeout( () => {
					this.getNearList();
				}, 500 )
				  
			},
			async changeCity( cname  ) {
				this.setCityName( cname );
				this.getCityInfo( cname )				
				if(this.locationData.addressComponent.province != cname){
					this.isLocal = false; 
				}
				  
				try{
					await this.$store.dispatch('user/getInformation', {city:cname}) 
				}catch(err){
					this.$toast.info(err.message) 
				}
				
				
			},
			setCityName( name ) {
				this.cityName = name;
			},
			async getCityInfo( cname ) {
				try {
					let res = await getCityinfo( {
						city: cname
					} );					 
					if(res.city){
						this.cityInfo = res;
					}else{
						this.$toast.info("没有城市信息") 
					}					
				} catch ( e ) {
					this.$toast.info("没有城市信息") 
				}
			},
			async getOrderData() {
				let res = await getOrdrData();
				this.orderData = res;
			},
			getNowCarList() {
				this.getCarlist();
			},
			getYuyueCarList( parms ) {
				this.getCarlist( parms );
			},
			async getCarlist( param = {} ) {
				let currentStore = this.currentStore;
				let type = currentStore.type,
					use_car_type = 1;
				if ( type == "1" || type == "0" ) {
					if ( type == "1" && currentStore.car_cnt > 0 ) {
						use_car_type = 0; // 网点有车	送车点类型 0送车点 1网点 
					}
				}
				let distance = 0;
				if(this.AMap){
					distance = parseInt(getDistance(this.AMap,[ this.locationData.position.lng, this.locationData.position.lat],this.mapCenterData ));
				} 
				let subData = {
					use_car_type: use_car_type,
					city: this.cityName,
					use_time: parseInt( new Date().getTime() / 1000 ),
					location: this.mapCenterData.toString(),
					distance: distance
				}
				if ( type ) {
					
					let dis = 0;
					if(this.AMap){
						dis = parseInt(getDistance(this.AMap,this.currentStore.amplocation, this.mapCenterData));
					}
					if ( dis <= 100 ) {
						subData.point_type = type
						subData.point_id = currentStore.store_id ? currentStore.store_id : currentStore.id;
					} else {
						this.clearDisMarker()
						this.clearStoreArea()
						this.currentStore = {}
					}
				}
				if ( this.endAddressTextValue ) {
					subData.return_location = this.endAddressLngLat.toString() || "",
					subData.return_address = this.endAddressTextValue || ""
				}
			
				 
				Object.assign( subData, param );
				let res = await getCarlist( subData );
				this.listData = res;
				this.loadingMask = false;
			},
			async loadCarList() { 
				this.getCarlist(); 
			},
			/* 获取附近网点等 */
			async getNearList( lng, lat, type = [] ) {
				/* 获取城市配置 */
				let flush_store_distance = this.flush_store_distance,
					flush_point_distance = this.flush_point_distance,
					flush_car_distance = this.flush_car_distance,
					/* 获取获取数据时的坐标 */
					storeFlushDataLnglat = this.storeFlushDataLnglat,
					pointFlushDataLnglat = this.pointFlushDataLnglat,
					carFlushDataLnglat = this.carFlushDataLnglat;
				let storeDis = parseInt( this.AMap.GeometryUtil.distance( storeFlushDataLnglat, this.mapCenterData ) );
				let pointDis = parseInt( this.AMap.GeometryUtil.distance( pointFlushDataLnglat, this.mapCenterData ) );
				let carDis = parseInt( this.AMap.GeometryUtil.distance( carFlushDataLnglat, this.mapCenterData ) );
				//type 类型 string 1送车点 2网点 4车辆 6送车点提示信息 可以传 type=1,2,4  type=1,2 type=1,4 等
				if ( storeDis >= flush_store_distance ) {
					type.push( 2 );
					this.storeFlushDataLnglat = this.mapCenterData
				}
				if ( pointDis >= flush_point_distance ) {
					type.push( 1 )
					this.pointFlushDataLnglat = this.mapCenterData
				}
				if ( carDis >= flush_car_distance ) {
					type.push( 4 )
					carFlushDataLnglat = this.mapCenterData
				}
				/* 第一次参数 */
				if ( this.flushTimes == 0 ) {
					type = [ 1, 2, 4, 6 ]
				}
				if ( type.length > 0 ) { 
					let cityName = this.cityName, 
						loc = coordtransform.gcj02towgs84( this.mapCenterData[ 0 ], this.mapCenterData[ 1 ] ).toString();
					let subData = {
						city: cityName,
						location: loc,
						type: type.toString()
					}; 
					let res = await getNearbyList( subData );
					this.nearList = res;
					this.flushTimes++;
					if ( res.point.length == 0 && res.store.length == 0 && res.car.length == 0 ) {
						this.loadingMask = false;
					}
				} else {
					this.autoToStore()
				}
			},
			/* 自动吸附 */
			autoToStore() {
				getMinDistance( this.AMap, this.formatStoreData, this.mapCenterData, ( data ) => {
					if ( data.dis <= 100 ) {
						this.currentStore = data.data;
						
						this.toSetCenter();
						this.showDisMarks();
						this.drawStoreArea();
						this.getCarlist();
					} else {
						this.getCarlist();
					}
				} );
			},
			/* 画网点运营区域 */
			drawStoreArea() {
				let fence = this.currentStore.fence;
				drawArea( this.AMap, this.map, [ {
					fence: fence
				} ], this.PolygonArry, 3 );
			},
			/* 清除运营区域 */
			clearStoreArea() {
				this.map.remove( this.PolygonArry );
			}, 
			showDisMarks() {
				this.clearDisMarker();
				let dis = this.AMap.GeometryUtil.distance( [ this.locationData.position.lng, this.locationData.position.lat ], this
					.currentStore.amplocation );
				let storeData = Object.assign( {}, this.currentStore )
				storeData.dis = dis;
				drawDisMarks( this.AMap, this.map, storeData, () => {}, this.disMarker );
			},
			hideDisMarks() {
				this.clearDisMarker();
			},
			drawStoreMarks( data ) {
				this.clearStoreMarks();
				drawStoreMarks( this.AMap, this.map, data, ( data, marker ) => {
					this.currentStore = data.data;
					this.toSetCenter( );
					this.showDisMarks();
					this.drawStoreArea();
				}, this.storeMask );
			},
			drawPointMarks( data ) {
				this.clearPointMarks();
				drawPointMarks( this.AMap, this.map, data, ( data ) => {
					this.currentStore = data.data;
					this.toSetCenter(  );
					this.showDisMarks();
					this.drawStoreArea();
				}, this.pointMask );
			},
			drawCarMarks( data ) {
				this.clearCarMarks(); 
				drawCarMarks( this.AMap, this.map, data, ( data ) => { 
					this.currentStore = data.data;
					this.toSetCenter(  );
				}, this.carMask );
			},
			clearStoreMarks() {
				this.map.remove( this.storeMask );
			},
			clearPointMarks() {
				this.map.remove( this.pointMask );
			},
			clearCarMarks() {
				this.map.remove( this.carMask );
			},
			clearMarks() {
				this.map.remove( this.maskArray );
			},
			clearDisMarker() {
				this.map.remove( this.disMarker );
			},
			toSetCenter( from = true ) {
				this.setCenter( this.currentStore.lng, this.currentStore.lat, from );
			},
			/* 设置地图中心 */
			async setCenter( lng, lat, from ) {
				
				if ( from ) {
					this.unbindMoveendEvent();
				}
				let ampLngLat = await gpsToamp( this.AMap, [ lng, lat ] );
				this.map.setCenter( ampLngLat ); 
				if ( from ) {
					setTimeout( () => {
						this.bindMoveendEvent();
					}, 500 )
				}
			},
			maskHide() {
				this.storeMask.forEach( ( v ) => {
					v.hide();
				} )
				this.pointMask.forEach( ( v ) => {
					v.hide();
				} )
			},
			maskShow() {
				this.storeMask.forEach( ( v ) => {
					v.show();
				} )
				this.pointMask.forEach( ( v ) => {
					v.hide();
				} )
			},
			disMarkerHide() {
				this.disMarker.forEach( ( v ) => {
					v.hide();
				} )
			},
			disMarkerShow() {
				this.disMarker.forEach( ( v ) => {
					v.show();
				} )
			},
			/* 移除路线 */
			removeDriving() {
				this.driving && this.driving.clear();
				this.maskShow();
				this.disMarkerShow();
			},
			//驾车路线
			drivingLine() {
				this.removeDriving();
				this.maskHide();
				this.disMarkerHide();
				let mapcenter = this.map.getCenter();
				let res = drawDrivingLine( this.AMap, this.map, [ mapcenter.lng, mapcenter.lat ], this.endAddressLngLat, false );
				res.then( ( dr ) => {
					this.driving = dr;
				} );
			},
			//验证驾驶证
			validDriveState() {
				const {
					userinfo
				} = app.globalData
				if ( userinfo ) {
					this.driveValidState = userinfo.user_verify_type
					const validTime = new Date( userinfo.valid_end_time )
					const today = new Date();

					//已过期						
					if ( validTime <= today ) {
						this.driveValidState = -1
					}
					//user_verify_type : 0 未审核，1 已审核通过，2 审核不通过，3 已提交，但是未审核，4 实习期 5 未登录用户，6 驾照过期  7、8 已审核，待上传
					if ( userinfo.user_verify_type !== 1 && userinfo.user_verify_type !== 3) {
						this.switchShowCheck()
					} else if ( userinfo.face_id_status !== 1 ) {
						// face_id_status //活体检测状态 0 未提交 1审核通过 2待审核 3未通过 4已过期
						//人脸
						if(userinfo.face_id_status !== 2){
							this.switchShowFace()
						}
					}
				}
			},
			setStartAddressData( text, lnglat ) {
				this.startAddressTextValue = text;
				this.startAddressLngLat = lnglat;
			},
			setEndtAddressData( text, lnglat ) {
				this.endAddressTextValue = text;
				this.endAddressLngLat = lnglat;
			},
			removeEndAddress() {
				this.endAddressTextValue = "";
				this.endAddressLngLat = [];
				this.removeDriving()
				try {
					uni.removeStorageSync( localStorageKey.END_ADDRESS_TEXT );
				} catch ( e ) {}
				this.loadingnearDataLock = false;
				this.showcenterIcon();
				this.loadCarList()
			},
			onShow() {
				 bindBodyEvent(); 
				 /* 刷新订单信息*/
				  if(this.planorder && this.planorder.plan_cnt > 0){
					  this.startInteval();
				  }
				this.locationData && this.locationData.position && this.getPlanOrder(); 
				uni.getStorage( {
					key: localStorageKey.END_ADDRESS_TEXT,
					success: ( res ) => {
						if ( res.data ) {
							this.setEndtAddressData( res.data.name, [ res.data.lng, res.data.lat ] );
							this.loadingnearDataLock = true;
							this.map && this.drivingLine();
							this.getCarlist();
							this.hidecenterIcon();
						}
					}
				} );
			},
			onHide(){ 
				this.clearInterval();
				removeBodyEvent();	  
			},
			onUnload(){
				this.clearInterval();
				removeBodyEvent();	 
			},
			gotoReturnCar() {  
				uni.redirectTo( {
					url: "/pages/returncar/returncar"
				} )
			},
			gotoPickCar(orderid) {  
				uni.redirectTo( {
					url: `/pages/pickcar/pickcar?orderId=${orderid}`
				} )
			},
			/**
			 * isViolate : 是否是违约金
			 */
			gotoPay(o, isViolate) {  
				let url = `/pages/settlement/settlement`
				if(isViolate){
					url += `?payId=${o}`
				}else{
					url += `?orderId=${o}`
				}
				uni.redirectTo({
					url
				})
			},	
			gotoPlanList() {				 
				uni.navigateTo( {
					url: "/pages/planorder/planorder"
				} )
			},
			/* bindBodyEvent(){
				//#ifdef H5  
				document.body.addEventListener( 'touchmove',this.bodyMoveEvent, {
					passive: false
				})  
				//#endif
			},
			removeBodyEvent(){
					//#ifdef H5  
				document.body.removeEventListener( 'touchmove',this.bodyMoveEvent, {
					passive: false
				})
					//#endif
			}, */ 
			getSystemHeight(h) {
				uni.getSystemInfo( {
					success: ( res ) => {  
						this.mapHeight = res.windowHeight - h + 'px' 
					}
				} )
			},
			switchShowCheck() {
				this.isShowCheck = !this.isShowCheck;
			},
			switchShowOrder() {
				this.isShowOrder = !this.isShowOrder;
			},
			switchShowFace() {
				this.isShowFace = !this.isShowFace;
			},
			showcenterIcon() {
				this.showCenterIcon = true
			},
			hidecenterIcon() {
				this.showCenterIcon = false
			}
		}
	}
</script>
<style lang='scss' scope>
	.wrap {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.mapLabel {
		background: orange;
	}

	.map-wrap {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.map-center-icon {
		height: 64upx;
		width: 26upx;
		background: #007AFF;
		z-index: 2;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -64upx;
		margin-left: -13upx;
		background: url(/static/icon_29.png) no-repeat;
		background-size: 100%;
	}

	.map-content-text {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 40upx;
		padding: 0 15upx;
		line-height: 40upx;
		transform: translate(-50%, -110upx);
		border-radius: 20upx;
		text-align: center;
		background: #fff;
		font-size: 24upx;
		z-index: 2;
		color: $uni-text-orange;
		transition: all 0.3s ease-in-out 0s;
		opacity: 1;
	}

	.map-content-text-active {
		opacity: 0;
	}

	.elmap {
		width: 100%;
	}

	.map {
		position: absolute;
		z-index: 1;
		height: 100%;
		/* 	height: 100vh; */
		width: 100%;
		background: #eee;
		display: flex;
		flex-direction: column;
		align-items: center;
		/*垂直居中*/
		justify-content: center;
		/*水平居中*/
	}

	.location {
		width: 50upx;
		height: 50upx;
		position: absolute;
		background: url(../../static/icon-20.png) #fff no-repeat;
		background-size: cover;
		border-radius: 50%;
		z-index: 10;
		right: 20upx;
		top: 50vh;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.loca-fresh {
		width: 50upx;
		height: 50upx;
		position: absolute;
		background: url(../../static/icon-19.png) #fff no-repeat;
		background-size: cover;
		border-radius: 50%;
		z-index: 10;
		left: 20upx;
		top: 50vh;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.active-local {
		background-color: #c0bebe;
	}

	.loadingMask {
		position: fixed;
		height: 100%;
		width: 100%;
		background: rgba(255, 255, 255, 0.1);
		z-index: 888;
	}
	.plan-order{
			height: 50upx;
			line-height: 50upx;
			position: fixed;
			left: 30upx;
			top: 90upx;
			color: #333;
			border-radius: 30upx;
			z-index: 2;
			background: rgba($color: #fff, $alpha: 0.8);
			padding: 0 30upx;
			font-size: 26upx;
			
			
	}
</style>
