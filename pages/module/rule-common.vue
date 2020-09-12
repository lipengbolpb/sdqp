<template>
	<view class="content">
		<image :src="ruleUrl" mode="widthFix" @load="imgLoad"></image>
	</view>
</template>

<script>
	import {post} from '@/utils/api.js'
	export default {
		data() {
			return {
				ruleUrl: '',
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: ''
			})
		},
		created() {
			this.getRuleImg()
		},
		methods: {
			imgLoad(e) {
				if (e.detail) {
					uni.hideLoading()
				}
			},
			getRuleImg() {
				console.log(this.$store.state );
				const data = {
					skuKey: this.$store.state.sweepData.reply.skukey,
					"projectServerName": 'liaoning',
				}
				post('/adPub/actInfo', data).then(res => {
					if(res.result.code == 0 && res.reply && res.reply.picUrl) {
						this.ruleUrl = res.reply.picUrl
					} else {
						uni.hideLoading()
						uni.navigateBack()
					}
				})

			}
		},
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
