<template> 
	<!-- layerbox start -->
	<view class="layerbox"
	 :style="{top: scrolly ? 0:panelTop}">
	 <view class="car-content" v-if="currentstore.type == 3">
		   <view class="single-car-box">
			   <view class="car-item"
			    @click="panelClick(item,0)" >
			   	<view class="car-active"
			   	 v-if="item.active.length > 0"> 活动 </view>
			   	<view :class="'drive-limit-'+ driveLimit(item.drive_limit)"
			   	 v-if="item.drive_limit>0">
			   	</view>
			   	<view class="car-content">
			   		<view class="text-box">
			   			<view class="title">{{item.car_brand}} · {{item.seat_num}}座 · {{item.car_color}} </view>
			   			<view class="price">
			   				<view class="tips"
			   				 v-if="!item.predict_amount"
			   				 @click.stop="gotoValuation(item)">
			   					<text class="red">{{item.power_on_price}}元起</text>/分钟 <text class="iconfont icontanhao"></text>
			   				</view>
			   				<view class="tips"
			   				 @click.stop="gotoValuation(item)"
			   				 v-if="item.predict_amount"> 预估 <text class="red">{{item.predict_amount|toFixed}}</text>元 </view>
			   				<view v-if="item.taxi_amount"
			   				 class="throw-line"> 打车{{item.taxi_amount}}元 </view>
			   				<view v-if="item.diff_amount"
			   				 class="green"> 省{{item.diff_amount}}元 </view>
			   				<!-- <view class="mianpei">车损免赔</view> -->
			   			</view>
			   			<view class="endurance">
			   				<text class="iconfont iconicon-endurance"></text> 续航约{{item.remile}}km </view>
			   		</view>
			   		<view class="img-box">
			   			<view class="img">
			   				<image :src="item.car_image"></image>
			   			</view>
			   			<view class="text">{{item.car_plate}}</view>
			   		</view>
			   	</view>				
					<view class="car-address">取车位置：{{item.address}}</view>
			   </view>
			  
		   </view>
	 </view>
		<view v-if="currentstore.type != 3" class="layer-content"
		 @touchstart="touchstart"
		 @touchend="touchend">
			<view class="layer-top"> 
				<!-- nab-bar start -->
				<view class="nab-bar">
					<view class="nav">
						<text @click="tabClick(item)"
						 v-for="(item,index) in tabData"
						 :key="index"
						 :class="item.active?'active':''">
							{{item.name}}</text>
					</view>
					<view v-show="showtimebox"
					 class="timebox"
					 @click="showMulLinkageThreePicker">
						<text>{{pickerText? pickerText:'请选择时间'}}</text>
					</view>
				</view>
				<!-- nab-bar end -->
				<!-- address-bar start -->
				<view class="address-bar">
					<view class="address-li">
						<view class="dot-box">
							<view class="dot-green"></view>
						</view>
						<view class="address-text">
							<view class="title">{{startAddressText}}</view>
							<view class="tips">{{listData.point_title}}</view>
						</view>
					</view>
					<view class="address-li">
						<view class="dot-box">
							<view class="dot-orange"></view>
						</view>
						<view class="address-text">
							<view class="end-text"
							 v-if="endAddressText">
								<text @click="selectAddress">{{endAddressText}}</text>
								<uni-icons @click="deleteEndAddress"
								 class="icon"
								 type="clear"
								 size="22"
								 color="#999" />
							</view>
							<view v-if="!endAddressText"
							 class="default-text"
							 @click="selectAddress">选择目的地(可选)</view>
						</view>
					</view>
				</view>
				<!-- address-bar end -->
			</view>
			<!-- car-list start -->
			<scroll-view class="car-list"
			 :scroll-y="scrolly"
			 @scroll="scroll">
				<view class="carlist">
					<view class="car-title"
					 v-if="carListValue.length>0"> 就近自取</view>
					<view class="car-item"
					 @click="panelClick(item,0)"
					 v-for="(item,index) in carListValue"
					 :key="index">
						<view class="car-active"
						 v-if="item.active.length > 0"> 活动 </view>
						<view :class="'drive-limit-'+ driveLimit(item.drive_limit)"
						 v-if="item.drive_limit>0">
						</view>
						<view class="car-content">
							<view class="text-box">
								<view class="title">{{item.car_brand}} · {{item.seat_num}}座 · {{item.car_color}} </view>
								<view class="price">
									<view class="tips"
									 v-if="!item.predict_amount"
									 @click.stop="gotoValuation(item)">
										<text class="red">{{item.power_on_price}}元起</text>/分钟 <text class="iconfont icontanhao"></text>
									</view>
									<view class="tips"
									 @click.stop="gotoValuation(item)"
									 v-if="item.predict_amount"> 预估 <text class="red">{{item.predict_amount|toFixed}}</text>元<text class="iconfont icontanhao"></text></view>
									<view v-if="item.taxi_amount"
									 class="throw-line"> 打车{{item.taxi_amount}}元 </view>
									<view v-if="item.diff_amount"
									 class="green"> 省{{item.diff_amount}}元 </view>
									<!-- <view class="mianpei">车损免赔</view> -->
								</view>
								<view class="endurance">
									<text class="iconfont iconicon-endurance"></text> 续航约{{item.remile}}km </view>
							</view>
							<view class="img-box">
								<view class="img">
									<image :src="item.car_image"></image>
								</view>
								<view class="text">{{item.car_plate}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="catelist">
					<view class="car-title"
					 v-if="cateListValue.length>0"> 急速配送</view>
					<view class="car-item"
					 @click="panelClick(item,1)"
					 v-for="(item,index) in cateListValue"
					 :key="index">
						<view class="car-active"
						 v-if="item.active.length > 0"> 活动 </view>
						<view class="car-content">
							<view class="text-box">
								<view class="title">{{item.car_brand}} · {{item.seat_num}}座 </view>
								<view class="price">
									<view class="tips"
									 v-if="!item.predict_amount"
									 @click.stop="gotoValuation(item)">
										<text class="red">{{item.power_on_price}}元起</text>/分钟 <text class="iconfont icontanhao"></text>
									</view>
									<view class="tips"
									 @click.stop="gotoValuation(item)"
									 v-if="item.predict_amount"> 预估 <text class="red">{{item.predict_amount|toFixed}}</text>元 <text class="iconfont icontanhao"></text></view>
								</view>
								<view class="endurance"
								 v-sendTimeIntro>{{item.send_time_intro}}</view>
								<!-- <view v-if="!item.is_show" class="endurance" >{{item.send_time_intro}}</view>
								<view v-if="item.is_show" class="endurance" v-texttips>{{item.send_time_intro}}</view>		 -->
							</view>
							<view class="img-box">
								<view class="img">
									<image :src="item.car_image"></image>
								</view>
								<view class="text">{{item.cate_name}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="car-item">
			 	<view class="text-box">
			 		<view class="title">大众-五座-白色 </view>
			 		<view class="price">
			 			<view class="tips"><text class="red">0.65元</text>/分钟</view>
			 			<view class="mianpei">车损免赔</view>
			 		</view>
			 		<view class="endurance">续航约400km</view>
			 	</view>
			 	<view class="img-box">
			 		<view class="img"></view>
			 		<view class="text">京P562623</view>
			 	</view>
			 </view> -->
			</scroll-view>
			<!-- car-list end -->
		</view>
		<mpvue-time-picker :timeData="timeData"
		 :themeColor="themeColor"
		 ref="mpvueCityPicker"
		 :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel"
		 @onConfirm="onConfirm"></mpvue-time-picker>
		<layer-order :visible="isShowOrder"
		 :orderData="orderData"
		 @setUserLong="setUserLong"
		 @orderSubmit="orderSubmit"
		 @close="switchShowOrder"></layer-order>
	</view>
	<!-- layerbox end -->
</template>
<script>
	import mpvueTimePicker from '../mpvue-citypicker/mpvueCityPicker.vue';
	import layerOrder from '../layer-cover/layer-order.vue';
	import {
		getPlanTime,
		creatCarOrder,
		creatPlanOrder
	} from '@/api/index';
	import {
		formatData,
		getAddressByLnglat
	} from '@/lib/mapUtils';
	import {
		uniIcons
	} from '@dcloudio/uni-ui';
	import {
		localStorageKey
	} from '@/lib/base';
	import {
		orderSubmit
	} from '@/lib/orderUtils';
	import {
		param
	} from '@/lib/utils';
	const app = getApp();
	export default {
		components: {
			mpvueTimePicker,
			uniIcons,
			layerOrder
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			listData: {
				type: Object,
				default: null
			},
			startAddressTextValue: {
				type: String,
				default: ""
			},
			endAddressTextValue: {
				type: String,
				default: ""
			},
			driveValidState: {
				type: String,
				default: ""
			},
			cityInfo: {
				type: Object,
				default: null
			},
			location: {
				type: Object,
				default: null
			},
			endAddressLngLat: {
				type: Array,
				default: null
			},
			mapCenterData: {
				type: Array,
				default: null
			},
			ampa: {
				type: Object,
				default: null
			},
			currentStore: {
				type: Object,
				default: null
			},
			startAddressLngLat: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				startAddressText: "",
				endAddressText: "",
				startLngLat: [],
				endLngLat: [],
				userinfo: "",
				themeColor: '#ff9025',
				scrolly: false,
				swipTimeout: "",
				scrollTop: "",
				swipeFlag: true,
				startPagey: 0,
				endPagey: 0,
				tabData: [ {
					name: "现在",
					active: true,
					id: "1"
				}, {
					name: "预约",
					active: false,
					id: "2"
				} ],
				currentTab: null,
				pickerText: "",
				cityPickerValueDefault: [ 0, 0, 0 ],
				carListValue: [],
				cateListValue: [],
				isShowOrder: false,
				orderData: {
					car_brand: "",
					car_plate: "",
					price_type: "1",
					use_time: "1"
				},
				timeData: null,
				cityData: null,
				showtimebox: false,
				useLong: "0",
				endaddresslnglat: "",
				panelTop: "100%",
				mapcenterdata: [],
				Amap: null,
				panelMaxheigth:300,
				panelMimheigth:140
			}
		},
		computed: {
			currentstore() {
				return this.currentStore;
			},
			item(){
				/* 汽车 */
				if(this.currentStore.type == 3){
					return this.currentStore
				}
			},
			userlocation() {
				return this.location;
			}
		},
		created() {},
		watch: {
			cityInfo( value ) {
				this.cityData = value;
			},
			endAddressTextValue( value ) {
				this.endAddressText = value;
			},
			startAddressTextValue( value ) {
				
				this.startAddressText = value;
				uni.setStorageSync( localStorageKey.START_ADDRESS_TEXT, value )
			},
			listData( value ) {
				if ( value.cateList || value.carList ) {
					this.cateListValue = value.cateList;
					this.carListValue = value.carList;
				}
			},
			endAddressLngLat( value ) {
				this.endaddresslnglat = value;
			},
			mapCenterData( value ) {
				this.mapcenterdata = value;
			},
			ampa( value ) {
				this.Amap = value;
			},
			currentstore(value){  
				if(value && value.type == 3){
					this.getPanelTop(this.panelMimheigth)
				}else{ 
					this.getPanelTop(this.panelMaxheigth)
				}
			}
		},
		mounted() {
			this.currentTab = this.tabData[ 0 ];
			this.getPanelTop(this.panelMaxHeigth);
		},
		methods: {
			/* 切换 立即 预约 */
			async tabClick( item ) {
				this.tabData.map( item => {
					item.active = false
				} )
				item.active = true;
				if ( item.id == 2 ) { 
					!this.timeData && await this.getTimeData( this.cityData.city.cf_city, [ this.cityData.city.longitude, this.cityData.city
						.latitude
					] ); 					
					this.$refs.mpvueCityPicker.show()
					this.showtimebox = true;
				} else {
					this.showtimebox = false;
					this.$emit( "getNowCarList" );
					this.pickerText = "";
				}
				this.currentTab = item;
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			/* 滚动事件 */
			scroll( e ) {
				this.swipeFlag = false;
				if ( e.detail.scrollTop <= 0 ) {
					this.swipeFlag = true;
					return;
				}
				clearTimeout( this.swipTimeout );
				this.swipTimeout = setTimeout( () => {
					this.swipeFlag = true;
				}, 500 )
			},
			/* 点击目选择目的地打开地图 */
			selectAddress() {
				uni.navigateTo( {
					url: "/pages/search/search"
				} )
			},
			/* 点击删除目的按钮 */
			deleteEndAddress() {
				this.$emit( "removeEndAddress" );
			},
			switchShowOrder() {
				this.isShowOrder = !this.isShowOrder;
			},
			/* 获取预约时间 */
			async getTimeData( city, ...location ) {
				/* city	是	string	城市
				brand_cate	否	string	分类名称 */
				let res = await getPlanTime( {
					city: city,
					location: location
				} );
				this.timeData = res;
			},
			/* panel点击显示下单layer from 0 :车型 1:分类  */
			async panelClick( item, from ) {
				const {
					userinfo
				} = app.globalData
				//user_verify_type : 0 未审核，1 已审核通过，2 审核不通过，3 已提交，但是未审核，4 实习期 5 未登录用户，6 驾照过期  7、8 已审核，待上传
				if ( userinfo.user_verify_type !== 1 && userinfo.user_verify_type !== 3) {
					this.$emit( "switchShowCheck" )
					return
				}

				if ( userinfo.face_id_status !== 1) {
					if(userinfo.face_id_status === 2){
						this.$toast.info('人脸识别正在审核中，5分钟内审核完成。')
					}else{
						this.$emit( "switchShowFace" )
					}
					return
				}
				
				/* 订单类型 1立即用车 2预约用车 3预约日租 */
				let orderType = 1; 
				if(this.showtimebox){
					 if(this.useLong == 0 ){
						 orderType = 2
					 }else{
						  orderType = 3
					 }
					  
				}
			 
				let address = this.currentstore.address;
				
				if ( !address ) {
					address = await getAddressByLnglat( this.Amap, this.mapcenterdata );
				} 
				item.use_car_type = this.currentTab.id; //1 A立即 2预约
				item.from = from;
				item.order_type = orderType;
				item.use_time = this.currentTab.id == 1 ? parseInt( new Date().getTime() / 1000 ) : formatData( this.pickerText ); //预约时间 
				item.city_data = this.cityData;
				item.userlocation = [ this.userlocation.position.lng, this.userlocation.position.lat ].toString();
				item.currentstore = this.currentstore;
				item.mapcenterdata = this.mapcenterdata.toString();
				item.address = address;
				item.startAddressLngLat = this.startAddressLngLat.toString()
				this.orderData = item; 
				this.switchShowOrder();
				try {
					uni.setStorageSync( localStorageKey.ORDER_INFO, item );
				} catch ( e ) {}
			},
			/* 设置用车天数 */
			setUserLong( useLong ) {
				this.useLong = useLong;
			},
			/* 订单提交 */
			async orderSubmit( safevalue ) {
				let orderData = Object.assign( {}, this.orderData ),
					subData = {};
				/* 创建自取订单 */
				if ( orderData.from == "0" ) {
					subData = {
						car_id: orderData.car_id,
						city: orderData.city_data.city.cf_city,
						is_buy_safe: safevalue || "", //是否购买保险 购买(还传保险id) 不购买("")					
						use_long: this.useLong,
						use_time_type: this.useLong != 0 ? "1" : "0" // 0时租 1日租
					}
					let res = orderSubmit( subData, "0" );
					res.then( ( res ) => {
						if ( res ) {
							this.gotoPickCar(res.order_info.order_id);
						}
					}, ( res ) => {
						this.$toast.info( res.message )
					} )
				} 
				/* 创建送车订单 */
				if ( orderData.from == "1" ) {
					
					let orderType = orderData.order_type					 
					if(this.showtimebox){
						 if(this.useLong == 0 ){
							 orderType = 2
						 }else{
							  orderType = 3
						 }						  
					}else{
						if(this.useLong > 0){
							 orderType = 3
						}
					}
					
					subData = {
						city: orderData.city_data.city.cf_city,
						location: orderData.currentstore.lng ? [ orderData.currentstore.lng, orderData.currentstore.lat ].toString() : this
							.mapcenterdata.toString(),
						address: orderData.address,
						use_long: this.useLong, //用车天数 0为时租 1天 2 第三天
						use_time: orderData.use_time,
						is_buy_safe: safevalue || "",
						brand_cate: orderData.cate_name,
						create_location: orderData.userlocation.toString(),
						order_type:orderType//订单类型 1立即用车 2预约用车 3预约日租
					}   
					try{
						let res = await orderSubmit( subData, "1" ); 
						/* 预约用车到首页 */
						//"use_car_type": 0,用车类型 （0自取 1立即 2预约）
												
						if(res.pay_record_info.pay_id){
							this.gotoPay(res.pay_record_info.pay_id);
						} else if(res.order_info.use_car_type == 2){
							this.gotoInex();
							//this.$emit("getPlanOrder")
							this.$toast.info( "预约成功！" )
						}else if(res.order_info.use_car_type == 0 || res.order_info.use_car_type == 1){
							this.gotoPickCar(res.order_info.order_id);
						} 
					}catch(res){
						this.$toast.info( res.message )
					}  
				}
			},
			/* */
			onCancel( e ) { 
				this.tabClick(this.tabData[0]);
			},
			/* 页面跳转至取车页面 */
			gotoPickCar(orderid) {
				uni.navigateTo( {
					url: `/pages/pickcar/pickcar?orderId=${orderid}`
				} )
			},
			gotoInex() {
				uni.redirectTo( {
					url: "/pages/index/index"
				} )
			},
			gotoPay(payId){
				uni.navigateTo({
					url: `/pages/settlement/settlement?payId=${payId}`
				})
			},
			/* 预约时间确定按钮点击事件 */
			onConfirm( e ) {
				this.pickerText = e.label;
				this.$emit( "getYuyueCarList", {
					use_car_type: "2", //用车方式 0自取 1 立即 2预约
					use_time: formatData( this.pickerText )
				} )
			},
			close() {
				this.$emit( 'close' )
			},
			touchstart( event ) {
				this.startPagey = event.touches[ 0 ].pageY;
			},
			gotoValuation( item ) {
				let city = this.cityData.city.cf_city;
				let parms = {
					city: this.cityData.city.cf_city,
					brand_cate: item.brand_cate ? item.brand_cate : item.cate_name,
					miles: 0,
					drive_time: 0,
					use_time: 0,
					power_off_time: 0,
					//start_location: [ this.userlocation.position.lng, this.userlocation.position.lat ].toString(),
					start_location: this.startAddressLngLat.toString(),
					return_location: this.endaddresslnglat.toString(),
				}
				let pstr = param( parms );
				uni.navigateTo( {
					url: "/pages/valuation/valuation?" + pstr
				} )
			},
			touchend( event ) {
				if ( !this.swipeFlag ) {
					return;
				}
				this.endPagey = event.changedTouches[ 0 ].pageY;
				let distence = 10;
				if ( this.endPagey - this.startPagey > 0 && Math.abs( this.endPagey - this.startPagey ) > distence ) {
					this.scrolly = false;
				}
				if ( this.endPagey - this.startPagey < 0 && Math.abs( this.endPagey - this.startPagey ) > distence ) {
					this.scrolly = true;
				}
			},
			driveLimit( value ) {
				if ( !this.cityData ) {
					return
				}
				return this.cityData.city.cf_city == "武汉市" ? value == 3 || value == 1 ? 3 : 2 : value == 3 || value == 1 ? 1 : 2;
			},
			getPanelTop(h) {
				uni.getSystemInfo( {
					success: ( res ) => {
						this.panelTop = res.windowHeight - h + 'px'
					}
				} )
			},
		},
		directives: {
			sendTimeIntro: function( el, binding ) {
				let text = el.innerHTML,
					reg = /#(.*?)#/,
					subtext = text.match( reg );
				if ( subtext ) {
					el.innerHTML = text.replace( reg, "<text style='color:orange;font-size:28upx'>" + subtext[ 1 ] + "</text>" );
				}
			}
		}
	}
</script>
<style lang='scss'
 scope>
	.numtext {
		color: #ff9025;
		font-size: 22upx;
	}

	.layerbox {
		position: absolute;
		top: 100%;
		/* top:100vh; */
		width: 100%;
		height: 100vh;
		z-index: 3;
		background: #fff; 
		transition: all 0.3s;
	}

	.animi-to-top {
		top: 0;
	}

	.nab-bar {
		display: flex;
		justify-content: space-between;
		padding: 30upx 30upx 0 30upx;
		font-size: 30upx;
		color: #696969;
		height: 80upx;
		;
	}

	.nab-bar .nav text {
		margin-right: 55upx;
		padding-bottom: 3upx;
	}

	.nab-bar .nav text.active {
		color: #333;
		border-bottom: 8upx solid #ff9025;
	}

	.timebox {
		height: 70upx;
	}

	.dot-green {
		width: 14upx;
		height: 14upx;
		border-radius: 50%;
		background: #30d4a0;
	}

	.dot-orange {
		width: 14upx;
		height: 14upx;
		border-radius: 50%;
		background: #ff9025;
	}

	.address-bar {
		padding-left: 30upx;
	}

	.address-li {
		display: flex;
	}

	.dot-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-right: 17upx;
	}

	.address-text {
		font-size: 28upx;
		border-bottom: 1px solid #f3f3f3;
		flex: 1;
		padding: 20upx 20upx 20upx 0;

		.end-text {
			display: flex;
			position: relative;

			.icon {
				position: absolute;
				right: 20upx;
			}
		}

		.default-text {
			color: #999;
		}
	}

	.address-text .title {
		font-size: 30upx;
		height: 50upx;
		margin: 0 0 5upx 0;
		line-height: 50upx;
		overflow: hidden;
	}

	.address-text .tips {
		font-size: 26upx;
		color: #ff9025;
	}

	.address-text input {
		font-size: 30upx;
	}

	.car-list {
		padding: 310upx 20upx 0 20upx;
		height: 100vh;
		background: #fff;
	}

	.overflow {
		overflow: auto;
	}

	.timebox {
		-moz-box-shadow: 0px 2px 10px #f0f0f0;
		-webkit-box-shadow: 0px 2px 10px #f0f0f0;
		box-shadow: 0px 2px 10px #f0f0f0;
		border-radius: 30upx;
		height: 60upx;
		line-height: 60upx;
		font-size: 30upx;
		padding: 0 30upx;
	}

	.car-title {
		padding: 0upx 10upx;
		font-size: 24upx;
	}

	.car-item {
		padding: 20upx 30upx;
		border-radius: 10upx;
		margin: 20upx 0;
		-moz-box-shadow: 0px 0px 10px #eeeeee;
		-webkit-box-shadow: 0px 0px 10px #eeeeee;
		box-shadow: 0px 0px 10px #eeeeee;
		background: #fff;
		position: relative;

		.car-active {
			position: absolute;
			top: 0;
			right: 0;
			background: #FF0000;
			color: #fff;
			font-size: 20upx;
			z-index: 5;
			border-radius: 0px 15upx;
			padding: 3upx 15upx;
		}

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

		.car-content {
			display: flex;
			justify-content: space-between;

			.text-box {
				padding-right: 20upx;

				.title {
					font-size: 30upx;
					margin: 15upx 0;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical
				}

				.price {
					overflow: hidden;
					padding: 10upx 0;
					font-size: 26upx;

					.red {
						color: #ff3030;
					}

					.green {
						color: #1AAD19;
						font-size: 20upx;
						padding: 5upx;
					}

					.throw-line {
						padding: 5upx;
						text-decoration: line-through;
						font-size: 20upx;
					}

					view {
						overflow: hidden;
						float: left;
					}

					.mianpei {
						background: url(/static/icon-04.png) no-repeat right center;
						padding: 0 40upx 0 20upx;
						background-size: 25upx 28upx;
					}
				}

				.endurance {
					font-size: 26upx;
					padding: 15upx 0upx 15upx 0upx;

					.numtext {
						color: #ff9025;
						font-size: 22upx;
					}
				}
			}

			.img-box {
				width: 211upx;
				height: 138upx;

				.img {
					background: url(/static/car-01.png) no-repeat;
					background-size: cover;
					width: 211upx;
					height: 138upx;

					image {
						width: 211upx;
						height: 138upx;
					}
				}

				.text {
					text-align: center;
					padding: 10upx 0;
					font-size: 30upx;
				}
			}
		}
	}

	.testbox {
		overflow: hidden;

		button {
			display: block;
			float: left;
			margin: 5upx;
			font-size: 24upx;
		}
	}

	.layer-content {
		position: relative;

		.layer-top {
			position: absolute;
			top: 0;
			background: #fff;
			width: 100%;
		}
	}
	
	.single-car-box .car-item{
		margin: 0;
	    .car-address{
		padding: 10upx 30upx;
		font-size: 28upx;
		margin-top: 5px;
		border-top: 1px solid #eee;
		}
	}
</style>
