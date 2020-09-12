<template>
	<view class="formWrap">
		<form action="">
			<view class="item">
				<text class="subject">物流公司：</text>
				<input class="write" type="text" placeholder="请输入物流公司" v-model="expressCompany" />
			</view>
			<view class="item">
				<text class="subject">物流单号：</text>
				<input class="write" type="text" placeholder="请输入物流单号" v-model="expressNum" />
			</view>
		</form>
		<view class="btn" @click="subExpress">提交</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data() {
			return {
				requestUrl: config.requestUrl,
				exchangeId : '',
				expressCompany: "",
				expressNum: "",
			};
		},
		onLoad(options){
			this.exchangeId = options.exchangeId
		},
		methods: {
			subExpress(){
				if (this.expressCompany == '' ) {
					uni.showToast({
					    title: '请填写物流公司',
					    duration: 1500,
						icon:'none'
					});
				} else if (this.expressNum == '' ) {
					uni.showToast({
						title: '请输入物流单号',
						duration: 1500,
						icon:'none'
					});
				} else {
					this.onSubmit();
				}
			},
			onSubmit(){
				uni.showLoading({
					title:'加载中...'
				}) 
				uni.request({  // 提交退货物流信息
					url: this.requestUrl + '/vpoints/vpointsExchange/returnGoodsExpress',
					method: 'POST',
					data: {
						exchangeId: this.exchangeId, // 兑换记录主键
						goodsReturnExpressCompany:this.expressCompany,
						goodsReturnExpressNumber:this.expressNum,
						"projectServerName":'shandongagt'
					},
					complete:(res) => {
						console.log(res)
						uni.hideLoading();
						console.log(res.data)
						let jo = res.data
						if (jo.result.code == 0) {
							if(jo.result.businessCode == 0){
								uni.showToast({
								    title: jo.result.msg,
								    duration: 2000,
									icon:'none'
								});
								setTimeout(() => {  
									uni.redirectTo({ //退款/售后
										url: '../order/order?type=5'
									});
								}, 2000) 
							}else{
								uni.showModal({
									title: '提示',
									content: jo.result.msg,
								})
							}
						} else {
							uni.showModal({
								title: '提示',
								content: jo.result.msg
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.formWrap {
		margin: 120rpx 40rpx 0;
		.item {
			border-top: 2rpx solid #F0F0F0;
			line-height: 80rpx;
			font-weight: 500;
			display: flex;
			&:nth-last-child(1) {
				border-bottom: 2rpx solid #F0F0F0;
				margin-bottom: 50rpx;
			}
			.subject {
				flex:0 0 26%;
				font-size: 30rpx;
				color: #000;
				line-height:60rpx;
				padding:20rpx 0 ;
			}
			.write {
				flex:0 0 74%;
				font-size: 24rpx;
				color: #666;
				text-align: left;
				height:60rpx;
				line-height:60rpx;
				padding:20rpx 0 ;
			}
		}
		.btn{
			width:280rpx;
			line-height:80rpx;
			background:#4EAC6D;
			border-radius:40px;
			font-size:34rpx;
			text-align: center;
			font-weight:500;
			color:#FFF;
			margin:0 auto;
		}
	}
</style>
