<template>
	<!-- 崂山版本 引导关注 -->
	<custom-template ctheight='1334' :ctbackground='ctbackground'>
		<view class="yindaoGuanzhu">
			<image :src="jinMaiImg+'jinmaiLogo.png'" class="jinmaiLogo" mode="widthFix"></image>
			<image :src="jinMaiImg+'jinmairenwu.png'" class="jinmairenwu" mode="widthFix"></image>
			<image :src="jinMaiImg+'jinmaibiaoyu.png'" class="jinmaibiaoyu" mode="widthFix"></image>
			<view class="yindaoBox" style="margin: 136rpx 26rpx 0 26rpx">
				<image :src="jinMaiImg+'guanzhu.png'" class="zhuanpanPng" mode="widthFix"></image>
			</view>
		</view>
	</custom-template>
</template>

<script>
	/**
	 * 	
	 * 
	 */

	import {
		config
	} from '@/utils/api.js';

	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue'
	export default {
		name: 'yindaoGuanzhu',
		components: {
			customTemplate
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				jinMaiImg: config.staticUrl + 'JinMaiImg/',
				ctbackground: config.staticUrl + 'JinMaiImg/jinmaibgBig.png',
			};
		},
		async onShow() {
			console.log(this.ctbackground);
		},
		onLoad(options) {

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
		}
	};
</script>
<style scoped lang="scss">
	.yindaoGuanzhu {}

	image {
		width: 100%;
		display: block;
	}

	// 关注
	.jinmaiLogo {
		width: 200rpx;
		margin-top: 168rpx;
		margin-left: 30rpx;
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
