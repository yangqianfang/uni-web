<template>
	<view class="wrap">
		<view class="topbar">
			<view class="status status-02 none">
				<view class="user-box">
					<text class="iconfont iconren"
					 @click="switchDrawer"></text>	
					<view class="status-text" v-if="pickcardata.send_info">
						{{ pickcardata.send_info.plan_id ?"车辆正在配送":"您正在取车"}}
					</view>
				</view>
				<view class="bar-box">
					<text class="cancel-order"
					 @click="cancelOrder">取消订单</text>
				</view>
			</view>
		</view>
		<view class="map"
		 :style="{height:mapHeight}"
		 id="amapContainer"></view>
		<sider-menu :visible="isShowDrawer"
		 @close="switchDrawer"></sider-menu>
		<view class="line-up-layer"
		 v-if="opsData.plan_info && opsData.plan_info.status === 0">
			<view class="lup-wrap">
				<view class="lup-title">运维小哥马不停蹄的送车中...感谢耐心等待</view>
				<view class="lup-content">
					<view class="lup-item">
						<text class="lup-text">当前排队</text>
						<text class="lup-text">第<text class="lup-num">{{opsData.queue.local}}</text>名/{{opsData.queue.total}}</text>
					</view>
					<view class="lup-item">
						<text class="lup-text">预计送达时间</text>
						<text class="lup-text"><text class="lup-num"> {{opsData.queue.times}}</text>分钟</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-tips"
		 v-else-if="pickcardata.send_info && pickcardata.send_info.order_status == 0">
			<view class="bottom-text"> 车辆正在分配，请耐心等待... </view>
		</view>
		<bottom-panel v-else-if="pickcardata.send_info && pickcardata.send_info.order_status != 0 && location.length > 0 "
		 :pickCarData="pickcardata"
		 :opsData="opsData"
		 :lastTime="lastTime"
		 :orderId="orderId"
		 @isShowCheck="switchShowCheck"
		 @clearInterval="clearInterval"></bottom-panel>
	</view>
</template>
<script>
	import siderMenu from '@/components/sider-menu/sider-menu.vue';
	import bottomPanel from './bottom-panel/bottom-panel.vue';
	import {
		UniPopup,
		uniIcons,
		uniNavBar
	} from '@dcloudio/uni-ui';
	import {
		mapState
	} from 'vuex';
	import {
		getLocal,
		drawWalkLine,
		drawRidingLine,
		drawDrivingLine,
		drawMarks,
		drawCarMarks,
		gpsToamp,
		getLastTime
	} from '@/lib/mapUtils';
	import {
		getOrdrData,
		getOpsInfo
	} from '@/api/pickcar';
	import {
		planOrderList,
		checkCancel,
		cancelOrder,
		getorderv2
	} from "@/api/order"
	export default {
		components: {
			uniIcons,
			uniNavBar,
			siderMenu,
			bottomPanel,
		},
		data() {
			return {
				isShowDrawer: false,
				location: [],
				map: null,
				endMarksArray: [],
				carMarksArray: [],
				opsMarksArray: [],
				lastTime: "",
				mapHeight: "100%",
				driving: null,
				walking: null,
				rading: null,
				timeInterval: "",
				pickCarData: {
					car_info: "",
					send_info: "",
					order_info: ""
				},
				opsData: {},
				timeout: ""
			}
		},
		onLoad(parms) { 
			this.orderId = parms.orderId;
		},
		mounted() {
			//初始化定位
			this.initLocal();
			//获取订单数据
			this.getPickData();
			//定时获取
			this.timeIntervalGet();
		},
		watch: {
			pickCarData( value ) {
				let orderid = value.order_info && value.order_info.order_id;
				let sendid = value.send_info && value.send_info.plan_id;
				if ( orderid && sendid ) {
					this.getOpsData();
					/* 违约金支付 */
					if ( value.pay_record_info.pay_id ) {
						this.backIndex()
					}
				}
			},
			allData( value ) {
				let pickData = value.pickData;
				let opsData = value.opsData;
				if ( value.location.length > 0 && pickData && pickData.car_info ) {
					//定位数据, 订单数据
					//没有找到送车信息为 自取
					clearTimeout( this.timeout )
					this.timeout = setTimeout( () => { 
						if ( !pickData.send_info.plan_id ) {
							this.initUserPick();
						}
					}, 500 );
				}
				if ( value.location.length > 0 && pickData && pickData.car_info && opsData.plan_info ) {
					
					clearTimeout( this.timeout )
					this.timeout = setTimeout( () => {
						//配送 plan_info.status == 0 为排队
						//!opsData.queue && this.initSendPick();
						
						opsData.plan_info.status !==0 && this.initSendPick();
					}, 500 );
				}
			}
		},
		computed: {
			/* ...mapState("pickcar",{
				pickcardata: (state) => state.pickCarData
			}), */
			pickcardata() {
				return this.pickCarData;
			},
			allData() {
				let pickData = this.pickcardata;
				let location = this.location;
				let opsData = this.opsData;
				return {
					pickData,
					location,
					opsData
				}
			}
		},
		methods: {
			onHide(){
				this.clearInterval(); 
			},
			onUnload(){
				this.clearInterval(); 
			},
			initLocal() {
				let _this = this;
				this.$aMapJSAPILoader.load().then( ( AMap ) => {
					this.AMap = AMap;
					this.map = new AMap.Map( 'amapContainer', {
						resizeEnable: true
					} );
					let res = getLocal( AMap, this.map );
					res.then( ( result ) => {
						this.cityName = result.addressComponent.province;
						this.location = [ result.position.lng, result.position.lat ];
					} );
				} )
			},
			async getPickData( data ) {
				//let  res = await this.$store.dispatch('pickcar/getPickData', data) 
				//let res = await getOrdrData();
				let res = await getorderv2({order_id:this.orderId});
				//res.send_info.order_status = "0";
				this.pickCarData = res; 
				if ( !res.hasOwnProperty( "car_info" ) ) {
					//res.then( (res) => { 
					this.clearInterval();
					setTimeout( () => {
						this.backIndex();
					}, 1000 );
					//}); 
				}
			},
			getLastTime() {
				this.lastTime = getLastTime( this.pickCarData.order_info.auto_cancel_time );
			},
			timeIntervalGet( time = 10000 ) {
				this.timeInterval = setInterval( () => {
					this.getPickData();
				}, time );
			},
			clearMarks() {
				this.map.remove( this.opsMarksArray );
				this.map.remove( this.carMarksArray );
				this.map.remove( this.endMarksArray );
			},
			clearLine() {
				this.driving && this.driving.clear();
				this.walking && this.walking.clear();
				this.rading && this.rading.clear();
			},
			clearInterval() {
				clearInterval( this.timeInterval );
			},
			initUserPick() {
				//自取
				this.clearMarks();
				this.clearLine();
				this.getLastTime(); //获取开锁时间
				this.drawWalkLine();
				let carlocal = [ this.pickCarData.car_info.lng, this.pickCarData.car_info.lat ];
				drawMarks( this.AMap, this.map, carlocal, 1, this.carMarksArray );
				this.getSystemHeight();
				//this.clearInterval(); 
			},
			initSendPick() {
				this.clearMarks();
				this.clearLine(); 
				if ( this.pickCarData.send_info.order_status == 5 || this.pickCarData.send_info.order_status == 6 ) {
					this.clearInterval(); 
				} else {
					if ( this.opsData.op_info ) {
						this.drawRidingLine(); //运维人员骑行路线						
						let start = this.opsData.op_info.location;
						/* 运维人员mark位置 */
						drawMarks( this.AMap, this.map, start, 0, this.opsMarksArray );
					} else {}
					this.drawDrivingLine();
				}
				/* 汽车位置 */
				let carlocal = this.opsData.car_info.location,
					end = [ this.pickCarData.send_info.use_location.lng, this.pickCarData.send_info.use_location.lat ];
				drawMarks( this.AMap, this.map, carlocal, 1, this.carMarksArray );
				/* 终点 */
				drawMarks( this.AMap, this.map, end, 2, this.endMarksArray );
				if(this.pickCarData.send_info.order_status != 0){
					this.getSystemHeight();
				}
				
				/* if(this.pickCarData.send_info.order_status == 5 || this.pickCarData.send_info.order_status == 6){					  
					  setTimeout(()=>{
						  this.clearLine();
					  },1000);					  
					  this.clearInterval();
					  return;
				} */
			},
			/* 运维人员驾车路线 */
			async drawDrivingLine() {
				let startlnglat = this.opsData.car_info.location,
					entlnglat = [ this.pickCarData.send_info.use_location.lng, this.pickCarData.send_info.use_location.lat ];
				let start = await gpsToamp( this.AMap, startlnglat );
				let end = await gpsToamp( this.AMap, entlnglat );
				let res = drawDrivingLine( this.AMap, this.map, start, end );
				res.then( ( dr ) => {
					this.driving = dr;
				} );
			},
			/* 运维人员骑行路线 */
			async drawRidingLine() {
				let startlnglat = this.opsData.op_info.location,
					entlnglat = [ this.pickCarData.car_info.lng, this.pickCarData.car_info.lat ];
				let start = await gpsToamp( this.AMap, startlnglat );
				let end = await gpsToamp( this.AMap, entlnglat );
				let res = drawRidingLine( this.AMap, this.map, start, end );
				res.then( ( dr ) => {
					this.rading = dr;
				} );
			},
			/* 步行路线*/
			async drawWalkLine() { 
				let start = this.location,
					entlnglat = [ this.pickCarData.car_info.lng, this.pickCarData.car_info.lat ];
				let end = await gpsToamp( this.AMap, entlnglat );
				let res = drawWalkLine( this.AMap, this.map, start, end );
				res.then( ( dr ) => {
					this.walking = dr;
				} );
				// drawCarMarks(this.AMap,this.map,endMarkData,function(data){},this.maskArray);
			},
			async getOrderData( data ) {
				// await this.$store.dispatch('pickcar/getorderData', data) 
				let res = await getOrdrData();
				this.pickCarData = res.data;
			},
			async getOpsData() {
				let subData = {
					order_id: this.pickCarData.order_info.order_id,
					location: [ this.pickCarData.send_info.use_location.lng, this.pickCarData.send_info.use_location.lat ].toString()
				}
				let res = await getOpsInfo( subData );
				this.opsData = res;
			},
			async cancelOrder() {
				let subData = {
					order_id: this.pickCarData.order_info.order_id
				}
				try {
					let res = await checkCancel( subData );
					let money = res.money || ""
					let cancelorder = async ( res ) => {
						if ( res.confirm ) {
							try {
								let subData = {
									order_id: this.pickCarData.order_info.order_id,
									self_cancel: "1",
									cancel_type: "0",
									cancel_content: ""
								}
								let res = await cancelOrder( subData ); 
									this.backIndex(); 
							} catch ( res ) {
								this.$toast.info( res.message )
							}
						}
					}
					uni.showModal( {
						title: '提示',
						content: res.info,
						success: cancelorder
					} );
				} catch ( res ) {
					this.$toast.info( res.message )
				}
				
			},
			backIndex() {
				this.clearInterval();
				uni.navigateTo( {
					url: "/pages/index/index"
				} )
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
			}
		}
	}
</script>
<style lang="scss">
	@import "@/common/topbar.scss";

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

	.line-up-layer {
		position: fixed;
		bottom: 100upx;
		width: 100%;
		z-index: 3;

		.lup-wrap {
			color: #666;
			font-size: 30upx;
			border-radius: 15upx;
			background: #eee;
			width: 90%;
			margin: 0 auto;
			padding: 30upx;
			text-align: center;

			.lup-title {
				padding-bottom: 30upx;
			}

			.lup-content {
				display: flex;
				justify-content: space-between;

				.lup-item {
					width: 50%;
					text-align: center;

					.lup-text {
						display: block;
						padding-bottom: 10upx;

						.lup-num {
							font-size: 40upx;
							color: #FF9025;
						}
					}
				}
			}
		}
	}
</style>
