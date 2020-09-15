<template>
	<!-- 崂山版本 活动规则  -->
	<view class="rule">
		<image :src="ruleUrl" class="jinmaiLogo" mode="widthFix"></image>
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
	export default {
		name: 'rule',
		data() {
			return {
				staticUrl: config.staticUrl,
				ruleUrl:'',
				jinMaiImg: config.staticUrl+'JinMaiImg/',
			};
		},

		async onShow() {
			console.log(this.ctbackground);
		},
		onLoad(options) {
			if(options.type){
				if(options.type==1){
					 // $("#titleName").text("一元乐购");
					 // 兑换规则
					 this.ruleUrl = jinMaiImg+'exchageRule.png'
				}else if (options.type==2){
					// $("#titleName").text("活动规则");
					// 活动规则
					this.ruleUrl = jinMaiImg+'actRule.png';
				}
				
			}
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
		}
	};
</script>
<style scoped lang="scss">
	.rule{
		height: 100%;
		overflow-y: scroll;
	}
	image {
		width: 100%;
		display: block;
	}
</style>
