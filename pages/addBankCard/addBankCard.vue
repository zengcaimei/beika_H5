<template>
	<view class="container">
		<view class="addBankCard">
		    <hx-navbar
		        title="绑卡" 
		        :back="true"
		        :fixed="true"
		        color="#ffffff"
		        transparent="show"
		        backgroundColorLinearDeg="55"
		        :background-color="[[245,49,78],[238,71,102]]">
		    </hx-navbar>
            <view class="title">
                请先添加信用卡
            </view>
            <view class="title_txt">
                请绑定持卡本人的银行卡
            </view>
            <view class="list_box">
                <view class="list">
                    <view class="list_txt">
                        持卡人
                    </view>
                    <input type="text" v-model.trim="name" placeholder="请输入姓名" />
                </view>
                <view class="list">
                    <view class="list_txt">  
                        卡号
                    </view>
                    <input type="number" v-model.trim="cardNum" placeholder="请输入卡号" @input="onKeyInput" />
                    <view class="she_icon">
                        <image src="../../static/she_icon.png" mode=""></image>
                        <view ref="input" class="input" v-model="file" id="fileUpdate"></view>
                    </view>
                </view>
                <view class="list">
                    <view class="list_txt">
                        银行卡名称
                    </view>
                    <input type="text" v-model.trim="bank_name" placeholder="请输入银行卡名称" />
                </view>
                <!-- <picker @change="bindPickerChange" :value="typeInd" :range="typeArr">
                <view class="list">
                    <view class="list_txt">
                        卡类型
                    </view>
                    <view class="list_tips" :class="{tips_color:typeArr[typeInd]}">
                        {{typeArr[typeInd]?typeArr[typeInd]:"-请选择卡类型-"}}
                    </view>
                    <view class="right_icon">
                        <image src="../../static/right_icon.png" mode=""></image>
                    </view>
                </view>
                </picker> -->
                <view class="list">
                    <view class="list_txt">
                        有效期
                    </view>
                    <input type="number" v-model.trim="term" @blur="blurChang" placeholder="请输入月份年份(0120)" />
                </view>
                <view class="list">
                    <view class="list_txt">
                        安全码
                    </view>
                    <input type="number" v-model.trim="safety" placeholder="请输入卡背面最后三位数字" />
                </view>
                <view class="list">
                    <view class="list_txt">
                        手机号
                    </view>
                    <input type="number" v-model="phone" placeholder="请输入银行卡绑定手机号" />
                </view>
                <view class="list">
                    <view class="list_txt">
                        验证码
                    </view>
                    <input type="number" class="code_inp" v-model.trim="code" maxlength="6" placeholder="请输入验证码" />
                    <view class="code_btn" :class="{codeColr:!codeShow}" @tap='sendcode()'>
                        {{code_txt}}
                    </view>
                </view> 
            </view> 
            <view class="btn" @tap="nextStep()">
                完成绑定
            </view>
		</view> 
	</view>  
</template> 

<script>
    import BIN from '@/common/bankCardAttribution.js';
	export default {    
		data() {
			return {
                file:"",
                // typeArr:["储蓄卡","信用卡"],
                // typeInd:2,
                name:"", //姓名
                cardNum:"",  //卡号
                term:"", //有效期
                safety:"",  //安全码
                phone:"",  //手机号码
                code:"",  //验证码
                codeNum:60,  //验证码倒计时
                code_txt:"获取验证码",
                time:'', //定时器
                codeShow:true,
                user_id:"",
                bank_name:"", //银行卡名称
			};
		},
        onLoad(option) {
          this.user_id = option.user_id;  
        },
        mounted() {
        	var that = this;
        	var input = document.createElement('input');
            input.type = 'file';
        	// 银行卡号
        	input.onchange = event => {
        		var file = event.target.files[0];
        		var reader = new FileReader();
        		reader.readAsDataURL(file);  
        		reader.onload = function(e) {
        			var data = e.target.result;
        	        that.$http.httpRequest({ 
        	            url:that.$baseUrl.uploadbankcardimg.url,
        	            method:that.$baseUrl.uploadbankcardimg.method,
        	            data:{
        	                baseImg:data
        	            }
        	        }).then(res=>{
        	            let data = res[1].data;
        	            if(data.code == 200){
        	                that.cardNum = data.data.bank_card;
        	            }else{
        	                uni.showToast({
        	                    title:data.msg,
        	                    icon:'none'
        	                })
        	            }
        	        },err=>{})
        		};
        	};
        	this.$refs.input.$el.appendChild(input);
        },
        methods:{
            onKeyInput: function(event) {
                this.cardNum = event.target.value;
                if(/^([1-9]{1})(\d{15}|\d{18})$/.test(this.cardNum)){
                    let info = BIN.bankCardAttribution(this.cardNum);
                    if(info){
                        console.log(info.bankName);
                        this.bank_name = info.bankName;
                    }
                }
            },
            blurChang(event){
                let vaule = event.target.value;
                // if(value.indexOf("/") != 2){
                //     uni.showModal({
                //         content:'有效期格式不正确，如(01/20)'
                //     })
                // }
            },
            nextStep(){
                let that = this;
                if(!that.name){
                    that.tipsShow("请输入姓名");
                    return false;
                }else if(!that.cardNum){
                    that.tipsShow("请输入银行卡号");
                    return false;
                }else if(!(/^([1-9]{1})(\d{15}|\d{18})$/.test(that.cardNum))){
                    that.tipsShow("银行卡号不正确");
                    return false;
                }else if(!that.bank_name){
                    that.tipsShow("请输入银行卡名称");
                    return false;
                }else if(!that.term){
                    that.tipsShow("请输入有效期");
                    return false;
                }else if(!that.safety){
                    that.tipsShow("请输入安全码");
                    return false;
                }else if(!that.phone){
                    that.tipsShow("请输入手机号码");
                    return false;
                }else if(!(/^1[3456789]\d{9}$/.test(that.phone))){
                    that.tipsShow('请输入正确的手机号码');
                    return false;
                }else if(!that.code){
                    that.tipsShow('请输入验证码');
                    return false;
                }
                that.$http.httpRequest({
                    url:that.$baseUrl.userbindcard.url,
                    method:that.$baseUrl.userbindcard.method,
                    data:{
                        user_id:that.user_id,
                        nickname:that.name,
                        type:2,
                        bank_card:that.cardNum,
                        pre_mobile:that.phone,
                        mobile_code:that.code,
                        card_cvn:that.safety,
                        card_expire:that.term,
                        bank_name:that.bank_name
                    }
                }).then(res=>{
                    console.log(res);
                    let data = res[1].data;
                    if(data.code == 200){
                        uni.navigateBack();
                    }else{
                        uni.showToast({
                            title:data.msg,
                            icon:'none'
                        })
                    }
                },err=>{})
            },
            tipsShow(tips){
                uni.showToast({
                    title:tips,
                    icon:'none'
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
                        let data = res[1].data;
                        if(data.code == 200){
                            that.codeShow = false;
                            that.code_txt = that.codeNum + 's';
                            that.time = setInterval(function(){
                                if(that.codeNum>0){
                                    that.codeNum--;
                                    that.code_txt = that.codeNum + 's';
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
            // bindPickerChange: function(e) {
            //     console.log(e.target.value)
            //     this.typeInd = e.target.value
            // },
            
        }
	}
</script>

<style lang="scss">
    page{background-color: #FFFFFF;} 
    .input{
        opacity: 0;
        width: 36upx;
        height: 36upx;
        position: absolute;
        top: 50%;
        border-radius: 50%;
        transform: translateY(-50%);
        z-index: 100;
        right: 0;
        overflow: hidden;
    }
    .btn{
        width:690upx;
        height:88upx;
        background:linear-gradient(43deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
        box-shadow:0upx -4upx 0upx rgba(245,245,245,1);
        border-radius:10upx;
        margin: 120upx auto 40upx;
        font-size:32upx;
        font-family:PingFang SC;
        font-weight:500;
        line-height:88upx;
        color:rgba(255,255,255,1);
        text-align: center;
    }
    .list_box{  
        margin-top: 100upx;
        padding: 0 30upx;
        background-color: #FFFFFF;
        .list{
            display: flex;
            align-items: center;
            width:690upx;
            height:100upx;
            background:rgba(255,255,255,1);
            border-bottom: 2upx solid #F2F2F2;
            position: relative;
            .code_btn{
                width:180upx;
                height:44upx;
                background:linear-gradient(49deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
                border-radius:6upx;
                line-height: 44upx;
                text-align: center;
                font-size:22upx;
                font-family:PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin-left: auto;
            }
            .codeColr{
                background: #DBDBDB;
            }
            .right_icon{
                width: 12upx;
                height: 20upx;
                margin-left: auto;
                image{vertical-align: top;}
            }
            .list_tips{
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(176,176,176,1);
                margin-left: 62upx;
            }
            .tips_color{
                color: #1A1A1A;
            }
            .she_icon{
                width: 36upx;
                height: 36upx;
                margin-left: auto;
            }
            input{
                width:360upx;
                height:42upx;
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                margin-left: 62upx;
                color: #1A1A1A;
            }
            .code_inp{
                width: 260upx;
            }
            .list_txt{
                width:150upx;
                height:42upx;
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:500;
                line-height:40upx;
                color:rgba(26,26,26,1);
            }
        }
    }
    .title_txt{
        font-size:30upx;
        font-family:PingFang SC;
        font-weight:400;
        line-height:42upx;
        color:rgba(0,0,0,1);
        margin-top: 20upx;
        text-align: center;
    }
    .title{
        text-align: center;
        font-size:40upx;
        font-family:PingFang SC;
        font-weight:800;
        line-height:56upx;
        color:rgba(0,0,0,1);
        margin-top: 100upx;
    }
</style>
