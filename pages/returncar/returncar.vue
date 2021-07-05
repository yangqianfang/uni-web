<template>
	<view class="wrap">
		<view class="topbar">
			<view class="status status-03">
				<view class="user-box">
					<text class="iconfont iconren"
					 @click="switchDrawer"></text>
				</view>
				<!-- 	<view class="input-view">
					 <uni-icons type="search" size="22" color="#666666" />
					 <input confirm-type="search" class="input" type="text" placeholder="搜索目的地">
				</view> -->
				<view class="bar-box">
					<!-- <view class="icon kefu-icon"></view> -->
				</view>
			</view>
		</view>
		<view class="map"
		 :style="{height:mapHeight}"
		 id="amapContainer"></view>
		<sider-menu :visible="isShowDrawer"
		 @close="switchDrawer"></sider-menu>
		<!-- <bottom-panel  v-if="pickcardata.send_info && pickcardata.send_info.order_status != 0" :pickCarData = "pickcardata" :opsData= "opsData" :lastTime = "lastTime"  @isShowCheck="switchShowCheck" @clearInterval = "clearInterval"></bottom-panel> -->
		<!-- layerbox start -->
		<view class="layerbox-unlock"
		 v-if="showPanel">
			<!-- car-list start -->
			<view class="car-list">
				<view class="car-item">
					<view class="text-box">
						<view class="title">{{amountdata.car_info.car_brand}}·{{amountdata.car_info.seat_num}}·{{amountdata.car_info.car_color}}
						</view>
						<view class="price">
							<view class="tips">实时计价<text class="red">{{amountdata.order_info.pay_amount}}</text>元</view>
						</view>
						<text class="timebox">您已用车 {{timeDiffs(amountdata.order_info.order_start_time)}}</text>
					</view>
					<view class="img-box">
						<view class="img">
							<image :src="amountdata.car_info.car_image"></image>
						</view>
						<view class="text">{{amountdata.order_info.car_plate}}</view>
					</view>
					<view :class="'drive-limit-'+ driveLimit(amountdata.car_info.drive_limit)"
					 v-if="amountdata.car_info.drive_limit>0">
					</view>
				</view>
			</view>
			<view class="tools-bar">
				<view class="tools-bar-body">
					<uni-grid :column="4"
					 :show-border="false"
					 :square="false"
					 @change="carControl">
						<uni-grid-item>
							<view class="iconfont iconkaisuo"></view>
							<text class="text">开门</text>
						</uni-grid-item>
						<uni-grid-item>
							<view class="iconfont iconsuo"></view>
							<text class="text">锁门</text>
						</uni-grid-item>
						<uni-grid-item>
							<view class="iconfont iconlaba"></view>
							<text class="text">寻车</text>
						</uni-grid-item>
						<uni-grid-item>
							<view class="iconfont iconicon-Groupx1"></view>
							<text class="text">刷新</text>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
			<view class="butbox">
				<view class="button"
				 @click="returnCarSubmit">
					<text class="t1 center">
						{{timeStr?'免费':''}}还车 </text>
					<text class="t2"
					 v-if="timeStr">{{timeStr}}</text>
				</view>
			</view>
		</view>
		<!-- layerbox end -->
		<uni-popup class="popup-dialog" :show="visible" :maskClick="false">
			<view>
				<text class="msg-test">{{msgText}}</text>
				<button class="btn" @click="returnCar">好的</button>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import siderMenu from '@/components/sider-menu/sider-menu.vue'
	import {
		timeCount
	} from '@/lib/utils';
	import {
		localStorageKey
	} from '@/lib/base';
	import {
		uniPopup,
		uniIcons,
		uniNavBar,
		uniGrid,
		uniGridItem
	} from '@dcloudio/uni-ui';
	import {
		getLocal,
		gpsToamp,
		drawStopStoreMarks,
		drawArea,
		timeDiff,
		drawInfoWindow
	} from '@/lib/mapUtils';
	import {
		getOrdrData
	} from '@/api/pickcar';
	import {
		getAmount,
		carControl,
		powerOn
	} from '@/api/returncar';
	import {
		getNearbyList
	} from '@/api/index';
	export default {
		components: {
			uniIcons,
			uniNavBar,
			siderMenu,
			uniGrid,
			uniGridItem,
			uniPopup
		},
		data() {
			return {
				isShowDrawer: false,
				locationData: [],
				mapBeforCenterData: [], //地图移动前中心坐标
				mapCenterData: [], //地图移动后中心坐标
				map: null,
				maskArray: [],
				polygonArry: [],
				mapHeight: "100%",
				orderData: {
					car_info: "",
					send_info: "",
					order_info: ""
				},
				timeout: "",
				storeList: "",
				currentStoreData: "",
				cityInfo: "",
				amountData: "",
				infoWindow: "",
				showPanel: false,
				timeStr: "",
				interval: "",
				order_start_time: "",
				nowTime: Math.floor( new Date().getTime() / 1000 ),
				msgText: '',
				visible: false
			}
		},
		onLoad() {},
		mounted() {
			//初始化定位
			this.initLocal();
			//获取订单数据
			this.getOrderData();
			//定时获取
			//this.timeIntervalGet(); 
			uni.getStorage( {
				key: localStorageKey.CITY_INFO,
				success: function( res ) {
					if ( res.data ) {
						this.cityInfo = res.data;
					}
				}
			} );
		},
		watch: {
			mapCenterData( value ) {
				/* 获取画附近网点数据 */
				value.length > 0 && this.getNearList();
			},
			storelist( value ) {
				/* 画附近网点 */
				value && this.drawStopStoreMarks();
			},
			currentStoreData( value ) {
				/* 画网点运营区域 */
				this.drawStoreArea();
			},
			orderdata( value ) {
				let orderid = value.order_info && value.order_info.order_id;
				orderid && this.getAmountData();
			},
			allData( value ) {
				if ( value.locationData.position && value.amountData ) {
					this.showPanel = true
					this.getSystemHeight();
				}
			}
		},
		computed: {
			orderdata() {
				return this.orderData;
			},
			locationdata() {
				return this.locationData;
			},
			storelist() {
				return this.storeList;
			},
			amountdata() {
				return this.amountData;
			},
			allData() {
				let orderData = this.orderData;
				let locationData = this.locationData;
				let amountData = this.amountData;
				return {
					locationData,
					orderData,
					amountData
				}
			}
		},
		methods: {
			initLocal() {
				let _this = this;
				this.$aMapJSAPILoader.load().then( ( AMap ) => {
					this.AMap = AMap;
					this.map = new AMap.Map( 'amapContainer', {
						resizeEnable: true
					} );
					let res = getLocal( AMap, this.map );
					res.then( ( result ) => {
						this.locationData = result;
						this.setMapCenterData( this.locationData.position.lng, this.locationData.position.lat );
						this.setMapBeforCenterData( this.locationData.position.lng, this.locationData.position.lat );
						this.bindMapEvent();
					} );
				} )
			},
			/* 订单数据 */
			async getOrderData( data ) {
				let res = await getOrdrData();
				this.orderData = res;
				if ( !this.order_start_time ) {
					this.order_start_time = res.order_info.order_start_time
				}
				//console.log(res);
				if ( this.order_start_time && res.order_info.get_car_type == 0) {
					this.startTime( this.order_start_time )
				}
				if ( res.user_info && res.user_info.money ) {
					this.goToPay();
				}
			},
			/* 进行中订单金额  */
			async getAmountData( data ) {
				let subData = {
					order_id: this.orderdata.order_info.order_id
				}
				let res = await getAmount( subData );
				this.amountData = res;
			},
			/* 获取附近网点等 */
			async getNearList() {
				let locationData = this.locationData;
				let cityName = locationData.addressComponent.province,
					mapCenter = this.mapCenterData;
				let subData = {
					city: cityName,
					location: mapCenter.toString(),
					type: "2"
				};
				let res = await getNearbyList( subData );
				this.storeList = res;
			},
			/* 画停车网点 */
			drawStopStoreMarks() {
				this.clearMarks();
				drawStopStoreMarks( this.AMap, this.map, this.storelist.store, ( data ) => {
					this.currentStoreData = data.data;
					this.drawInfoWindow();
				}, this.maskArray );
			},
			drawInfoWindow() {
				this.clearInfoWindow();
				drawInfoWindow( this.AMap, this.map, this.currentStoreData );
			},
			clearInfoWindow() {
				this.map.clearInfoWindow()
			},
			/* 设置地图中心点 */
			setMapCenterData( lng, lat ) {
				this.mapCenterData = [ lng, lat ]
			},
			/* 设置地图中心点 */
			setMapBeforCenterData( lng, lat ) {
				this.mapBeforCenterData = [ lng, lat ]
			},
			/* 画网点运营区域 */
			drawStoreArea() {
				let fence = this.currentStoreData.fence;
				drawArea( this.AMap, this.map, [ {
					fence: fence
				} ], this.polygonArry, 3 );
			},
			/* 清除网点图标 */
			clearMarks() {
				this.map.remove( this.maskArray );
			},
			bindMapEvent() {
				this.map.on( "dragstart", ( e ) => {
					this.mapDragStart( e );
				} );
				this.map.on( "dragend", ( e ) => {
					this.mapDragEnd( e );
				} );
			},
			mapDragStart() {
				let mapcenter = this.map.getCenter();
				this.setMapBeforCenterData( mapcenter.lng, mapcenter.lat )
			},
			mapDragEnd() {
				let mapcenter = this.map.getCenter();
				let endcenter = [ mapcenter.lng, mapcenter.lat ]
				/* 刷新网点距离 1000m*/
				let flush_store_distance = this.cityInfo ? this.cityInfo.map.flush_store_distance : "1000";
				let dis = this.AMap.GeometryUtil.distance( endcenter, this.mapBeforCenterData );
				if ( dis >= flush_store_distance ) {
					this.setMapCenterData( mapcenter.lng, mapcenter.lat );
				}
			},
			/* 车辆控制 type  0 1 2  */
			async carControl( e ) {
				let index = e.detail.index;
				/* action: lock/unlock/findcar*/
				let publicData = {
					order_id: this.orderData.order_info.order_id,
					car_id: this.orderData.car_info.car_id,
					location: [ this.locationData.position.lng, this.locationData.position.lat ].toString()
				};
				if ( index > 2 ) {
					let text = "请安以下步奏尝试打火：\n 1. 挂P档-踩住刹车-扭动钥匙打火 \n 2.如需帮助，请拨打客服电话：4000-888-502"
					uni.showModal( {
						title: '无法打火',
						confirmText: "刷新状态",
						content: text,
						success: async ( res ) => {
							if ( res.confirm ) {
								//刷新车辆
								let subData = Object.assign( publicData, {
									bluetooth_start: 0
								} )
								
								try{
									let res = await powerOn( subData ) 
									this.$toast.info( "操作成功！" )
								}catch(res){
									this.$toast.info( res.message )
								}
								
							}
						}
					} );
				} else {
					let action = [ "unlock", "lock", "findcar" ];
					let subData = Object.assign( publicData, {
						action: action[ index ]
					} ) 
					try{
						let res = await carControl( subData ) 
						this.$toast.info( "操作成功！" )
					}catch(res){
						this.$toast.info( res.message )
					} 
				}
			},
			returnCarSubmit() {
				uni.showModal( {
					title: '还车提示',
					confirmText: "继续还车",
					content: "请停放在正确的停车位",
					success: ( res ) => {
						if ( res.confirm ) {
							this.toReturnCar();
						}
					}
				} );
			},
			toReturnCar() {
				//免费还车
				if(this.timeStr){
					this.finishOrder()
				}else{
					//get_car_type 0 自取 1 送车 
					let return_type = this.orderdata.order_info.get_car_type;
					let type = "1";
					let user_location = [ this.locationData.position.lng, this.locationData.position.lat ].toString()
					uni.navigateTo({
						url: `/pages/photograph/photograph?type=${type}&return_type=${return_type}&user_location=${user_location}`
					})
				}
			},
			goToPay() {
				uni.navigateTo( {
					url: `/pages/settlement/settlement?orderId=${this.orderdata.order_info.order_id}`
				} )
				/* uni.navigateTo({
					//url:"/pages/index/index"
				}) */
			},
			getSystemHeight() {
				uni.getSystemInfo( {
					success: ( res ) => {
						this.mapHeight = res.windowHeight - 285 + 'px'
					}
				} )
			},
			switchDrawer() {
				this.isShowDrawer = !this.isShowDrawer;
			},
			driveLimit( value ) {
				return this.amountdata.car_info.city == "武汉市" ? value == 3 || value == 1 ? 3 : 2 : value == 3 || value == 1 ? 1 : 2;
			},
			startTime( order_start_time ) {
				this.interval = setInterval( () => {
					let nowtime = Math.floor( new Date().getTime() / 1000 );
					let endtime = ( order_start_time + 5 * 60 )
					if ( nowtime >= endtime ) {
						this.timeStr = ""
						clearInterval( this.interval );
					} else {
						this.timeStr = timeCount( endtime );
					}
				}, 1000 )
			},
			timeDiffs( value ) {
				let starttime = value;
				return timeDiff( starttime, this.nowTime );
			},
			returnCar() {
				this.finishOrder(1)
			},
			/**
			 * 免费还车，无需上传照片
			 */
			async finishOrder(off_lamp){
				let user_location = [ this.locationData.position.lng, this.locationData.position.lat ].toString()
				let address = ''
				let return_type = this.timeStr ? 1 : 2
				try{
					const res = await this.$store.dispatch('photograph/finishOrder', {
						bluetooth_end: 0,
						off_lamp: off_lamp || '',//关灯提醒 默认传空
						address: address,//停车场
						return_type: return_type, //1 不收费还车 2收费还车
						user_location: user_location,  //用户位置信息
						order_id: this.orderdata.order_info.order_id || "" 
					})

					uni.navigateTo({
						url: `/pages/settlement/settlement?orderId=${this.orderdata.order_info.order_id}`
					}) 
				}catch(err){
					if(err.code === 90007){
						this.msgText = err.message || ''
						this.visible = true
					}else{
						this.$toast.info(err.message)
					}
				}
			}
		} 
	}
</script>
<style lang="scss">
	@import "@/common/topbar.scss";

	.iconfont {
		font-weight: bold;
	}

	.wrap {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.map {
		position: fixed;
		z-index: 1;
		height: 100vh;
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

	.bottom-tips {
		position: fixed;
		bottom: 30upx;
		width: 100%;
		z-index: 3;

		.bottom-text {
			height: 60upx;
			line-height: 60upx;
			font-size: 26upx;
			text-align: center;
			color: #FF9025;
			border-radius: 10upx;
			background: #fff;
			width: 75%;
			margin: 0 auto;
		}
	}

	.input-view {
		display: flex;
		background: #fff;
		border-radius: 44upx;
		line-height: 88upx;
		padding: 0 30upx;
		width: 80%;

		.uni-icon {
			line-height: 88upx !important;
		}

		.input {
			font-size: 28upx;
			height: 88upx;
			line-height: 88upx;
		}
	}

	.layerbox-unlock {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 280px;
		z-index: 3;
		background: #fff;
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;
		padding: 0upx 20upx 0 20upx;

		.car-list {
			padding-top: 30upx;
		}

		.tools-bar {
			box-shadow: 0px 0px 10px #eeeeee;
			margin: 20upx 0;
			padding: 0upx;
			border-radius: 10upx;

			.tools-bar-body {
				padding: 0 30upx;

				.iconfont {
					font-weight: bold;
					color: #333333;
				}
			}

			.image {
				width: 30upx;
				height: 30upx;
			}

			.text {
				font-size: 24upx;
				margin-top: 10upx;
			}
		}

		.butbox {
			padding: 10upx 0 30upx 0;

			.button {
				width: 416upx;
				height: 100upx;
				background: rgba(255, 144, 37, 1);
				box-shadow: 0px 2px 8px 0px rgba(255, 144, 37, 0.59);
				border-radius: 25px;
				font-size: 36upx;
				color: #fff;
				margin: 0 auto;

				.t1 {
					padding-top: 18upx;
					height: 40upx;
					line-height: 40upx;
					text-align: center;
					display: block;
					font-weight: normal;
				}

				.t2 {
					height: 20upx;
					line-height: 20upx;
					text-align: center;
					display: block;
					font-size: 24upx;
				}

				.center {
					padding-top: 30upx
				}
			}
		}

		.address-panel {
			box-shadow: 0px 0px 10px #eeeeee;
			border-radius: 10upx;
			padding: 20upx 36upx;

			.ap-text {
				height: 74upx;
				padding-left: 80upx;
				background: url(/static/icon-10.png) no-repeat;
				background-size: 67upx 74upx;

				text {
					display: block;
				}

				.title {
					font-size: $uni-font-size-base;
				}

				.tips {
					font-size: $uni-font-size-sm;
					color: #FF9025;
				}
			}
		}
	}

	.car-item {
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
		border-radius: 10upx;
		-moz-box-shadow: 0px 0px 10px #eeeeee;
		-webkit-box-shadow: 0px 0px 10px #eeeeee;
		box-shadow: 0px 0px 10px #eeeeee;
		background: #fff;
		position: relative;

		.drive-limit-1 {
			position: absolute;
			width: 102upx;
			height: 84upx;
			z-index: 5;
			right: 40upx;
			top: 40upx;
			background: url(/static/icon_30.png);
			background-size: cover;
		}

		.drive-limit-2 {
			position: absolute;
			width: 102upx;
			height: 84upx;
			z-index: 5;
			right: 40upx;
			top: 40upx;
			background: url(/static/icon_31.png);
			background-size: cover;
		}

		.drive-limit-3 {
			position: absolute;
			width: 102upx;
			height: 84upx;
			z-index: 5;
			right: 40upx;
			top: 40upx;
			background: url(/static/icon_32.png);
			background-size: cover;
		}

		.text-box {
			padding-right: 20upx;
			padding: 20upx;

			.title {
				font-size: $uni-font-size-base;
				margin: 10upx 0;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical
			}

			.timebox {
				color: #FF9025;
				font-size: $uni-font-size-sm;
			}

			.price {
				overflow: hidden;
				padding: 10upx 0;
				font-size: $uni-font-size-sm;

				.red {
					color: #ff3030;
					font-size: $uni-font-size-base;
				}

				view {
					overflow: hidden;
					float: left;
				}

				.tips {
					/* background: url(/static/icon-05.png) no-repeat right center; */
					padding-right: 40upx;
					background-size: 24upx 24upx;
				}

				.mianpei {
					background: url(/static/icon-04.png) no-repeat right center;
					padding: 0 40upx 0 20upx;
					background-size: 25upx 28upx;
				}
			}

			.endurance {
				font-size: 26upx;
				padding: 15upx 0;
				background: url(/static/icon-06.png) no-repeat left center;
				padding: 15upx 0upx 15upx 30upx;
				background-size: 20upx 24upx;
			}
		}

		.img-box {
			width: 211upx;
			height: 138upx;

			.img {
				background-size: cover;
				width: 211upx;
				height: 138upx;
			}

			image {
				width: 211upx;
				height: 138upx;
			}

			.text {
				text-align: center;
				padding: 10upx 0;
				font-size: 30upx;
			}
		}
	}
	.msg-test{
		margin: 20upx;
		margin-bottom: 80upx;
		display: block;
	}
	.popup-dialog{
		.btn{
			width: 260upx;
			height: 80upx;
			line-height: 80upx;
		}
	}
</style>
