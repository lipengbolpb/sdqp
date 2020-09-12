<template>
	<!-- 通用版本 引导关注 -->
	<view class="yindaoGuanzhu">
		<view class="yindaoGuanzhu-mes">
			<view class="yindaoGuanzhu-mes-title">2020有奖促销内容</view>
			<view class="yindaoGuanzhu-mes-center">青岛啤酒畅想山东</view>
		</view>
		<image :src="commonImg+'zhuanzhu.png'" class="jinmaiLogo" mode="widthFix"></image>
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
		name: 'yindaoGuanzhu',
		data() {
			return {
				staticUrl: config.staticUrl,
				ruleUrl:'',
				// commonImg: config.staticUrl+'CommonImg/',
				commonImg: '/static/CommonImg/',
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
				title: '皇冠丹麦曲奇',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		}
	};
</script>
<style scoped lang="scss">
	.yindaoGuanzhu{
		height: 100%;
		overflow-y: scroll;
	}
	image {
		width: 100%;
		display: block;
	}
	.yindaoGuanzhu-mes{
		position: absolute;
		left:24rpx ;
		top: 160rpx;
	}
	.yindaoGuanzhu-mes-title{
		color: #333333;
		font-size: 34rpx;
	}
	.yindaoGuanzhu-mes-center{
		color: #A86B00;
		font-size: 26rpx;
	}
</style>
