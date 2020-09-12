<template>
	<!-- 金麦版本 转盘 -->
	<custom-template ctheight='1334' :ctbackground='ctbackground'>
		<view class="disc">
			<image :src="jinMaiImg+'jinmaiLogo.png'" class="jinmaiLogo" mode="widthFix"></image>
			<image :src="jinMaiImg+'jianmaigz.png'" class="jianmaigz" @click="yinDaoguanZhu" mode="widthFix"></image>
			<image :src="jinMaiImg+'jinmairenwu.png'" class="jinmairenwu" mode="widthFix"></image>
			<image :src="jinMaiImg+'jinmaibiaoyu.png'" class="jinmaibiaoyu" mode="widthFix"></image>
			<div class="disc_box">
				<image :animation="choujiangAni" @transitionend="rotatend" :src="jinMaiImg+'zhuanpan.png'" class="zhuanpanPng" mode="widthFix"></image>
				<image :src="jinMaiImg+'zhuanpananniu.png'" class="zhuanpananniu" @click="run()" mode="widthFix"></image>
			</div>
		</view>
	</custom-template>
</template>

<script>
	/**
	 * 	url 携带 参数 bizcode prizeType
	 * 
	 */

	import {
		config
	} from '@/utils/api.js';
	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue'
	export default {
		name: 'disc',
		components: {
			customTemplate
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				jinMaiImg: config.staticUrl + 'JinMaiImg/',
				ctbackground: config.staticUrl + 'JinMaiImg/jinmaibgBig.png',
				choujiangAni: '',
				deg: 0,
				bizcode: '', // 所需参数
				prizeType: '', // 所需参数
			};
		},
		onLoad(options) {
			const {
				bizcode,
				prizeType
			} = options;
			console.log('disc---options');
			console.log(options)
			if (prizeType) {
				this.prizeType = prizeType || '';
			}
			this.bizcode = bizcode;
			console.log(this.bizcode);
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
			}
			return {
				title: '皇冠丹麦曲奇',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},
		methods: {
			//开始 转
			run() {
				// 旋转2圈  720+对应deg数 eg:60 + 720(自转2圈)
				const bizcode = this.bizcode;
				const prizeType = this.prizeType;
				let deg = 0;
				console.log(bizcode);
				if (bizcode == 0) {
					if (prizeType == "LU001") {
						deg = 720 + 330;
					} else if (prizeType == "LU002") {
						deg = 720 + 90;
					}
				} else if (bizcode == 24) {
					deg = 720 + 30;
				}
				this.deg = deg;
				console.log(this.deg);
				this.startChoujiangAnimation(this.deg);
			},
			// 开始 抽奖按钮 动画
			startChoujiangAnimation(angle, duration = 2000, delay = 0) {
				const that = this;
				// 转盘旋转 
				const choujiangAnimation = wx.createAnimation({
					duration: 2000,
					timingFunction: 'ease',
					delay: 0
				});
				choujiangAnimation
					.rotate(angle)
					.step();
				that.choujiangAni = choujiangAnimation.export();
			},

			rotatend() {
				console.log('我是动画结束 回调');
				const ticketCode = getApp().globalData.ticketCode;
				const redirectUrl = 'discSuc?bizcode=' + this.bizcode + '&prizeType=' + this.prizeType +'&ticketCode=' + ticketCode;
				uni.redirectTo({
					url: redirectUrl
				})
			},

			// 关注公众号
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
	.disc {
		position: relative;
		height: 100%;
	}

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

	.disc_box {
		width: 80%;
		margin: auto;
		position: relative;
		margin-top: 54rpx;
	}

	.zhuanpanPng {
		width: 100%;
		transform: rotate(0deg);
		transition: .7s ease;
	}

	.zhuanpanPng-end {
		width: 100%;
		transform: rotate(360deg);
		transition: .7s ease;
	}


	// 抽奖按钮
	.zhuanpananniu {
		width: 140rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 20;
		transform: translate(-50%, -50%);
	}

	.jinmairenwu {
		width: 80%;
		position: absolute;
		left: 10%;
		bottom: 5%;
		z-index: 20;
	}

	.jinmaibiaoyu {
		width: 80%;
		position: absolute;
		left: 10%;
		bottom: 2%;
		z-index: 20;
	}
</style>
