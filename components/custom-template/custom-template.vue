<template>
	<!-- 适配公用模板 -->
	<view class="page-template">
		<view class="page-template-wrap page-template-wrap-bg" :style="{ 'background': 'url('+ctbackground+') no-repeat center','background-size':'cover'}">
			<view class="page-template-wrap-center" :style="{'height':ctheight+'rpx' }">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 	
	 * 
	 */

	import {
		config
	} from '@/utils/api.js';
	export default {
		name: 'custom-template',
		props: {
			ctheight: {
				type: String,
				default: '1334'
			},
			ctbackground: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				backgroundUrl: "sssss",
				height: '1334',
			};
		},
		async onShow() {

		},
		methods: {

		}
	};
</script>
<style scoped lang="scss">
	.page-template{
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.page-template-wrap{
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}
	.page-template-wrap-center{
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
		/* 没有导航 用1334 有导航用 1334-底部导航高度 */
		// height: 1334rpx;
		/* height: 1234rpx; */
	}
	.page-template-wrap-bg {
		// background: url() no-repeat center;
		// background:  url('https://xcxsite.vjifen.com/v/crownCookiesImg/crownCookiesImgBgBig.jpg') no-repeat center;
		// background-size: cover;
	}
</style>
