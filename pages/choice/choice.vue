<template>
	<view class="container">
		<view class="choice">
            <hx-navbar
                title="选择通道" 
                :back="true"
                :fixed="true"
                color="#ffffff"
                transparent="show"
                backgroundColorLinearDeg="55"
                :background-color="[[245,49,78],[238,71,102]]">
            </hx-navbar>
		    <view class="title">
		        请直接选择通道进入
		    </view>
            <view class="list_box">
                <view class="list" v-for="(item,index) in list" :key="index" @tap="Choice(index)">
                    <view class="list_left">
                        {{item.name}}{{item.msg}}
                    </view>
                    <view class="list_icon">
                        <!-- 选中 -->
                        <image v-if="state == index" src="../../static/choice_icon.png" mode=""></image>
                        <!-- 未选中 -->
                        <image v-else src="../../static/nochoice_icon.png" mode=""></image>
                    </view>
                </view>
            </view>
            <view class="btn" @tap="addBankCard()">
                确定
            </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				state:0,
                list:[],
                user_id:"",
			};
		},
        onLoad(option) {
          this.user_id = option.user_id;
          this.getprodlist();  
        },
        methods:{
            getprodlist(){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.getprodlist.url,
                    method:that.$baseUrl.getprodlist.method,
                    data:{user_id:that.user_id}
                }).then(res=>{
                    console.log(res);
                    let data = res[1].data;
                    if(data.code == 200){
                        that.list = data.data;
                    }
                },err=>{})
            },
            addBankCard(index){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.checkchannelisallbank.url,
                    method:that.$baseUrl.checkchannelisallbank.method,
                    data:{
                        channel_id:that.list[that.state].channel_id,
                        user_id:that.user_id
                    },
                }).then(res=>{
                    let info = that.list[that.state];
                    let data = res[1].data;
                    if(data.code == 200){
                        uni.navigateTo({
                            url:`/pages/collection/collection?user_id=${that.user_id}&index=${that.state}`
                        })
                    }else{
                        uni.showToast({
                            title:data.msg,
                            icon:'none'
                        })
                    }
                },err=>{})
            },
            Choice(index){
                this.state = index;
            },
        }
	}
</script>

<style lang="scss">
    .list_box{padding-top: 100upx;}
    .btn{
        width:690upx;
        height:88upx;
        background:linear-gradient(43deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
        box-shadow:0upx -4upx 0upx rgba(245,245,245,1);
        border-radius:10upx;
        margin: 202upx auto 40upx;
        text-align: center;
        line-height: 88upx;
        font-size:32upx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
    }
    .list{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 690upx;
        height: 100upx;
        border-bottom: 2upx solid #f5f5f5;
        margin: auto;
        .list_icon{
            width: 34upx;
            height: 34upx;
        }
        .list_left{
            font-size:30upx;
            font-family:PingFang SC;
            font-weight:400;
            line-height:40upx;
            color:rgba(51,51,51,1);
        }
    }
    .title{
        font-size:40upx;
        font-family:PingFang SC;
        font-weight:800;
        line-height:56upx;
        color:rgba(0,0,0,1);
        padding-top: 102upx;
        text-align: center;
    }
</style>
