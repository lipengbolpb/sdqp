<template>
	<view class="payOk">
		<view class="result">
			<view class="icon">
				<image :src="imgUrl + 'payOk.png' " mode="widthFix"></image>
			</view>
			<view class="state">支付完成</view>
			<view class="tip">
				<text>
					客官，订单收到啦 \n 我们正在快马加鞭处理～
				</text>
			</view>
			<view class="btn" @click="toOrder">查看订单</view>
		</view>
		<!-- 为你推荐 -->
		<view class="commend">    
			<view class="title">
				<image :src="imgUrl + 'commend.png' " mode="widthFix"></image>
			</view>
			<view class="goods">
				<view class="item" v-for="(item,index) in goodsList" :key="index" @click="toGoodsDetail(item.goodsId)">
					<view class="proImg">   
						<image :src="goodsImgRoot+item.goodsUrl.split(',')[0]" mode="widthFix"></image>
						<view v-show="item.goodsStatus == 1 " class="circle">暂无库存</view>
					</view>
					<view class="proInfo">         
						<view class="proName">{{item.goodsName}}</view>
						<view class="proUnit">
							<view v-if="item.goodsSpecification">{{item.goodsSpecification}}{{item.goodsUnitName}}</view>
						</view>
						<view :class="['price',{'saleOver':item.goodsStatus == 1 || item.goodsStatus == 2}]">
							<text v-if="item.realPay != 0">
								<text class="danwei">￥</text>
								{{item.realPay/100|toFixed|toThousands}}
							</text>
							<text v-if="item.realPay != 0 && item.realVpoints != 0 ">+</text>
							<text v-if="item.realVpoints != 0">
								{{item.realVpoints|toThousands}}
								<text class="danwei">积分</text>
							</text>
						</view>
					</view>    
				</view>    
			</view>
		</view>
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
				goodsList : [],    
			};
		},
		onLoad(){              
			     
		},
		onShow() {
			this.getgoods();
		},      
		methods: {
			toOrder(){
				uni.navigateTo({
					url:'../order/order?type=' + '1'
				})
			},
			//to商品详情
			toGoodsDetail(id) {
				uni.navigateTo({
					url:'../goodsDetail/goodsDetail?id=' + id + '&type=' + this.categoryParent
				})
			},
			async getgoods() {
				var params = {
					"currentPage": '1',
					"count":'4',
					'goodShowFlag':'2', //首页商品小图
					'saleNumOrderType':'0',//0-升序、1-降序
				}
				var jo = await requestPost('/vpoints/vpointsShop/getShopGoods',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {                    
						if(jo.reply){
							this.goodsList = jo.reply
						}
					} else {
						uni.showModal({
						  title: '提示',
						  content: jo.result.msg,   
						})
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.payOk{
		height: 100%;
		box-sizing: border-box;
		background: #F6F6F6;
		overflow: hidden;
	}
	.result{
		height: 536rpx;
		background: #FFFFFF;
		text-align: center;   
		padding-top: 56rpx;
		.icon{
			image{
				width: 134rpx;
			}
		}
		.state{
			font-size: 40rpx;
			color: #333333;
			padding:36rpx 0 ;
		}
		.tip{
			padding-bottom:30rpx;
			text{
				font-size: 26rpx;              
				color: #666666;
			}
		}
		.btn{
			width: 50%;
			border: 3rpx solid #57BE6F;
			border-radius: 20rpx;
			font-size: 30rpx;
			color: #000000;
			padding: 24rpx;
			margin: 0 auto;
		}
	}
	.commend{                                 
		height: 100%;     
		padding:30rpx;
		.title{
			text-align: center;
			image{
				width: 353rpx;
			}
		}
		.goods{
			display: flex;
			flex-wrap:wrap;
			justify-content: space-between;              
			.item{
				// width: 334rpx;                  
				// height: 430rpx;
				background: #FFF;
				border-radius: 20rpx;	
				margin-bottom: 30rpx;
				position: relative;

			    .proImg{
					height: 290rpx;            
					image{
						width: 330rpx;   
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
					}
				}
				.circle{
					width: 211rpx;
					height: 211rpx;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.5);
					text-align: center;
					line-height: 219rpx;
					color: #fff;
					font-size: 30rpx;
					letter-spacing: 4rpx;
					position: absolute;
					top:8%;
					left: 18%;
				}
				.proInfo{
					padding: 34rpx 28rpx;
					.proName{
						font-size: 28rpx;
						color: #333;
						padding-top: 34rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.proUnit{
						font-size:22rpx;
						color:#888888;
						margin:24rpx 0 ;
						display: inline-block;
						max-width: 400rpx;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						height: 36rpx;
						view{
							border:1rpx solid #CACACA;
							border-radius:6px;
							padding: 0 12rpx;	
						}
					}
					.price{
						font-size: 30rpx;
						color: #F60000;
						.danwei{
							font-size: 24rpx;
						}
						&.saleOver{
							color:#9A9A9A;
						}
					}
				}
			}
		}
	}
</style>
