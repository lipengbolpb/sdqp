<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:''
			}
		},
		onLoad(options) {
			console.log('webview');
			console.log(options);
			this.src= options.H5URL ;
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
