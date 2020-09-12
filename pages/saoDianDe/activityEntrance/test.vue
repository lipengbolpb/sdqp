<template>
	<view class="" style="margin-top: 30px;">
		
		 <view class="flex-xn-yn">
			<view class="label">
				串码：
			</view>
			<view class="labelCenter">
				<input v-model="sweepstr" />
			</view>
		</view>
		<!-- <view class="flex-xn-yn">
			<view class="label">
				版本号：
			</view>
			<view class="labelCenter">
				<input v-model="activityVersion" />
			</view>
		</view>
		<view class="flex-xn-yn">
			<view class="label">
			bizcode：
			</view>
			<view class="labelCenter">
				<input v-model="businessCode" />
			</view>
		</view>
		<view class="flex-xn-yn">
			<view class="label">
				prizeType：
			</view>
			<view class="labelCenter">
				<input v-model="prizeType" />
			</view>
		</view>
		<view class="flex-xn-yn">
			<view class="label">
				currentMoney：
			</view>
			<view class="labelCenter">
				<input v-model="currentMoney" />
			</view>
		</view>
		<view class="flex-xn-yn">
			<view class="label">
				totalAccountMoney：
			</view>
			<view class="labelCenter">
				<input v-model="totalAccountMoney" />
			</view>
		</view> -->
		
		<button type="default" style="margin-top: 30px;" @click="go"> 测试 </button>
		
		<button type="default" style="margin-top: 30px;" @click="webview"> webview </button>
		
		<button type="default" style="margin-top: 30px;" @click="hongbao"> 我的红包 </button>
		
		<button type="default" style="margin-top: 30px;" @click="jiangpin"> 奖品 </button>
		
		<button type="default" style="margin-top: 30px;" @click="guanzhu"> 关注 </button>
		
		<button type="default" style="margin-top: 30px;" @click="tarFun(1)"> 个人中心 </button>
		
		<button type="default" style="margin-top: 30px;" @click="tarFun(2)"> 首页 </button>
	
	</view>
</template>

<script>
	/**
	 * 	url 携带 参数 bizcode prizeType
	 * 
	 */
	import {
		config
	} from '@/utils/api.js';
	import { ifremeber } from '@/common/getData.js' 
	import { judgeBusinessCode } from '@/common/basicsFun.js'
	export default {
		name: 'test',
		data() {
			return {
				staticUrl: config.staticUrl,
				businessCode:0,
				activityVersion:'5',
				prizeType:'LU001',
				currentMoney:1,
				totalAccountMoney:1,
				sweepstr:''
			};
		},
		onLoad() {
		
		},
		methods: {
			go(){
				uni.redirectTo({
					url:'activityEntrance?q='+this.sweepstr
				})
				
				return false;
				const testData = {
					result:{
						businessCode:this.businessCode,
					},
					reply:{
						lxCompanyKey:'lxCompanyKey',
						activityVersion:this.activityVersion,
						prizeType:this.prizeType,
						earnTime:'earnTime',
						currentMoney:this.currentMoney,
						totalAccountMoney:this.currentMoney,
						ticketInfo:{
							ticketCode:'ticketCode'
						}
					},
					replyTime:'12333333333'
				};
				// 缓存数据
				uni.setStorage({
					key:'sweepQrcodeData',
					data:testData
				})
				judgeBusinessCode(testData).then((res)=>{
					console.log('judgeBusinessCode');
					console.log(res,getApp().globalData.lxCompanyKey);
					const redirectToUrl = res;
					uni.redirectTo({
						url:redirectToUrl
					})
				})
			},
			webview(){
				uni.navigateTo({
					url:'/pages/getOpenid/getOpenid?getType=openid'
				})
			},
			hongbao(){
				uni.navigateTo({
					url:'../winningRecord/winningRecord'
				})
			},
			jiangpin(){
				uni.navigateTo({
					url:'../prizeList/prizeList'
				})
			},
			guanzhu(){
				ifremeber()
			},
			
			
		}
	};
</script>

<style>
</style>
