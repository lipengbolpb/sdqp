<template>
	<!-- 扫点得 中奖纪录 -->
	<view class="winningRecord flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="换购商品"></uni-nav-bar>

		<view class="wr-center flex-xn-ys" id="wr-center">
			<view class="flex-xsb-yc wr-center-title" id="wr-center-title">
				<block v-for="(item,index) in tabArr">
					<view class="" @click='tabSwitch(index)'>
						<view :class="tabIsCur==index?'tabOn':''">{{ item.text }}</view>
					</view>
				</block>
			</view>
			<scroll-view v-if="isHasData" :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox">
				<block v-if="sendData.searchFlag==2">
					<!-- 已兑换：2 -->
					<view class="wrc-listBox-list flex-xsb-yn" v-for="item in prizeAry" :key="item.id">
						<view class="">
							<view class="wrc-listBox-list-mes huangou-mes">兑换地点：{{ item.terminalName }}</view>
							<!-- <view class="wrc-listBox-list-time">兑换时间：{{ item.exchangeTime.split(' ')[0] }}</view> -->
							<view class="wrc-listBox-list-time">兑换时间：{{ item.exchangeTime }}</view>
						</view>
						<view class="huangouR">
							<view class="wrc-listBox-list-price"><text>{{ item.exchangeNum }}</text>{{ item.unitName }}</view>
							<!-- <view class="huangouR-btn">查看详情</view> 这期先不做 -->
						</view>
					</view>
				</block>
				<block v-else>
					<!-- 待兑换：1 已过期：3 -->
					<view class="wrc-listBox-list flex-xsb-yn" v-for="item in prizeAry" :key="item.id">
						<view class="">
							<view class="wrc-listBox-list-mes">{{ item.skuName }}</view>
							<view class="wrc-listBox-list-time">中奖时间：{{ item.earnTime }}</view>
							<view class="wrc-listBox-list-time">{{ item.showTimeLabel }}：{{ item.showTime }}</view>
						</view>
						<view class="flex-xn-yc">
							<view class="wrc-listBox-list-price"><text>1 </text>{{ item.unitName }}</view>
						</view>
					</view>
				</block>
				<view class="clickMore" @click="clickMore" v-show="moneyNext">
					点击加载更多
				</view>
				<view class="clickMore colorGrey" v-show="!moneyNext">
					加载完毕
				</view>
			</scroll-view>

			<block v-else>
				<view class="wrc-nodata flex-xc-yc-dirY">
					<image src="../../static/crownCookiesImg/zanwujilu.jpg" mode="widthFix"></image>
					<view class="">暂无中奖记录，再接再厉哦～</view>
				</view>
			</block>
		</view>

		<view class="wr-title-box flex-xc-yc">
			<view @click="jumpFun(1)">兑换方式</view>
			<!-- <view @click="jumpFun(3)">附近可兑换门店</view> 这期不做-->
			<view @click="jumpFun(2)">活动细则</view>
		</view>

		<!-- 已兑换 商品 查看详情 弹窗详情显示 这期先不做 -->
		<view class="detailDialog" v-show="detailDialog">

			<view class="customDialog-mask" @click="closeCustomDialog"></view>
			<!-- 目前 用到 填写中奖 信息 -->
			<view class="customDialog-center">
				<view class="customDialog-warp">
					<view class="">换购门店：老张烟酒店</view>
					<view class="">门店地址：山东</view>
					<view class="">换购时间：44484848</view>
					<view class="">换购商品：</view>
					<view class="customDialog-warp-detail">
						
						<view class="flex-xsb-yn">
							<view class="">就行车公</view>
							<view class="">数量</view>
						</view>
						
					</view>
				</view>
				<view class="customDialog-close">
					<image @click="closeCustomDialog" :src="commonImg+'dialogClose.png'" mode="widthFix"></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		queryExchangePrizeAllLst
	} from '@/common/getData.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		name: 'winningRecord',
		components: {
			uniNavBar
		},
		computed: {
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			safeAreaTop() {
				const userSystemInfo = uni.getStorageSync('userSystemInfo');
				let safeAreaTop = '30'
				if (userSystemInfo) {
					safeAreaTop = userSystemInfo.safeArea.top == 0 ? '30' : userSystemInfo.safeArea.top;
				} else {
					safeAreaTop = '30';
				}
				console.log('safeAreaTopsafeAreaTopsafeAreaTopsafeAreaTop');
				console.log(safeAreaTop);
				return safeAreaTop;
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commonImg: config.staticUrl + 'CommonImg/',
				showType: false,
				prizeAry: [], // 承载 接口 返回的 数组
				moneyNext: true,

				sendData: {
					count: 10, // 调用 接口 所需参数
					currentPage: 1, // 调用 接口 所需参数
					searchFlag: 1, // 调用 接口 所需参数
				},
				scrollViewHeight: '', //滚动区域的高度
				tabIsCur: 0,
				isHasData: false,
				detailDialog:false,
				tabArr: [{
					text: '待兑换'
				}, {
					text: '已兑换'
				}, {
					text: '已过期'
				}, ]
			};
		},
		async onLoad() {
			this.initData();
			const that = this;
			wx.createSelectorQuery()
				.select('#wr-center')
				.boundingClientRect()
				.select('#wr-center-title')
				.boundingClientRect()
				.exec(function(res) {
					const scrollViewHeight = parseFloat(res[0].height - res[1].height - 60).toFixed(2);
					that.scrollViewHeight = scrollViewHeight;
				});
		},
		methods: {
			tabSwitch(index) {
				const searchFlag = parseInt(index) + 1;
				this.tabIsCur = index;
				this.prizeAry = [];
				this.sendData.currentPage = 1;
				this.sendData.searchFlag = searchFlag;
				this.initData()
			},
			initData() {
				// 先这样 后期 考虑缓存数据
				const that = this;
				queryExchangePrizeAllLst(that.sendData.currentPage, that.sendData.count, that.sendData.searchFlag).then(res => {
					console.log('queryExchangePrizeAllLst');
					console.log(res);
					if (res.prizeAry.length < 1) {
						that.isHasData = false;
					} else {
						that.isHasData = true;
					}
					console.log('2222222222');
					console.log(res.prizeAry.length);
					console.log(that.isHasData);
					// 判断 是否有下一页 拿 that.count 和当前数组长度 比较 
					if (res && (!res.prizeAry || res.prizeAry.length < that.sendData.count)) {
						that.moneyNext = false;
					} else {
						that.moneyNext = true;
					}
					if (that.sendData.currentPage == 1) {
						that.prizeAry = res.prizeAry;
					} else {
						if (res.prizeAry && res.prizeAry.length > 0) {
							that.prizeAry = that.prizeAry.concat(res.prizeAry);
						}
					}

					that.prizeAry.map((v) => {
						console.log(v);
						if(v.exchangeTime){
							v.exchangeTime = v.exchangeTime.split(' ')[0]
						}
						if(v.earnTime){
							v.earnTime = v.earnTime.split(' ')[0]
						}
						if (v.exchangeDate) {
							v.showTime = v.exchangeDate.split(' ')[0];
							v.showTimeLabel = '兑奖日期';
							return v;
						} else if(v.expireTime){
							v.showTime = v.expireTime.split(' ')[0];
							v.showTimeLabel = '兑奖截止';
							return v;
						}
					})

					console.log(that.prizeAry);

				});
			},

			clickMore() {
				const that = this;
				if (that.moneyNext) {
					that.sendData.currentPage++;
					that.initData();
				} else {
					uni.showToast({
						title: '没有更多了记录了',
						icon: 'none'
					});
				}
			},
			// 返回
			back() {
				uni.navigateBack(1);
			},

			jumpFun(jumpType) {
				let redirectUrl = '';
				if (jumpType == 3) {
					// 附近门店 
					// redirectUrl = 'mybagNew'+jumpType
				} else {
					redirectUrl = '/pages/saoDianDe/JinMai/rule?type=' + jumpType;
				}
				uni.redirectTo({
					url: redirectUrl
				})
			},
		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.winningRecord {
		height: 100%;
		background: url($commonImg+'sucBg.png') no-repeat center;
		background-size: cover;
	}

	.wr-title-box {
		// border-radius: 20rpx;
		margin: 0 30rpx 20rpx 30rpx;

		// background: #fff;
		// padding: 30rpx 0 ;
		view {
			font-size: 26rpx;
			padding: 12rpx 30rpx;
			color: #65BD6A;
			border: 2rpx solid #65BD6A;
			border-radius: 66rpx;
		}
		view:nth-of-type(1){
			margin-right: 40rpx;
		}
	}

	.wr-center {
		border-radius: 20rpx;
		flex: 1;
		margin: 0 30rpx 30rpx 30rpx;
		background: #fff;
		padding: 32rpx 0;
	}

	.wrc-listBox {
		flex: 1;
		width: auto;
		margin: 0 32rpx;
	}

	.wrc-listBox-list {
		padding: 20rpx 0;
		border-bottom: 2rpx solid #dedede;
	}

	.wrc-listBox-list-mes {
		margin-bottom: 16rpx;
		font-size: 32rpx;
		color: #333;
	}

	.wrc-listBox-list-time {
		font-size: 24rpx;
		color: #999999;
	}

	.wrc-listBox-list-price {
		font-size: 24rpx;
		color: #f10000;

		text {
			font-size: 36rpx;
		}
	}

	.wrc-listBox-list-danmai {
		font-size: 30rpx;
		color: #f10000;
	}

	.wrc-titleImg {
		width: 70%;
		margin-bottom: 20rpx;
	}

	.wrc-nodata {
		margin-top: 54%;
		transform: translateY(-50%);

		image {
			width: 100%;
		}

		view {
			font-size: 30rpx;
			color: #656565;
			margin-top: 40rpx;
		}
	}

	.clickMore {
		text-align: center;
		margin-top: 20rpx;
	}

	.colorGrey {
		color: #999999;
	}

	.wr-title-box-center {
		position: relative;
		border-bottom: 1rpx dotted #2B8541;

		.tixian-box {
			position: absolute;
			right: -30rpx;
			top: 0;
			width: 130rpx;
			height: 68rpx;
			line-height: 68rpx;
			background: linear-gradient(to right, #01B971, #7BD367);
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			border-bottom-left-radius: 34rpx;
			border-top-left-radius: 34rpx;
		}
	}

	.wr-title-box-zhanghu {
		image {
			width: 32rpx;
			margin-right: 24rpx;
		}

		&>view {
			font-size: 36rpx;
			color: #000000;

			text {
				color: #F14701;
			}
		}
	}

	.wr-title-box-lishijine {
		margin-top: 34rpx;
		margin-bottom: 40rpx;

		view {
			font-size: 26rpx;
		}

		view:nth-of-type(1) {
			color: #656565;
			margin-left: 60rpx;
		}

		view:nth-of-type(2) {
			color: #999999;
		}
	}

	.wr-title-box-mes {
		font-size: 18rpx;
		color: #999999;
		line-height: 26rpx;
		margin-top: 20rpx;
		position: relative;

		image {
			width: 240rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	.wr-center-title {
		border-bottom: 1rpx solid #EEEEEE;

		view {
			flex: 1;
			text-align: center;

			view {
				width: 50%;
				margin: 0 auto;
				padding-bottom: 20rpx;
				color: #333333;
			}
		}
	}

	.tabOn {
		border-bottom: 5rpx solid #65BD69;
		color: #65BD69 !important;
	}

	.huangouR {
		text-align: right;

		.huangouR-btn {
			padding: 7rpx 30rpx;
			border-radius: 8rpx;
			color: #FA2900;
			border: 2rpx solid #FA2900;
			font-size: 22rpx;
			margin-top: 24rpx;
		}

		.huangou-mes {
			margin-bottom: 32rpx;
		}
	}

	// 已兑换商品 查看详情 s
	.customDialog-mask {
		width: 100%;
		height: 100%;
		background: #000;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		opacity: .6;
	}

	.customDialog-center {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 100;
		width: 80%;
		background: #fff;
		border-radius: 30rpx;
		transform: translate(-50%, -50%);
		height: 700rpx;
		background: url($commonImg+'huangouDialogBg.png') no-repeat center;
		background-size: cover;
	}
	.customDialog-close {
		width: 60rpx;
		position: absolute;
		top: -68rpx;
		right: -22rpx;
	
		image {
			width: 100%;
		}
	}
	// 已兑换商品 查看详情 e
</style>
