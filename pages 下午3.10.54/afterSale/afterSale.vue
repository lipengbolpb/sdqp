<template>
	<view class="wrap">
		<view class="part">
			<view class="title">温馨提示：</view>
			<view class="content">
				<view class="li">酒水商品不接受7天无理由退换货</view>
			</view>
		</view>
		
		<view class="part">
			<view class="title">关于签收及售后：</view>
			<view class="content">
				<view class="li">1、签收之前请确认包装，若<text>有损坏且存在漏液</text>情况，<text>请拒绝签收</text>并及时联系客服处理。</view>
				<view class="li">2、运输途中难免磕碰，若<text>有破损但没有造成漏液</text>情况，<text>将不作为售后处理</text>。</view>
				<view class="li">3、商品签收后，除错发/漏发/商品严重漏液和质量问题外，<text>退货换货须自行承担往返运费</text>。</view>
				<view class="li">4、若要<text>退货、换货的，须商品退回仓库</text>后联系客服操作。</view>
			</view>
		</view>
		
		<view class="part reason">
			<view class="title">填写退款退货原因：</view>
			<view class="content">
				<radio-group class="radio-group" @change="radioChange">
				  <label class="one radio" v-for="(item,index) in items" :key="index">
					<text class="radioName">{{item.value}}</text>
				    <radio class="radioBtn" :value=item.name :checked=item.checked :disabled=item.disabled />
				  </label>
				</radio-group>
				
				<text v-show="false">{{seleted}}</text>
			</view>
		</view>
		
		<view class="btn" @click="onSubmit">提交</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data() {
			return {
				requestUrl: config.requestUrl,
				exchangeId : '',
				items: [
				  { name: '少件/漏发', value: '少件/漏发', checked: true},
				  { name: '发错货', value: '发错货',  },
				  { name: '质量问题', value: '质量问题' },
				  { name: '严重漏液', value: '严重漏液' },
				],
				seleted : "少件/漏发",
			};
		},
		onLoad(options){
			this.exchangeId = options.exchangeId
		},
		methods: {
			radioChange: function (e) {
				console.log('radio发生change事件，携带value值为：', e.detail.value)
				let value = e.detail.value;
				console.log("选中的value：" + value);
				this.seleted = value;
			},
			
			onSubmit(){
				uni.showLoading({
					title:'加载中...'
				}) 
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/returnGoods',
					method: 'POST',
					data: {
						exchangeId: this.exchangeId, // 兑换记录主键
						goodsReturnReason:this.seleted,
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
	.wrap {
		background: #fff;
		padding-bottom: 40rpx;
		.part{
			padding:60rpx 40rpx 30rpx;
			border:1rpx solid #F0F0F0;
			&.reason{
				padding-bottom:0;
			}
			.title{
				margin-bottom:30rpx;
				font-size:30rpx;
				font-weight:500;
				color:#000;
			}
			.content{
				.li{
					font-size:24rpx;
					font-weight:500;
					color:#666;
					padding-bottom: 18rpx;
					text{
						color:#4EAC6D;
					}
				}
			}
		}
		
		.radio-group {
		  .one{
			  display: flex;
			  flex-direction: row;
			  align-items: center;
			  justify-content: space-between;
			  width: 100%;
			  height: 80rpx;
			  border-top: 1rpx solid #F0F0F0;
			  .radioName{
				  font-size:24rpx;
				  font-weight:500;
				  color:#000;
			  }
			  .radioBtn {
			  }
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
			margin:40rpx auto;
			// margin-top: 40rpx;
		}
	}
</style>
