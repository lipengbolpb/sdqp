<template>
	<view class="content">
		<web-view :src="gzUrl"></web-view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data() {
			return {
				imgUrl:config.mallImgUrl,
				requestUrl: config.requestUrl,
				goodsImgRoot: config.goodsImgRoot,
				gzUrl: '',
			}
		},
		onLoad(options) {
			if(options && options.from == 'jfgz'){
				this.gzUrl = 'https://mp.weixin.qq.com/s?__biz=MzA3Mjk3OTY3OA==&mid=503286097&idx=1&sn=0de213876076a9da2e1b8dba984e13e1&chksm=071d2ce0306aa5f64752a3d1e8d1307727629fb9559024fd5c013175b576074d1ea5d17f3011#rd' 
			} 
			console.log(this.gzUrl);
		},
		
		created() {
			
		},
		methods: {
			
		},
	}
</script>

<style lang="scss">
	
</style>
