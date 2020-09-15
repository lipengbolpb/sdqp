<template>
	<view class="listPage">
		<view class="top">
			<view class="title">
				<view  @click="toBack" class="backArea" >
					<view class="jiantou" :style="{'margin-top':(safeHeight + customBarHeight*1/3) + 'px' ,'margin-left':'20px'}"></view>
				</view>
				<view :style="{'padding-top':safeHeight + 'px' ,'line-height':customBarHeight + 'px'}" class="head">积分明细</view>
			</view>
			<view class="total">
				<view class="rule">活动规则</view>
				<view class="txt">我的积分</view>
				<view class="score">{{restVpoints|toThousands}}</view>
			</view>
		</view>
		<view class="bottom">
			<view class="tab">
				<text :class="queryType==1?'cur':''" @click="queryList(1)">收入</text>
				<text :class="queryType==2?'cur':''" @click="queryList(2)">支出</text>
			</view>
			<scroll-view class="scoreList" scroll-y @scrolltolower="lower">
				<view class="list">
					<view class="item"  v-for="(item,index) in scoreList" :key="index">
						<view class="left">
							<view class="score_name">{{item.giftsName}}</view>
							<view class="time">{{item.earnTime}}</view>
						</view>
						<view :class="['right',{'zhichu':queryType==2}]">
							{{item.earnVpoints|toThousands}}
						</view>
					</view>
				</view>
				<view class="noList" v-show="!next">
					{{noListTip}}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';
	export default {
		data() {
			return {
				imgUrl: config.imgUrl,
				safeHeight: getApp().globalData.safeHeight,
				customBarHeight: getApp().globalData.customBarHeight,
				requestUrl: config.requestUrl,
				restVpoints:'',
				scoreList:[],
				queryType: 1,
				currentPage:1,
				count:50, //3
				next:true,
				noListTip:'没有更多记录了'
			}
		},
		onShow() {
			this.queryList();
			this.getRestVpoints(); // 获取剩余积分
		},
		onHide() {
		},
		onUnload() {
		},
		methods: {
			async getRestVpoints() {
				var params = {
					"openid": getApp().globalData.openid,
					"projectServerName":'shandongagt'
				};
				var jo = await requestPost('/user/userInfo',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							this.restVpoints = jo.reply.accountInfo.surplusVpoints; //剩余积分
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
			toBack(){
				uni.navigateBack({
				  delta: 1
				})
			},
			queryList(type) {
				if(type!==undefined && type == this.queryType&&this.currentPage==1){//再次点击同一个tab
					return false;
				}
				if(type!==undefined && type != this.queryType){//切换时清空
					this.currentPage==1;
					this.next = true;
					this.scoreList = [];
				}
				if(type!==undefined&&type!='reset'){
					this.queryType = type;
				}
				uni.request({
					url: this.requestUrl + '/gifts/queryAllVpointsList',
					method: 'POST',
					data: {
						"openid": getApp().globalData.openid,
						"currentPage": this.currentPage,
						"count": this.count,
						"vpointsType": this.queryType, // 1收入，2支出
						"projectServerName":'shandongagt'
					}
				}).then(res=>{
					let [e,r] = res;
					if(r){
						if(r.data.result.code==0){
							if(r.data.result.businessCode==0){
								if(this.currentPage==1){
									this.scoreList = r.data.reply.objList;
								}else{
									if(r.data.reply.objList&&r.data.reply.objList.length>0){
										this.scoreList = this.scoreList.concat(r.data.reply.objList);
									}
								}
								if(!r.data.reply.objList||r.data.reply.objList.length<1){
									this.next = false;
								}else if(r.data.reply.objList.length<this.count){
									this.next = false;
								} else{
									this.next = true;
								}
							} else if(r.data.result.businessCode==1){
								// uni.showModal({
								// 	title:'提示',
								// 	content:'你还未参与过扫码活动',
								// 	showCancel:false
								// })
								this.next = false;
							} else {
								uni.showModal({
									title:'温馨提示',
									content:r.data.result.msg?r.data.result.msg:'系统开了个小差~',
									showCancel:false
								})
								this.next = false;
							}
						}else{
							uni.showModal({
								title:'温馨提示',
								content:r.data.result.msg?r.data.result.msg:'系统开了个小差~',
								showCancel:false
							})
							this.next = false;
						}
					}else{
						console.log(e);
						uni.showModal({
							title:'温馨提示',
							content:'系统繁忙',
							showCancel:false
						})
						this.next = false;
					}
				})
			},
			lower(){
				if(this.next){
					this.queryList(this.queryType)
				}else{
					uni.showToast({
						title:'没有更多了记录了',
						icon:'none'
					})
				}
			},
		},
		components: {
			buttonBg
		}
	}
</script>

<style scoped lang="scss">
	page{
		background:#F8F8F8 !important;   
		height: 100%;
	}
	.listPage{
		background: url($mallImg + 'scoreBg.png') no-repeat center top;
		background-size: 100% 526rpx;
		background-color:#F8F8F8 !important; 
		box-sizing: border-box;
		position: relative;
		height: 100%;
		overflow: hidden;
	}
	.top {
		.title{
			padding-bottom: 45rpx;
			.backArea{
				position: absolute;
				width: 150rpx;
				height: 150rpx;
				.jiantou{
				    width: 24rpx;
					height: 24rpx;
					border-top: 3rpx solid #333;
					border-right: 3rpx solid #333;
					transform: rotate(225deg);
					position: absolute;
				}
			}
			.head {
				text-align: center;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333;
				z-index: 1;
			}
		}
		.total{
			background: url($mallImg+'totalScoreBg.png') no-repeat center top;
			background-size: 608rpx 269rpx;
			height: 176rpx;
			text-align: center;
			padding-top: 10%;
			.rule{
				font-size: 28rpx;
				font-weight: 500;
				text-decoration: underline;
				color: #886326;
				position: absolute;
				right: 50rpx;
				top: 170rpx;
			}
			.txt{
				font-size: 28rpx;
				font-weight: 500;
				color: #000;
				line-height: 72rpx;
			}
			.score{
				font-size: 60rpx;
				font-weight: 500;
				color: #000;
				line-height: 32rpx;
			}
		}
	}
	.bottom{      
		background: #FFF;
		border-radius: 20px;
		margin: 0 24rpx 24rpx;       
		z-index: 1;
		// height: 68vh;
		.tab {
			border-bottom: 1px solid #EEE;    
			line-height: 120rpx;
			display: flex;
			padding: 0 40rpx;
			text {
				box-sizing: border-box;
				height: 120rpx;
				width: 50%;
				text-align: center;
				font-size: 32rpx;
				color: #000;
				font-weight: bold;
				margin: 0 10rpx;
				display: inline-block;
			}
			text.cur {
				color: #65BD69;
				border-bottom: 6rpx solid;
				border-image: linear-gradient(#01B971,#7BD367)0 0 1; /* 标准的必须写在最后 */
			}
		}
		.scoreList {
			max-height: 760rpx;
			.list {
				padding: 0 28rpx 10rpx;
				overflow: hidden;
				.item{
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					padding-bottom: 8rpx;
					border-bottom:1px solid #EEEEEE;
					&:nth-last-child(1){
						border-bottom:none;
					}
					.left{
						.score_name{
							font-size: 28rpx;
							color: #333;
							line-height: 60rpx;
						}
						.time{
							font-size: 26rpx;
							color: #999;
							line-height: 40rpx;
						}
					}
					.right{
						font-size: 30rpx;
						color: #F14701;
						align-items: center;
						display: flex;
						&.zhichu{
							color:#333;
						}
					}
				}
			}
			.noList{
				line-height: 80rpx;
				font-size: 26rpx;
				color: #000000;
				text-align: center;
			}
		}
	}
	
</style>
