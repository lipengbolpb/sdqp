<template>
	<!-- 通用版本 二维码已被扫 -->
	<view class="">
		<view class="uni-nav-bar" :style="{ 'top': safeAreaTop*2 + 'rpx' }">
			<uni-nav-bar left-icon="back" @click-left="back" title="青岛啤酒"></uni-nav-bar>
		</view>
		<custom-template ctheight='1334' :ctbackground='ctbackground'>
			<view class="codeScanned flex-xn-ys">
				<view class="cs-center">
					<block v-if="isexpireTimeStatus==true">
						<p class="csc-title">奖项已过期</p>
						<p class='csc-p'></p>
					</block>
					<block v-else>
						<p class="csc-title">{{ mesFontTitle }}</p>
						<p :class="[showType==1?'csc-p1':'csc-p']">
							<view class="csc-currentMoney"> {{ mesFontCurrentMoney }} </view>{{ mesFont }}
						</p>
					</block>
					<view class="flex-xc-yn">
						<image mode="widthFix" class="csc-crownCookies" :src="staticUrl + 'crownCookiesImg.png'"></image>
					</view>
				</view>
			</view>
		</custom-template>
	</view>
</template>

<script>
	/**
	 * 二维码已被扫
	 * 		自己扫过
	 * 		他人扫过
	 */
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';

	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue';

	export default {
		components: {
			uniNavBar,
			customTemplate
		},
		name: 'blacklist',
		computed: {
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			isOpenAdaptation() {
				if (this.windowHeight > 800) {
					return true;
				} else {
					return false;
				}
			},
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
		onLoad(options) {
			console.log("options----------------");
			console.log(options);
			console.log(options.bizcode);
			if (options.bizcode == 11) {
				// 本人重复扫码
				console.log(uni.getStorageSync('sweepQrcodeData'));
				const earnTime = uni.getStorageSync('sweepQrcodeData').reply.earnTime || '';
				const currentMoney = uni.getStorageSync('sweepQrcodeData').reply.currentMoney || '';
				console.log(earnTime);
				console.log(currentMoney);

				this.mesFont = `您已于 ${ earnTime } 扫过这个二维码`;
				this.mesFontCurrentMoney = `并获得 ${ currentMoney }元`;
				this.showType = '1';
				this.mesFontTitle = '这个二维码已被您扫过';
				this.isexpireTimeStatus = false;
			} else if (options.bizcode == 7) {
				this.isexpireTimeStatus = true;
			} else {
				// 已被他人扫码
				this.mesFont = '每个二维码仅限扫码一次';
				this.mesFontTitle = '这个二维码已被扫过';
				this.mesFontCurrentMoney = ``;
				this.showType = '2';
				this.isexpireTimeStatus = false;
			}
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commoniImg: config.staticUrl + 'CommonImg/',
				mesFont: '每个二维码仅限扫码一次',
				mesFontCurrentMoney: '',
				staticUrl: config.staticUrl,
				showType: '1',
				isexpireTimeStatus: false, // 默认 没有过期 如果bizcode==7 说明从大奖过来并且大奖已过期
				mesFontTitle: '这个二维码已被扫过',
				ctbackground: config.staticUrl + 'CommonImg/erweimabeisao.png',
			};
		},
		methods: {
			game() {
				uni.navigateTo({
					url: './game?switchTurntable=' + this.switchTurntable
				});
			},
			// 返回
			back() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.codeScanned {
		height: 100%;
	}

	.cs-center {
		text-align: center;
		margin-top: 680rpx;
	}

	.csc-title {
		font-size: 36rpx;
		color: #333333;
		margin-bottom: 24rpx;
	}

	.csc-p {
		font-size: 26rpx;
		color: #666666;
		line-height: 50rpx;
		margin-bottom: 126rpx;
		position: relative;
	}

	.csc-p1 {
		font-size: 26rpx;
		color: #666666;
		line-height: 50rpx;
		margin-bottom: 40rpx;
		margin-top: 86rpx;
		position: relative;
	}

	.csc-currentMoney {
		width: 100%;
		position: absolute;
		left: 0;
		top: -60rpx;
		text-align: center;
		font-size: 36rpx;
		color: #FF0F00;
	}

	.csc-crownCookies {
		width: 348rpx;
	}

	.duihao {
		width: 168rpx;
		margin-bottom: 60rpx;
	}

	.csc-logo {
		width: 140rpx;
	}

	.uni-nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
	}
</style>
