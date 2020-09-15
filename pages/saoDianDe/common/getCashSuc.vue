<template>
	<!-- 通用版本 提现成功 -->
	<custom-template ctheight='1334' :ctbackground='ctbackground'>
		<view class="codeScanned flex-xn-ys">
			<!-- <uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="青岛啤酒畅享山东"></uni-nav-bar> -->
			<view class="cs-center">
				<view class="cs-center-title">
					亲，您已将账户余额中的<text> {{ totalMoney }}元 </text>进行了提现看到消息后72小时之内要记得收钱哦～
				</view>
				<image mode="widthFix" class="duihao" :src="commoniImg + 'duihao.png'"></image>
				<view class="cs-center-mes">请到”我的-红包记录”中查看</view>
			</view>
			<!-- 二重惊喜Logo -->
			<image mode="widthFix" class="erchongjingxi" :src="commoniImg + 'erchongjingxiBig.png'" v-if="isOpenECJXMini" @click="openECJXMiniProgram" ></image>
		</view>
	</custom-template>
</template>

<script>
	/**
	 * 获取红包成功 展示 需要传入 金额
	 */
	import { config } from '@/utils/api.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import { customTemplate } from '@/components/custom-template/custom-template.vue';
	import { navigateToMiniProgram } from '@/common/getWxUserInfor.js';
	export default {
		components: {
			uniNavBar,
			customTemplate
		},
		name: 'blacklist',
		onLoad(options) {
			console.log("options----------------");
			console.log(options);
			this.totalMoney = options.totalMoney || '';
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commoniImg: config.staticUrl + 'CommonImg/',
				totalMoney:'',
				ctbackground: config.staticUrl + 'CommonImg/sucBg.png',
				isOpenECJXMini:false
			};
		},
		methods: {
			// 打开 二重惊喜小程序
			openECJXMiniProgram (){
				navigateToMiniProgram();
				this.isOpenECJXMini = true ;
			}
		}
	};
</script>

<style scoped lang="scss">
	.codeScanned {
		height: 100%;
		position: absolute;
	}

	.cs-center {
		text-align: center;
		margin-top: 220rpx;
		padding-left: 66rpx;
		padding-right: 66rpx;
	}

	.cs-center-title {
		font-size: 32rpx;
		color: #fff;
		margin-bottom: 60rpx;

		text {
			font-size: 36rpx;
			color: #DE1411;
		}
	}

	.duihao {
		width: 168rpx;
		margin-bottom: 46rpx;
	}

	.cs-center-mes {
		color: #666666;
		font-size: 28rpx;
		margin-bottom: 90rpx;
	}

	.erchongjingxi {
		width: 98%;
	}
</style>
