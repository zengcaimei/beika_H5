<template>
	<view class="container">
		<view class="home">
		    <hx-navbar
		        title="选择支付通道" 
		        :back="false"
		        :fixed="true"
		        color="#ffffff"
		        transparent="show"
		        backgroundColorLinearDeg="55"
		        :background-color="[[245,49,78],[238,71,102]]">
		    </hx-navbar>
            <view class="list_box">
                <view class="list" @tap='information()'>
                    <view class="list_left">
                        <image src="../../static/quick_icon.png" mode=""></image>
                    </view>
                    <view class="list_right">
                        <view class="list_title">
                            快捷通道
                        </view>
                        <view class="list_bot">
                            <view class="bot_left">
                                <view>单笔：100-1000元 </view>
                                <view>
                                    费率：97%
                                </view>
                            </view>
                            <view class="bot_right">
                                <view>当天：不限 </view>
                                <view>交易时间06:00-23:00</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="list" @tap='information()'>
                    <view class="list_left">
                        <image src="../../static/zfb_icon.png" mode=""></image>
                    </view>
                    <view class="list_right">
                        <view class="list_title">
                            支付宝花呗
                        </view>
                        <view class="list_bot">
                            <view class="bot_left">
                                <view>单笔：100-1000元 </view>
                                <view>
                                    费率：97%
                                </view>
                            </view>
                            <view class="bot_right">
                                <view>当天：不限 </view>
                                <view>交易时间06:00-23:00</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="list" @tap='information()'>
                    <view class="list_left">
                        <image src="../../static/credit_icon.png" mode=""></image>
                    </view>
                    <view class="list_right">
                        <view class="list_title">
                            信用卡
                        </view>
                        <view class="list_bot">
                            <view class="bot_left">
                                <view>单笔：100-1000元 </view>
                                <view>
                                    费率：97%
                                </view>
                            </view>
                            <view class="bot_right">
                                <view>当天：不限 </view>
                                <view>交易时间06:00-23:00</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
            uni.hideTabBar();
		},
		methods: {
            information(){
                uni.navigateTo({
                    url:`/pages/information/information`
                })
            },
		}
	}
</script>

<style lang="scss">
	.list_box{
        padding: 0 30upx;
        .list{
            width:690upx;
            height:188upx;
            background:rgba(255,240,242,1);
            border-radius:20upx;
            box-sizing: border-box;
            padding: 30upx;
            display:flex;
            // align-item:center;
            margin-top: 30upx;
            .list_right{
                margin-left: 30upx;
                .list_bot{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 552upx;
                    flex-wrap: wrap;
                    margin-top: 10upx;
                    view{
                        min-width: 175upx;
                        font-size:26upx;
                        font-family:PingFang SC;
                        font-weight:400;
                        line-height:36upx;
                        color:rgba(153,153,153,1);
                    }
                }
                .list_title{
                    font-size:32upx;
                    font-family:PingFang SC;
                    font-weight:bold;
                    line-height:44upx;
                    color:rgba(26,26,26,1);
                }
            }
            .list_left{
                width: 48upx;
                height: 48upx;
            }
        }
        .list:nth-child(2){
            background-color: #F0FBFF;
        }
        .list:last-child{
            background-color: #FFF8F0;
        }
    }
</style>
