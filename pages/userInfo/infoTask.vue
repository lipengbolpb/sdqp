<template>
	<view class="infoTask">
		<view class="wrap">
			<view class="item" @click="writeUserInfo">
				<view class="txt">完善个人信息</view>
				<view class="select">
					<image :src="imgUrl + 'more.png'" mode="widthFix"></image>
				</view>
			</view>
			<view class="item" @click="bindTel">
				<view class="txt">绑定手机号</view>
				<view class="select">
					<image :src="imgUrl + 'more.png'" mode="widthFix"></image>
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
				safeBottom:getApp().globalData.isIphoneX?'68rpx':0,
				requestUrl:config.requestUrl
			};
		},
		onLoad() {
		},
		onShow() {
		},
		methods:{
			writeUserInfo(){
				uni.navigateTo({
					url:'../userInfo/writeInfo'
				})
			},
			bindTel(){
				uni.navigateTo({
					url:'../userInfo/giveTel'
				})
			}
		}
	}
</script>

<style lang="scss">
	.infoTask{
		background: #F8F8F8;
		width: 100%;
		min-height: 100vh;
		overflow: hidden;
		.wrap{
			margin-top: 20rpx;
			background: #fff;
			.item{
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				padding:0 30rpx;
				border-bottom: 1rpx solid #eee;
				line-height: 100rpx;
				&:nth-last-child(1){
					border-bottom: none;
				}
				.txt{
					font-size: 30rpx;
					color: #343434;
				}
				.select{
					image{
						width: 15rpx;
					}
				}
			}
		}
	}
</style>
