<template>
	<!-- 金麦版本 转盘结束 显示结果 苏打水、青岛啤酒1L原浆券、青岛啤酒琥珀啤酒券 -->
	<view class="rule">
		<image :src="ruleUrl" class="jinmaiLogo" mode="widthFix"></image>
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
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		name: 'rule',
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
				ruleUrl: '',
				jinMaiImg: config.staticUrl + 'JinMaiImg/',
			};
		},

		async onShow() {
			console.log(this.ctbackground);

		},
		onLoad(options) {
			if (options.type) {
				if (options.type == 1) {
					// 兑换规则
					this.ruleUrl = this.jinMaiImg + 'exchageRule.png';
					uni.setNavigationBarTitle({
						title: '一元乐购'
					});
				} else if (options.type == 2) {
					// 活动规则
					this.ruleUrl = this.jinMaiImg + 'actRule.png';
					uni.setNavigationBarTitle({
						title: '活动规则'
					});
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
				title: '青岛啤酒',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},
		// 返回
		back() {
			uni.navigateBack(1);
		},
	};
</script>
<style scoped lang="scss">
	.rule {
		height: 100%;
		overflow-y: scroll;
	}

	image {
		width: 100%;
		display: block;
	}
</style>
