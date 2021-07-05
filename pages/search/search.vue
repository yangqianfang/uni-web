<template>
    <view class="container">
		<!-- <view class="map-container" id="map-container" v-show="isMap"></view> -->
		<view class="container-header">
			<view class="search-header">
				<view class="search-container">
					<!-- <uni-icons
						type="search"
						size="22"
						color="#999"
						class="icon-search"
					/> -->
					<text class="iconfont iconsousuo"></text>
					<input class="uni-input" v-model="key" placeholder="请输入位置" @input="onSearch"/>
					<!-- <view class="btn-map" @click="showMap"><text>|</text>地图</view> -->
				</view>
				<text class="btn-cancel" @click="onCancel">取消</text>
			</view>
		</view>
		<view class="search-result" :style="{height:listHeight}">
			<view class="search-item" v-for="(item, index) in mapList" :key="index" @click="onChoose(item.location, item.name)">
				<text class="iconfont iconweizhi"></text>
				<view class="search-block item-content">
					<view class="address-name">{{item.name}}<text>附近5处还车网点</text></view>
					<text class="address-desc">{{item.district}} 距离当前位置12km</text>
				</view>
				<view class="search-block item-opt">
					<text class="iconfont icon-iconbianzubeifenx3"></text>
				</view>
			</view>
		</view>
		<view class="clear-btn" v-if="mapList.length > 0" @click="clearHistory">清空历史记录</view>
    </view>
</template>
<script>
import { uniIcons } from '@dcloudio/uni-ui'
import { param } from '@/lib/utils'
import { localStorageKey } from '@/lib/base';
// import AMapJS from "amap-js";
module.exports = {
    data: function() {
        return {
			key:'',
			lng: 0,
			lat: 0,
			mapList: [],
			listHeight: 0,
			AMap: null,
			isMap: false,
			type: ''   // 区分调用功能
		}
	},
	components: {
		uniIcons
	},
    methods: {
		/**
		 * 搜索
		 * 
		 * @param {Object} event event对象
		 * 
		 */
		onSearch(event) {
			this.AMap.plugin('AMap.Autocomplete', ()=>{
				// 实例化Autocomplete
				var autoOptions = {
					//city 限定城市，默认全国
					city: '全国'
				}
				var autoComplete= new this.AMap.Autocomplete(autoOptions);
				autoComplete.search(event.target.value, (status, result)=>{
					console.log("result",result)
					// 搜索成功时，result即是对应的匹配数据
					if(status === 'complete'){
						let newArr = result.tips.filter((item)=>{
							return item.location !== ''
						})
						this.mapList = newArr
						
					}
				})
			})
		},
		/**
		 * 获取屏幕高度
		 */
		getSystemHeight() {
			uni.getSystemInfo({
				success: (res)=>{
					this.listHeight = res.windowHeight - 80 - 50 + 'px'
				}
			})
		},
		/**
		 * 清除历史
		 */
		clearHistory() {
			this.mapList = []
		},
		/**
		 * 取消
		 */
		onCancel() {
			if(this.isMap){
				this.isMap = false
			}else{
				uni.navigateBack()
			}
		},
		/**
		 * 选择地点
		 * 
		 * @param {String} location 位置
		 * @param {String} name 位置名称
		 * 
		 */
		onChoose(location, name) { 
			let info = location
			info.name = name 
			uni.navigateBack();
			try {
				if(this.type){
					uni.setStorageSync(this.type, info);
				}else{
					uni.setStorageSync(localStorageKey.END_ADDRESS_TEXT, info);
				}
			} catch (e) { }
		}
	},
	onLoad(option) {
		this.getSystemHeight()

		this.type = option.type
	},

	mounted() {
		// 调用load方法加载loader并调用执行回调。
		this.$aMapJSAPILoader.load().then((AMap) => {
			this.AMap = AMap
		}).catch(function(e) {
			console.log('map fail')
		}).finally(function() {
			// 总是执行
			console.log('map finally')
		});
	}
};
</script>
<style lang="scss" scope>
.container {
	.map-container{
		top:0;
		left:0;
		position: fixed;
		z-index: 1;
		height: 100%;
		width: 100%;
		background: #eee;
	}
	.container-header{
		position: fixed;
		z-index:2;
		top:0;
		left:0;
		width:100%;
		// background: #FFF;
	}

    .search-header {
        display: flex;
		padding: 40upx;
		background: #FFF;
    }

    .search-container {
        flex: 1;
        height: 88upx;
        line-height: 88upx;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0upx 4upx 20upx 0upx rgba(0, 0, 0, 0.09);
        border-radius: 88upx;
        padding-left: 60upx;
        position: relative;

        .iconsousuo {
			position: absolute;
			top: 22upx;
			left: 30upx;
			z-index: 11;
			line-height: 44upx;
			font-size: 28upx;
        }

        .uni-input {
            display: inline-block;
			height: 88upx;
			// line-height: 88upx;
			width: 100%;
			padding-left: 20upx;
        }
        .btn-map {
            position: absolute;
            color: #999999;
            font-size: 28upx;
            top: 0;
            z-index: 11;
            right: 28upx;

            text {
                margin-right: 20upx;
                color: #e7e7e7;
            }
        }
    }
    .btn-cancel {
        width: 60upx;
        height: 88upx;
        font-size: 30upx;
        font-weight: 400;
        color: #999999;
        line-height: 88upx;
        margin-left: 30upx;
    }
	.search-result{
		margin-top: 160upx;
		overflow-y: auto;
	}
	.search-item{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #E6E6E6;

		.search-block{
			.address-name{
				font-size: 28upx;
				color:#333333;
				font-weight: bold;

				text{
					font-size: 22upx;
					color:#30D4A0;
					margin-left: 10upx;
				}
			}
			.address-desc{
				font-size: 22upx;
				color:#999999;
			}
		}
		.item-content{
			flex:1;
		}
		.item-icon{
			width: 80upx;
			text-align: center;
		}
		
		.item-opt{
			width: 140upx;

			text{
				float: right;
			}
		}
	}
	.clear-btn{
		font-size:24upx;
		color:#999999;
		text-align: center;
		margin:28upx;
	}
	.iconweizhi{
		margin-right: 20upx;
		color: #cccccc;
	}
	.iconsousuo{
		color: #999;
	}
}
</style>
