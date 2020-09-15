<template>
	<!-- 金麦版本 转盘结束 显示结果 苏打水、青岛啤酒1L原浆券、青岛啤酒琥珀啤酒券 -->
	<view class="">

		<image :src="jinMaiImg+'discsucBgBot.png'" class="discsucBgBot" mode="widthFix"></image>
		<custom-template ctheight='1334' :ctbackground='ctbackground'>
			<view class="discSuc">
				<view>
					<image :src="jinMaiImg+'jinmaiLogo.png'" class="jinmaiLogo" mode="widthFix"></image>
					<image :src="jinMaiImg+'jianmaigz.png'" class="jianmaigz" @click="yinDaoguanZhu" mode="widthFix"></image>
					<view class="center">
						<text>恭喜你获得</text>
						<text>{{ prizeName }}</text>
						<image :src='prizeImg' mode="widthFix"></image>
					</view>
				</view>
			</view>
		</custom-template>
		<image mode="widthFix" v-if="isShowLijielingqu" :src="jinMaiImg+'discsucBtn.png'" class="discsucBtn" @click="openWebView"></image>
		<view class="tabBox" id="tabBox" v-if="isShowTabBox">
			<view id="myPrize" @click="jumpFun(1)">兑奖方式</view>
			<view id="myRule" @click="jumpFun(2)">活动细则</view>
			<view id="myExchange" @click="jumpFun(3)">我的换购</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 	ticketCode : 领取券的 地址
	 * 
	 */

	import {
		config
	} from '@/utils/api.js';
	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue'
	export default {
		name: 'discSuc',
		components: {
			customTemplate
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				jinMaiImg: config.staticUrl + 'JinMaiImg/',
				ctbackground: config.staticUrl + 'JinMaiImg/discsucBg.png',
				choujiangAni: '',
				bizcode: 24,
				prizeType: 'LU002',
				prizeName: '青岛啤酒1L原浆券', // 奖品名称
				prizeImg: "", // 奖品图片
				isShowTabBox: false,
				isShowLijielingqu: false
			};
		},
		onLoad(options) {
			console.log(options);
			const {
				bizcode,
				ticketCode,
				prizeType
			} = options;
			this.bizcode = bizcode;
			this.ticketCode = ticketCode || '';
			this.prizeType = prizeType || '';
			this.init(bizcode, prizeType);
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮

			}
			return {
				title: '青岛啤酒畅享山东',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'mall/shareImg.jpg?v=1'
			};
		},
		methods: {
			init(bizcode, prizeType) {
				console.log(prizeType);
				if (bizcode == 0) {
					if (prizeType == "LU001") {
						this.prizeName = '青岛啤酒1L原浆券';
						this.prizeImg = this.jinMaiImg + 'quan20.png';
					} else if (prizeType == "LU002") {
						this.prizeName = '青岛啤酒琥珀啤酒券';
						this.prizeImg = this.jinMaiImg + 'quan50.png';
					}
					this.isShowLijielingqu = true;
					this.isShowTabBox = false;
				} else if (bizcode == 24) {
					this.prizeName = `一元换购价值6元
					王子海藻苏打水一罐`;
					this.prizeImg = this.jinMaiImg + 'prize_sudashui.png';
					this.isShowLijielingqu = false;
					this.isShowTabBox = true;
				}
			},
			jumpFun(jumpType) {
				let redirectUrl = '';
				if (jumpType == 3) {
					redirectUrl = 'mybagNew' + jumpType
				} else {
					redirectUrl = 'rule?type=' + jumpType
				}
				uni.navigateTo({
					url: redirectUrl
				})
			},
			openWebView() {
				const webViewUrl = '/pages/saoDianDe/webView/webView?H5URL=' + this.ticketCode;
				console.log(webViewUrl);
				uni.navigateTo({
					url: webViewUrl
				})
			},
			yinDaoguanZhu() {
				uni.redirectTo({
					url: 'yindaoGuanzhu'
				})
			}

		}
	};
</script>
<style scoped lang="scss">
	// .page-template-wrap-bg {
	// 	background: url($crownCookiesImg+'crownCookiesImgBgBig.jpg') no-repeat center;
	// 	background-size: cover;
	// }
	.discSuc {
		position: relative;
		height: 100%;
	}

	text {
		display: block;
	}

	// 品牌logo
	.jinmaiLogo {
		width: 200rpx;
		margin-top: 168rpx;
		// margin-top: 40rpx;
		margin-left: 30rpx;
	}

	// 关注
	.jianmaigz {
		width: 164rpx;
		position: absolute;
		top: 239rpx;
		right: -4rpx;
	}

	.tabBox {
		width: 100%;
		display: flex;
		position: fixed;
		bottom: 90rpx;
		z-index: 30;
	}

	.tabBox>view {
		flex: 1;
		background: #007AFF;
		color: #fff;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		border-radius: 8rpx;
	}

	.tabBox view:nth-child(1) {
		margin-left: 36rpx;
	}

	.tabBox view:nth-child(3) {
		margin-right: 36rpx;
	}

	.tabBox view:nth-child(2) {
		margin-left: 36rpx;
		;
		margin-right: 36rpx;
		;
	}

	.discsucBgBot {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 30;
	}

	.center {
		padding-top: 64rpx;
		color: #fff;
		text-align: center;
		z-index: 20;
	}

	.center text:nth-child(1) {
		font-size: 40rpx;
		margin-bottom: 40rpx;
	}

	.center text:nth-child(2) {
		font-size: 70rpx;
		margin-bottom: 60rpx;
	}

	.center image {
		width: 50%;
	}

	.discsucBtn {
		width: 50%;
		position: absolute;
		left: 25%;
		bottom: 112rpx;
		z-index: 40;
	}
</style>
