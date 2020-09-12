<template>
	<!-- 扫点得 我的实物奖 -->
	<view class="winningRecord flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="抽奖明细"></uni-nav-bar>
		<view class="flex-xsb-yc wr-center-title" id="wr-center-title">
			<!-- <block v-for="(item,index) in tabArr">
				<view class="" @click='tabSwitch(index)'>
					<view :class="tabIsCur==index?'tabOn':''">{{ item.text }}</view>
				</view>
			</block> -->
			<view class="jifenchoujiang">
				<image :src="staticUrl+'personalCenter/jifenchoujiang.png'"></image>
			</view>
		</view>
		<view class="wr-center flex-xn-ys" id="wr-center">
			<scroll-view v-if="isHasData" :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox">
				<!--  0 待领取 1 已领取 2 已过期 -->
				<view class="wrc-listBox-list flex-xsb-yn" v-for="(item,index) in prizeRecordAry" :key="index">
					<view class="flex-xn-yc">
						<view class="prizeImg-box">
							<image :src="item.goodsUrl" mode="widthFix"></image>
						</view>
						<view class="">
							<view class="wrc-listBox-list-mes">{{ item.goodsShortName }}</view>
							<view class="wrc-listBox-list-time">中奖时间：{{ item.exchangeTime }}</view>
							<!-- <view class="wrc-listBox-list-time">{{ item.showTimeLabel }}：{{ item.showTime }}</view> -->
						</view>
					</view>
					<view class="flex-xn-yc">
						<view class="wrc-listBox-list-right-dailing" @click="getPrize(item)" v-if='item.useStatus == 0'>领取</view>
						<view class="wrc-listBox-list-right-chakan" @click="viewDetails(item)" v-else-if='item.useStatus == 1'>查看</view>
						<view class="wrc-listBox-list-right-yiguoqi" v-else> <image :src="commonImg+'hongbaoguoqi.png'"></image> </view>
					</view>
				</view>
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

		<!-- 已兑换 商品 查看详情 弹窗详情显示 这期先不做 -->
		<view class="detailDialog" v-show="detailDialog">
			<view class="customDialog-mask" @click="closeCustomDialog"></view>
			<!-- 目前 用到 填写中奖 信息 -->
			<view class="customDialog-center">
				<view class="customDialog-warp">
					<view class="customDialog-center-title">
						中奖信息
					</view>
					<view class="customDialog-center-common">中 奖 码：{{ winningInformation.prizeVcode }}</view>
					<view class="customDialog-center-common">中奖产品：{{ winningInformation.prizeName }}</view>
					<view class="customDialog-center-common">中奖时间：{{ winningInformation.earnTime }}</view>
					<view class="customDialog-center-common">兑奖截止：{{ winningInformation.expireTime }}</view>
					<view class="customDialog-center-common">联 系 人：{{ winningInformation.userName }}</view>
					<view class="customDialog-center-common">联系电话：{{ winningInformation.phoneNum }}</view>
					<view class="customDialog-center-zixun flex-xc-yc"> 
					  <view class=""> <image :src="commonImg+'dianhuaIcon.png'"></image> </view>
					  <view class="">资讯电话：600-6800-0899</view>
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
	/**
	 *  exchangeType 1:实物 4：积分 5：现金 6：谢谢惠顾 
	 * 
	 * 
	 * **/
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getExchangeRecordRequst
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
				prizeRecordAry: [], // 承载 接口 返回的 数组
				moneyNext: true,

				sendData: {
					count: 10, // 调用 接口 所需参数
					currentPage: 1, // 调用 接口 所需参数
					useStatus: 0, // 调用 接口 所需参数
				},
				scrollViewHeight: '', //滚动区域的高度
				tabIsCur: 0,
				isHasData: false,
				detailDialog:false,
				tabArr: [{
					text: '待领取'
				}, {
					text: '已领取'
				}, {
					text: '已过期'
				}, ],
				winningInformation:{} // 中奖信息 已领取 tab 中 点击 查看 弹出框内 所需的 展示字段
			};
		},
		onLoad() {
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
				this.tabIsCur = index;
				this.prizeRecordAry = [];
				this.sendData.currentPage = 1;
				this.sendData.useStatus = index;
				this.initData()
			},
			initData() {
				// 先这样 后期 考虑缓存数据
				const that = this;
				getExchangeRecordRequst('3',that.sendData.currentPage, that.sendData.count).then(res => {
					console.log('getExchangeRecordRequst');
					console.log(res);
					if (res.reply.length < 1) {
						that.isHasData = false;
					} else {
						that.isHasData = true;
					}
					// 判断 是否有下一页 拿 that.count 和当前数组长度 比较 
					if (res && (!res.reply || res.reply.length < that.sendData.count)) {
						that.moneyNext = false;
					} else {
						that.moneyNext = true;
					}
					if (that.sendData.currentPage == 1) {
						that.prizeRecordAry = res.reply;
					} else {
						if (res.reply && res.reply.length > 0) {
							that.prizeRecordAry = that.prizeRecordAry.concat(res.reply);
						}
					}
					
					console.log(that.prizeRecordAry); 
					that.prizeRecordAry.map((v) => {
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

					console.log(that.prizeRecordAry);

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
			
			// 奖品列表 已领取 查看 详情
			viewDetails(item){
				console.log(item);
				this.detailDialog = true;
				const { prizeVcode, prizeName, earnTime, expireTime, userName,phoneNum    } = item;
				this.winningInformation = {
					prizeVcode,
					prizeName,
					earnTime,
					expireTime,
					userName,
					phoneNum,
				}
			},
			
			// 领取 奖品
			getPrize(navData){
				console.log('navData');
				console.log(navData);
				// 定义 领取 大奖 所需参数
				getApp().globalData.getPrizeSendData = {
					prizeVcode: navData.prizeVcode,
					prizeType: navData.grandPrizeType
				}
				const isDay19 = navData.exchangeChannel == '5' ? true : false ; // 判断是 19日（exchangeChannel）中的 大奖 还是 普通的大奖 
				const navigateTo = `../common/submitUserInformation?prizeType=${navData.grandPrizeType}&prizeVcode=${navData.prizeVcode}&isDay19=${isDay19}`;
				
				uni.navigateTo({
					url:navigateTo
				})
			},
			closeCustomDialog(){
				this.detailDialog = false;
			}
			
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
		margin: 0 30rpx 20rpx 30rpx;
		
	}

	.wr-center {
		border-radius: 20rpx;
		flex: 1;
		margin: 40rpx 30rpx 30rpx 30rpx;
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

	// 待领取 按钮 
	.wrc-listBox-list-right-dailing {
		 border: 1rpx solid #E94700;
		 color: #E94700;
		 font-size: 28rpx;
		 padding: 10rpx 44rpx;
		 border-radius: 10rpx;
	}
	// 查看
	 .wrc-listBox-list-right-chakan { 
		 color: #2B8541;
		 font-size: 28rpx; 
	 } 
	 // 已过期
	 .wrc-listBox-list-right-yiguoqi{
		 width: 92rpx;
		 height: 92rpx;
		 image {
			 width: 100%;
			 height: 100%;
		 }
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
		// border-bottom: 1rpx solid #EEEEEE;
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
		// height: 700rpx;
		background: url($commonImg+'dialogBg.png') no-repeat center;
		background-size: cover;
	}
	.customDialog-center-zixun{
		height: 72rpx;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		image {
			width: 72rpx;
			height: 72rpx;
			margin-right: 20rpx;
		}
		view{
			font-size: 30rpx;
			color: #47A74D;
		}
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
	.customDialog-center-title {
		font-size: 38rpx;
		text-align: center;
		color: #FFFFFF;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}
	.customDialog-center-common{
		font-size: 30rpx;
		color: #000000;
		border-bottom: 2rpx solid #EBEBEB;
		margin: 0 24rpx;
		padding: 20rpx 0 20rpx 12rpx;
	}
	// 已兑换商品 查看详情 e
	
	.prizeImg-box{
		width: 112rpx;
		margin-right: 28rpx;
		image{
			width: 100%;
			
		}
	}
	
	// 待领取 底部文案 提示
	.footer-mes{
		color: #999999;
		font-size: 24rpx;
		line-height: 36rpx;
	}
	
	.jifenchoujiang{
		margin: 24rpx 30rpx 0 30rpx;
		height: 130rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
