<template>
	<view>
		<web-view :src="src" @message="getOpenid"></web-view>
	</view>
</template>

<script>
	import {
		config
	} from '@/utils/api.js';
	import {
		filterArr
	} from '@/common/basicsFun.js';
	export default {
		data() {
			return {
				src: '',
				payAppid: '',
				status: '',
				filterData:'',
				webViewSrcArr: [{
						getType: 'openid',
						status: 1,
						webViewSrc: `${config.wxUrl}/wx3/u2mpFromSg?appid=${config.appid}`
					},
					{
						getType: 'hbopenid',
						status: 2,
						webViewSrc: `${config.wxUrl}/wx3/u2mpFromSg?appid=${config.payAppid}`
					},
					{
						getType: 'vjfOpenid',
						status: 3,
						webViewSrc: `${config.wxUrl}/wx3/u2mpFromSg?appid=${config.vjfAppid}`
					}
				]
			}
		},
		onLoad(options) {
			const getIdType = options.getIdType || 'openid';
			const filterData = filterArr('getType', getIdType, this.webViewSrcArr)[0];
			this.filterData = filterData;
			this.src = filterData.webViewSrc;
			console.log('我是 获取 getOpenids 页面');
			console.log(options);
			console.log(getIdType);
			console.log(filterData);
			console.log(this.src);
		},
		methods: {
			getOpenid(e) {
				console.log(e);
				console.log(e.detail.data[0].openid);
				if (e.detail && e.detail.data[0].openid) {
					const storageData = e.detail.data[0].openid;
					const storageKey = this.filterData.getType;
					
					// 后期修改成 hbopenid_ 
					
					getApp().globalData[storageKey] = storageData;
					
					uni.setStorage({
						key: storageKey,
						data: {
							[storageKey]: storageData
						},
					})
					
					
					// if (this.type == 'hbopenid') {
					// 	getApp().globalData.hbopenid = e.detail.data[0].openid;
					// 	let key = 'hbopenid_';
					// 	if (this.payAppid) {
					// 		key += this.payAppid
					// 	} else {
					// 		key += this.$Store.state.payAppid
					// 	}
					// 	uni.setStorage({
					// 		key: key,
					// 		data: {
					// 			hbopenid: e.detail.data[0].openid
					// 		},
					// 	})
					// } else if (this.type == 'vjfOpenid') {
					// 	getApp().globalData.vjfOpenid = e.detail.data[0].openid;
					// 	uni.setStorage({
					// 		key: 'vjfOpenid',
					// 		data: {
					// 			vjfOpenid: e.detail.data[0].openid
					// 		},
					// 	})
					// } else {
					// 	getApp().globalData.openid = e.detail.data[0].openid;
					// 	uni.setStorage({
					// 		key: 'openid',
					// 		data: {
					// 			openid: e.detail.data[0].openid
					// 		},
					// 	})
					// }
					
					
				}
			}
		}
	}
</script>

<style>

</style>
