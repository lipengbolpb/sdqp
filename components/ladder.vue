<template>
	<view class="ladder_page" v-if="showLadder&&showLadderPage">
		<view class="ladder_box">
			<image :src="JieTiUrl+'icon_close.png'" mode="widthFix" @click="closeLadder" class="closeLadder"></image>
			<view class="ladder_bg">
				<text class="tip_1">{{ladderTxtOne}}</text>
				<text class="tip_2">{{ladderTxtTwo}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		config
	} from '@/utils/api.js';
	export default {
		data() {
			return {
				JieTiUrl:config.staticUrl+'/JieTi/',
				showLadderPage:true,
			};
		},
		props:{
			showLadder:{
				type:Boolean,
				default:false
			},
			ladderTxtOne:{
				type:String,
				default:''
			},
			ladderTxtTwo:{
				type:String,
				default:''
			},
		},
		updated() {
			
		},
		mounted() {
			
		},
		watch:{
			// index:{
			// 	handler(val){
			// 		console.log(3333333)
			// 		console.log(val)
			// 		this.setLadderTxt(val);
			// 	}
			// }
		}, 
		methods:{
			closeLadder(e){
				this.showLadderPage = false;
				this.$emit('LadderPagelose', false);
			},
			setLadderTxt(index){
					switch (index){
						case 1:
							this.ladderTxtOne = '健康\n步步高红包';
							this.ladderTxtTwo = '下一个更高';
							break;
						case 2:
							this.ladderTxtOne = '快乐\n步步高红包';
							this.ladderTxtTwo = '下一个更高';
							break;
						case 3:
							this.ladderTxtOne = '运气\n步步高红包';
							this.ladderTxtTwo = '下一个更高';
							break;
						case 4:
							this.ladderTxtOne = '福气\n步步高红包';
							this.ladderTxtTwo = '下一个更高';
							break;
						case 5:
							this.ladderTxtOne = '财气\n步步高红包';
							this.ladderTxtTwo = '下一个更高';
							break;	
						case 6:
							this.ladderTxtOne = '青啤虽好\n莫贪杯';
							this.ladderTxtTwo = '明日再战';
							break;		
						default:
							this.ladderTxtOne = '青啤虽好\n莫贪杯';
							this.ladderTxtTwo = '明日再战';
							break;
					}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ladder_page{
		width: 100%;
		height: 100%;
		background: rgba(#000,.7);
		display: flex;
		align-items: center;
		justify-content: center; 
		position: absolute;
		z-index: 100;
		left: 0;
		top: 0;

	}
	.ladder_box{
		width: 520rpx;
		height: 690rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		.closeLadder{
			height: auto;
			width: 45rpx;
			margin-right: 25rpx;
			margin-bottom: 5rpx;
		}
		.ladder_bg{
			width: 520rpx;
			height: 640rpx;
			background: url($saoDianDe+'JieTi/ladder_bg.png') no-repeat center;
			background-size: 100% auto;
			display: flex;
			justify-content: center;
			flex-direction: column;
			color: #e30000;
			text-align: center;
			.tip_1{
				font-size: 51rpx;
				font-weight: bold;
			}
			.tip_2{
				font-size: 28rpx;
				line-height: 80rpx;
			}
		}
	}
</style>
