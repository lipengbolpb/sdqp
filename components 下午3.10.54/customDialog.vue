<template>
	<!-- 弹窗 -->
	<view class="customDialog" v-show="customDialogIsShow">
		<view class="customDialog-mask" @click="closeCustomDialog"></view>
		<!-- 目前 用到 填写中奖 信息 -->
		<view class="customDialog-center">
			<block v-if="customDialogType==1">
				<view class="customDialog-center-title">
					兑奖说明
				</view>
				<view class="customDialog-center-text">
					<view>活动起止时间：2020年1月-2020年12月，每月19日 </view>
					<view>兑奖截止时间：2021年7月31日</view>
					<view>中奖者请在中奖提示界面填写相关信息，并按照页面显示查询您所属区域兑奖咨询电话咨询兑奖事宜。每个瓶盖（拉环）内二维码扫码成功只能获得一次奖项。</view>
					<view>逾期未要求兑付或逾期中出的奖项不再兑付。</view>
					<view>在山东省区域外购得产品，本公司将不予兑付。本次活动非线上促销，通过任何电子商务平台购得的有奖产品，本公司将不予兑付。</view>
				</view>
			</block>
			<block v-else-if="customDialogType==2">
				<view class="customDialog-center-title">冰墩墩兑奖说明</view>
				<view class="customDialog-center-text">
					<view>活动截止时间：2021年1月31日，</view>
					<view>兑奖截止时间：2021年7月31日</view>
					<view class="">全国奖项中奖者请拨打兑奖咨询电话：4006800899。</view>
					<view class="">每个瓶盖内二维码扫码成功只能获得一次奖项，逾期未兑付或逾期中出的奖项不再兑付。</view>
					<view class="">逾期未要求兑付或逾期中出的奖项不再兑付。</view>
					<view class="">在活动区域外购得产品，本公司将不予兑付。</view>
					<view class="">本次活动非线上促销，通过任何电子商务平台购得的有奖产品，本公司将不予兑付。</view>
				</view>
			</block>
			<view class="customDialog-close">
				<image @click="closeCustomDialog" :src="commonImg+'dialogClose.png'" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		config
	} from '@/utils/api.js';
	export default {
		name: 'customDialog',
		props: {
			// 1: 青岛啤酒 兑奖说明 2：冰墩墩 冰墩墩兑奖说明
			customDialogType: {
				type: String,
				default: '1'
			},
			customDialogIsShow: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commonImg: config.staticUrl + 'CommonImg/',
				opacityAni: '',
				opacityAniCen: '',
			};
		},
		methods: {
			closeCustomDialog() {
				const that = this;
				that.$emit('customDialogColse', false);
			},
		}
	};
</script>

<style scoped lang="scss">
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
		background: url($commonImg+'dialogBg.png') no-repeat center;
		background-size: cover;
	}

	.cdc-confirm {
		width: 78%;
		margin-left: 11%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #814e05;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		background: linear-gradient(to top, rgba(255, 170, 11, 1), rgba(249, 211, 0, 1));
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
		margin-bottom: 100rpx;
	}

	.customDialog-center-text {
		color: #000000;
		font-size: 26rpx;
		line-height: 44rpx;
		padding: 0 40rpx 40rpx 40rpx;
	}
</style>
