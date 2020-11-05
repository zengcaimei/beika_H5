<template>
	<view class="container">
		<view class="paymentSuc">
		    <view class="img">
		        <image src="../../static/suc.png" mode=""></image> 
		    </view>
            <view class="txt">
                交易成功
            </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
    .txt{
        font-size: 36upx;
        text-align: center;
    }
    .img{
        width: 88upx;
        height: 88upx;
        margin: 60upx auto 30upx;
    }
</style>
