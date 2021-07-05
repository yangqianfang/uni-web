<template>
	<view class="wrap">
		<!-- item start  -->
		<view class="no-data"
		 v-if="nodata">没有预约订单</view>
		<view class="item"
		 v-for="(item,index) in orderList"
		 :key="index">
			<view class="conten-wrap">
				<view class="image-wrap">
					<view class="imagebox">
						<image :src="item.car_image"></image>
					</view>
					<text class="text">{{item.car_plate}}</text>
				</view>
				<view class="info-wrap">
					<view class="li">
						<text class="label">用车模式</text>
						<text class="label-text">{{item.use_time_type==0?'时租':'日租'}}</text>
					</view>
					<view class="li">
						<text class="label">用车位置</text>
						<text class="label-text">{{item.use_place}} </text>
					</view>
					<view class="li">
						<text class="label">下单时间</text>
						<!-- item.order_create_time -->
						<text class="label-text">{{item.order_create_time|formatTime}}</text>
					</view>
					<view class="li">
						<text class="label">用车时间</text>
						<text class="label-text">{{item.use_time|formatTime}} </text>
					</view>
					<view class="li">
						<text class="label">费用</text>
						<text class="label-text">{{item.power_on_price}}元/分钟(行驶) {{item.power_off_price}}元/分钟(临停) </text>
					</view>
				</view>
			</view>
			<view class="button-wrap">
				<button class="cancel-order"
				 @click="checkCancel(item)">取消订单</button>
				<button v-if="item.use_time_type != 0" class="pay-order" @click="gotoPay(item.pay_id)">去支付</button>
			</view>
		</view>
		<!-- item end  -->
	</view>
</template>
<script>
	import {
		planOrderList,
		checkCancel,
		cancelOrder
	} from "@/api/order"
	export default {
		components: {},
		data() {
			return {
				orderList: [],
				nodata: false
			}
		},
		onLoad() {},
		mounted() {
			this.getOrderList();
		},
		watch: {
			orderList( value ) {
				if ( value.length == 0 ) {
					this.nodata = true
				}
			}
		},
		computed: {},
		methods: {
			/* 订单列表  */
			async getOrderList() {
				try {
					let res = await planOrderList();
					this.orderList = res;
				} catch ( e ) {}
			},
			/* 取消订单检查  */
			async checkCancel( item ) {
				let subData = {
					order_id: item.order_id
				}
				try {
					let res = await checkCancel( subData );
					let cancelorder = async ( res ) => {
						if ( res.confirm ) {
							try {
								let res = await cancelOrder( subData );
								this.getOrderList()
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
			gotoPay(payId){
				uni.navigateTo({
					url: `/pages/settlement/settlement?payId=${payId}`
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "@/common/topbar.scss";

	.wrap {
		padding: 00upx;

		.item {
			border-bottom: 1px solid #E1E1E1;
			padding: 30upx;

			.conten-wrap {
				display: flex;

				.image-wrap {
					display: flex;
					flex-flow: column;

					.imagebox {
						width: 202upx;
						height: 132upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						text-align: center;
					}
				}

				.info-wrap {
					padding-left: 20upx;

					.li {
						display: flex;
						padding: 8upx 0;
						line-height: 40upx;

						.label {
							padding-right: 20upx;
							color: #696969;
							width: 200upx;
						}

						.label-text {
							width: 100%;
						}
					}
				}
			}
		}

		.button-wrap {
			padding: 10upx 0;
			display: flex;
			text-align: right;
			justify-content: flex-end;
			align-items: flex-end;
			button {
				margin: 0 10upx;
				padding: 10upx 20upx;
				font-size: 24upx;
				line-height: 30upx;
			}

			.cancel-order {
				border: 1px solid #999;
				background: #fff;
			}

			.pay-order {
				background: #ff9025;
				color: #fff;
				border: 1px solid #ff9025;
			}
		}
	}

	.no-data {
		text-align: center;
		padding: 30upx;
	}
</style>
