<template>
	<view>
		<web-view :src="target"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				target: ''
			}
		},
		onLoad(options) {
			const target = options.target
			if(target && target.indexOf('http') !== -1) {
				this.target = target
			} else {
				uni.navigateBack()
			}
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
