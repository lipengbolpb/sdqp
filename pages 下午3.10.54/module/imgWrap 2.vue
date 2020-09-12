<template>
	<view class="content">
		<image :src="target" mode="widthFix" @load="imgLoad"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				target: '',
				safeAreaTop:getApp().globalData.safeAreaTop?getApp().globalData.safeAreaTop+'px':'64rpx'
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: ''
			})
			if(options.target) {
				this.target = options.target
			} else {
				uni.navigateBack()
			}
		},
		created() {
			this.$Store.commit('setProjectSign', 'D');
		},
		methods: {
			imgLoad(e) {
				if (e.detail) {
					uni.hideLoading()
				}
			},
		},
		// components: {
		// 	goBack
		// }
	}
</script>

<style lang="scss">
	.content {
		overflow: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;

		image {
			width: 100%;
			display: block;
		}
	}
</style>
