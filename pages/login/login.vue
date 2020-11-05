<template>
	<view class="container">
		<view class="login">
            <hx-navbar
                title="验证" 
                :back="false"
                :fixed="true"
                color="#ffffff"
                transparent="show"
                backgroundColorLinearDeg="55"
                :background-color="[[245,49,78],[238,71,102]]">
            </hx-navbar>
		    <view class="list_box">
		        <view class="list">
		            <view class="list_icon">
		                <image src="../../static/user_nor.png" mode=""></image>
		            </view>
		            <input type="number" v-model="phone" placeholder="请输入您的手机号" />
		        </view>
		        <view class="list">
		            <view class="list_icon">
		                <image src="../../static/auth_code.png" mode=""></image>
		            </view>
		            <input class="code" v-model.trim ="code" type="number" placeholder="请填写验证码" />
		            <view class="code_txt" :class="{codeColr:!codeShow}" @tap="sendcode()">
		                {{code_txt}}
		            </view>
		        </view>
		    </view>
            <view class="btn" @tap="checklogin()">
                验证
            </view>
		</view>
	</view>
</template>

<script>
    import wxcode from "../../common/getWxCode.js"
	export default {
		data() {
			return {
				status:false,
			    phone:"",  //手机号码
			    codeNum:60,  //验证码倒计时
			    code_txt:"获取验证码",
			    time:'', //定时器
			    codeShow:true,
			    code:'',  //验证码
                pid:"",
                rate_code:"",
			};
		},
        onLoad(option) {
            // 获取URL 上tk_pid
            const tk_pid = wxcode.getUrlParam('tk_pid');
            const rate_code = wxcode.getUrlParam('rate_code');
            if(rate_code){
                this.rate_code = rate_code;
                uni.setStorageSync('rate_code', this.rate_code);
            }
            if(tk_pid){
                 this.pid = tk_pid;
             }
        },
        methods:{
            // 登录
            checklogin(){
                let that = this;
                uni.showLoading({
                    title:'登录中...'
                })
                if(!that.phone){
                    uni.showToast({
                        title:'请输入手机号码',
                        icon:'none'
                    })
                    return false
                }else if(!(/^1[3456789]\d{9}$/.test(that.phone))){ 
                    uni.showToast({
                        title:'请输入正确的手机号码',
                        icon:'none'
                    })
                    return false; 
                }else if(!that.code){
                    uni.showToast({
                        title:'请输入验证码',
                        icon:'none'
                    })
                    return false
                }
                that.$http.httpRequest({
                    url:that.$baseUrl.checklogin.url,
                    method:that.$baseUrl.checklogin.method,
                    data:{mobile:that.phone,code:that.code,tk_pid:this.pid,rate_code:that.rate_code}
                }).then(res=>{
                    console.log(res);
                    uni.hideLoading();
                    let data = res[1].data;
                    if(data.code == 100802 ){ //注册成功跳转认证页面
                        uni.navigateTo({
                            url:`/pages/information/information?user_id=${data.data[0]}`
                        })
                    }else if(data.code == 100803 ){
                        uni.navigateTo({
                            url:`/pages/choice/choice?user_id=${data.data[0]}`
                        })
                    }else if(data.code == 200){
                        uni.navigateTo({
                            url:`/pages/information/information?user_id=${data.data[0]}`
                        })
                    }else{
                        uni.showToast({
                            title:data.msg,
                            icon:'none'
                        })
                    }
                },err=>{
                    console.log(err)
                })
            },
            sendcode(){
                let that = this;
                if(!that.phone){
                    uni.showToast({
                        title:'请输入手机号码',
                        icon:'none'
                    })
                    return false
                }else if(!(/^1[3456789]\d{9}$/.test(that.phone))){ 
                    uni.showToast({
                        title:'请输入正确的手机号码',
                        icon:'none'
                    })
                    return false; 
                }
                if(that.codeShow){
                    that.codeNum = 60;
                    that.$http.httpRequest({
                        url:that.$baseUrl.sendcode.url,
                        method:that.$baseUrl.sendcode.method,
                        data:{
                            mobile:that.phone,
                            type:8
                        }
                    }).then(res=>{
                        console.log(res);
                        let data = res[1].data;
                        console.log(data);
                        if(data.code == 200){
                            that.codeShow = false;
                            that.code_txt = that.codeNum + 's';
                            that.time = setInterval(function(){
                                if(that.codeNum>0){
                                    that.codeNum--;
                                    that.code_txt = that.codeNum + 's';
                                    that.codeShow = false;
                                }else{
                                    that.codeShow = true;
                                    clearInterval(that.time);
                                    that.code_txt = "获取验证码";
                                    that.codeNum = 60;
                                }
                            },1000)
                            uni.showToast({
                                title:data.msg,
                                icon:'none'
                            })
                        }
                    },err=>{
                        console.log(err)
                    })
                }
            },
        }
	}
</script>

<style lang="scss">
    // page{background-color: #FFFFFF;}
    .btn{
        margin: 100upx auto 0;
        width:690upx;
        height:88upx;
        background:linear-gradient(24deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
        box-shadow:0upx -4upx 0upx rgba(245,245,245,1);
        border-radius:10upx;
        text-align: center;
        line-height: 88upx;
        font-size:32upx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
    }
    .list_box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .list{
            width:690upx;
            height:88upx;
            background:rgba(255,255,255,1);
            box-shadow:0upx 4upx 30upx rgba(247,135,156,0.1);
            border-radius:8upx;
            margin-top: 30upx;
            display: flex;
            align-items: center;
            padding: 24upx 20upx;
            box-sizing: border-box;
            .hidden{
                width: 32upx;
                height: 32upx;
                margin-left: auto;
                image{vertical-align: top;}
            }
            input{
                margin-left: 16upx;
                width:374upx;
                height:40upx;
                font-size:28upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:#F5314E;
            }
            .code{
                width: 368upx;
            }
            .code_txt{
                width:140upx;
                height:44upx;
                background:rgba(245,49,78,1);
                border-radius:6upx;
                font-size:22upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:44upx;
                color:rgba(255,255,255,1);
                text-align: center;
                margin-left: auto;
            }
            .codeColr{
                background-color: #DBDBDB;
            }
            .list_icon{
                width: 36upx;
                height: 36upx;
                image{vertical-align: top;}
            }
        }
    }
</style>
