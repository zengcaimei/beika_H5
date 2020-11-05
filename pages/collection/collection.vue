<template>
	<view class="container">
		<view class="collection">
		    <hx-navbar
		        title="收款" 
		        :back="true"
		        :fixed="true"
		        color="#ffffff"
		        transparent="show"
		        backgroundColorLinearDeg="55"
		        :background-color="[[245,49,78],[238,71,102]]">
		    </hx-navbar>
            <view class="list_box">
                <view class="list">
                    <view class="list_title">
                        结算卡
                    </view>
                    <view class="list_txt">
                        {{mybank.bank_name}}({{mybank.bank_card}})
                    </view>
                </view>
                <view class="list" @tap="open('bottom')">
                    <view class="list_title">
                        信用卡
                    </view>
                    <view class="list_txt" v-if="list.length>0">
                        {{list[idInd].bank_name}}({{list[idInd].bank_card}})
                    </view>
                    <view class="right_icon">
                        <image src="../../static/right_icon.png" mode=""></image>
                    </view>
                </view>
                <picker @change="bindPickerChange" :value="choice_ind" :range="listData">
                <view class="list">
                    <view class="list_title">
                        收款通道
                    </view>
                    <view class="list_txt">
                        {{listData[choice_ind]}}
                    </view>
                    <view class="right_icon">
                        <image src="../../static/right_icon.png" mode=""></image>
                    </view>
                </view>
                </picker>
                <view class="tips_box">
                    大额最髙2.6%，小额最高2.0%
                </view>
                <view class="money_box">
                    <view class="money_title">
                        收款金额
                    </view>
                    <view class="box">
                        <view class="money_icon">
                            ￥
                        </view>
                        <input type="digit" @input="onKeyInput" v-model.trim="money" placeholder="请输入收款金额" />
                    </view>
                    <view class="tips" v-if="money" :class="{tipsColor:money}"> 
                         <text>手续费：{{service_charge}}</text>
                         <text v-if="money">到账金额：{{account}}</text>
                    </view>
                </view>
                <view class="list_address" @tap="openAddres()">
                    <view class="list_title">
                        消费城市
                    </view>
                    <view class="list_txt">
                        {{province}} {{city}} {{district}}
                    </view>
                    <view class="right_icon">
                        <image src="../../static/address_icon.png" mode=""></image>
                    </view>
                </view>
            </view>
            <view class="btn" @tap="payStep(2)">
                下一步
            </view>
		</view>
        
        <!-- 地区三级联动 -->
        <simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
        
        <!-- 添加银行用卡 -->
        <uni-popup ref="popup" :type="type">
            <block v-if="type == 'bottom'">
                <view class="pop_box">
                    <view class="pop_list" v-for="(item,index) in list" :key="index" @tap="idClick(index)">
                        <view class="pop_left">
                            {{item.bank_name||""}}({{item.bank_card}})
                        </view>
                        <view class="pop_icon">
                            <!-- 选中 -->
                            <image v-if="idInd==index" src="../../static/choice_icon.png" mode=""></image>
                            <!-- 未选中 -->
                            <image v-else src="../../static/nochoice_icon.png" mode=""></image>
                        </view>
                    </view>
                    <view class="pop_btn" @tap="addBankCard()">
                        添加信用卡
                    </view>
                </view>
            </block>
            <!-- 验证码 -->
            <block v-if="type == 'center'">
                <view class="code_box">
                    <view class="code_title">
                        已发送验证码至{{phone}}
                    </view>
                    <view class="code_content">
                        <view class="code_txt">
                            验证码
                        </view>
                        <input type="number" v-model.trim="code" placeholder="请输入验证码" />
                        <view class="code_num">
                            {{count_down}}s
                        </view>
                    </view>
                    <view class="pop_bot">
                        <view @click="close">
                            取消
                        </view>
                        <view @tap="payStep(4)">确认支付</view>
                    </view>
                </view>
            </block>
        </uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				idInd:0,
                type:'center',
                money:'',  //收款金额
                list:"",  //银行卡列表
                user_id:"",
                service_charge:"", //手续费
                account:"", //到账金额
                choice_list:"", //收款通道列表
                choice_ind:"", 
                listData:[],
                mybank:"",  //我的储蓄卡
                code:"",  //验证码
                phone:'',
                count_down:120,  //倒计时
                time:"",
                province:"",  //省
                city:"",  //城
                district:"",  //区
                orderId:"",
                rate_code:"",
                cityPickerValueDefault: [0, 0, 1],
                count:"",  //手续费率
			};
		},
        onLoad(option) {
          const value = uni.getStorageSync('rate_code');
          if (value) {
              this.rate_code = value;
              this.rateCount();
          }
          this.user_id = option.user_id;
          this.choice_ind = option.index;
          this.getLocation();
          this.getprodlist();
          this.getmybank();
        },
        onShow() {
           this.getbankbytype(); 
        },
        methods:{
            openAddres() {
                this.cityPickerValueDefault = [0,0,0]
                this.$refs.simpleAddress.open();
            },
            onConfirm(e) {
                let info = e.labelArr;
                this.province = info[0];
                this.city = info[1];
                this.district = info[2];
            },
            onKeyInput: function(event) {
                this.money = event.target.value;
                let info = this.choice_list[this.choice_ind];
                if(this.money){
                    this.service_charge = this.money*Number(this.count)+info.charge;
                    this.service_charge = this.service_charge.toFixed(2);
                    this.account = (this.money-this.service_charge).toFixed(2);
                }
            },
            getLocation(){
               let that = this;
               uni.getLocation({
                   type: 'wgs84',
                   success: function (res) {
                       that.getcityLlocation(res);
                   }
               });
            },
            chooseLocation(){
                let that = this;
                uni.chooseLocation({
                    success: function (res) {
                        that.getcityLlocation(res);
                    }
                });
            },
            // 手续费
            rateCount(){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.rateCount.url,
                    method:that.$baseUrl.rateCount.method,
                    data:{rate_code:that.rate_code}
                }).then(res=>{
                    that.count = res[1].data;
                },err=>{})
            },
            //地址请求
            getcityLlocation(res){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.getcityLlocation.url,
                    method:that.$baseUrl.getcityLlocation.method,
                    data:{lng:res.longitude,lat:res.latitude}
                }).then(res=>{
                    let data = res[1].data;
                    if(data.code == 200){
                        that.province = data.data.province;
                        that.city = data.data.city;
                        that.district = data.data.district;
                    }
                },err=>{})
            },
            // 请求支付
            payStep(payStep){
                let that = this;
                let data;
                if(payStep == 2){  //请求支付
                    if(!that.money){
                        uni.showToast({
                            title:"请输入收款金额",
                            icon:'none'
                        })
                        return false;
                    }else if(that.account<0){
                        uni.showToast({
                            title:"收款金额过少",
                            icon:'none'
                        })
                        return false;
                    }else if(!that.province){
                        uni.showToast({
                            title:"请获取消费城市",
                            icon:'none'
                        })
                        return false;
                    }
                    data = {
                        payStep:payStep,
                        channel_id:that.choice_list[that.choice_ind].channel_id,
                        pay_money:that.money,
                        user_id:that.user_id,
                        mybank_id:that.list[that.idInd].mybank_id,
                        province:that.province,
                        city:that.city,
                        district:that.district,
                        rate_code:that.rate_code
                    }
                }else if(payStep == 4){  //确认支付
                    if(!that.code){
                        uni.showToast({
                            title:"请输入短信验证码",
                            icon:'none'
                        })
                        return false;
                    }
                    data = {
                        orderId:that.orderId,
                        payStep:payStep,
                        channel_id:that.choice_list[that.choice_ind].channel_id,
                        user_id:that.user_id,
                        sms_code:that.code
                    }
                }
                that.$http.httpRequest({
                    url:that.$baseUrl.paystep.url,
                    method:that.$baseUrl.paystep.method,
                    data:data
                }).then(res=>{
                    let info = res[1].data;
                    if(info.code == 200){
                        uni.showToast({
                            title:info.msg,
                            icon:'none'
                        })
                        if(payStep == 2){
                            that.open("center");
                            that.phone = that.formatBankNumber(info.data.mobile)
                            that.orderId = info.data.orderId;
                            clearInterval(that.time);
                            that.count_down = 120;
                            that.time = setInterval(function(){
                                if(that.count_down>0){
                                    that.count_down--;
                                }else{
                                    clearInterval(that.time);
                                    that.count_down=120;
                                    that.close();
                                }
                            },1000)
                        }else{
                            that.close();
                            setTimeout(function() {
                                uni.reLaunch({
                                    url: `/pages/paymentSuc/paymentSuc`
                                });
                            }, 300);
                        }
                    }else{
                        uni.showToast({
                            title:info.msg,
                            icon:'none'
                        })
                    }
                },err=>{})
            },
            // 收款通道列表
            getprodlist(){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.getprodlist.url,
                    method:that.$baseUrl.getprodlist.method,
                    data:{user_id:that.user_id}
                }).then(res=>{  
                    let data = res[1].data;
                    if(data.code == 200){
                        that.choice_list = data.data;
                        for(let i in that.choice_list){
                            let name = that.choice_list[i].name+that.choice_list[i].msg;
                            that.listData.push(name);
                        }
                    }
                },err=>{})
            },
            // 信用卡列表
            getbankbytype(){
                let that = this;
                that.list = "";
                that.$http.httpRequest({
                    url:that.$baseUrl.getbankbytype.url,
                    method:that.$baseUrl.getbankbytype.method,
                    data:{type:2,user_id:that.user_id}
                }).then(res=>{
                    let data = res[1].data;
                    if(data.code == 200){
                        let list = data.data;
                        if(list.length<=0){
                            uni.showModal({
                                title:"",
                                content:"你还没绑定信用卡，是否前去绑定？",
                                success: function (res) {
                                    if (res.confirm) {
                                        uni.navigateTo({
                                            url:`/pages/addBankCard/addBankCard?user_id=${that.user_id}`
                                        })
                                    }
                                }
                            })
                        }else{
                            that.list = list;
                            for(let i in that.list){
                                that.list[i].bank_card = that.formatBankNumber(that.list[i].bank_card);
                            }
                        }
                    }
                },err=>{})
            },
            // 我的储蓄卡
            getmybank(){
                let that = this;
                that.$http.httpRequest({
                    url:that.$baseUrl.getmybank.url,
                    method:that.$baseUrl.getmybank.method,
                    data:{user_id:that.user_id}
                }).then(res=>{
                    let data = res[1].data;
                    if(data.code == 200){
                        that.mybank = data.data;
                        that.mybank.bank_card = that.formatBankNumber(that.mybank.bank_card)
                    }
                },err=>{})
            },
            addBankCard(){
                uni.navigateTo({
                    url:`/pages/addBankCard/addBankCard?user_id=${this.user_id}`
                })
            },
            formatBankNumber(bankNumber){
                return bankNumber.substr(0,4)+"****"+bankNumber.substr(-4);
            },
            bindPickerChange(e){
                this.choice_ind = e.target.value;
            },
            idClick(index){
                this.idInd = index;
            },
            open(type){
                this.type = type;
                this.$refs.popup.open();
            },
            close(){
                this.$refs.popup.close();
            }
        }
	}
</script>

<style lang="scss">
    .code_box{
        width:560upx;
        height:374upx;
        background:rgba(248,248,248,1);
        border-radius:28upx;
        overflow: hidden;
        .pop_bot{
            display: flex;
            justify-content: space-between;
            margin-top: 40upx;
            view{
                width:280upx;
                height:88upx;
                background:rgba(245,49,78,1);
                border-radius:0upx 0upx 28upx 0upx;
                font-size:34upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:88upx;
                color:rgba(255,255,255,1);
                text-align: center;
            }
            view:nth-child(1){
                background-color: #F8F8F8;
                color: #999999;
            }
        }
        .code_content{
            display: flex;
            align-items: center;
            // justify-content: space-between;
            padding: 0 30upx;
            width:500upx;
            height:100upx;
            background:rgba(248,248,248,1);
            margin-top: 40upx;
            .code_num{
                width:80upx;
                height:40upx;
                background:rgba(242,242,242,1);
                border-radius:6upx;
                font-size:22upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(245,49,78,1);
                text-align: center;
                margin-left: auto;
            }
            input{
                width: 218upx;
                font-size:28upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(179,179,179,1);
                margin-left: 56upx;
            }
            .code_txt{
                font-size:28upx;
                font-family:PingFang SC;
                font-weight:500;
                line-height:40upx;
                color:rgba(26,26,26,1);
            }
        }
        .code_title{
            font-size:28upx;
            font-family:PingFang SC;
            font-weight:400;
            line-height:40upx;
            color:rgba(0,0,0,1);
            margin-top: 66upx;
            text-align: center;
        }
    }
    .pop_box{
        background-color: #FFFFFF;
        padding: 0 30upx 32upx;
        .pop_btn{
            width:690upx;
            height:88upx;
            background:linear-gradient(43deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
            box-shadow:0upx -4upx 0upx rgba(245,245,245,1);
            border-radius:10upx;
            font-size:32upx;
            font-family:PingFang SC;
            font-weight:500;
            line-height:88upx;
            color:rgba(255,255,255,1);
            margin: 82upx auto 0;
            text-align: center;
        }
        .pop_list{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width:690upx;
            height:100upx;
            background:rgba(255,255,255,1);
            border-bottom: 2upx solid #F2F2F2;
            .pop_icon{
                width: 34upx;
                height: 34upx;
            }
            .pop_left{
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(51,51,51,1);
            }
        }
    }
    .btn{
        width:690upx;
        height:88upx;
        background:linear-gradient(43deg,rgba(245,49,78,1) 0%,rgba(238,71,102,1) 100%);
        box-shadow:0upx -4upx 0upx rgba(245,245,245,1);
        border-radius:10upx;
        margin: 202upx auto 40upx;
        font-size:32upx;
        font-family:PingFang SC;
        font-weight:500;
        line-height:88upx;
        color:rgba(255,255,255,1);
        text-align: center;
    }
    .list_box{
        .tips_box{
            margin-top: 28upx;
            font-size:24upx;
            font-family:PingFang SC;
            font-weight:400;
            line-height:34upx;
            color:#C2C2C2;
            width: 690upx;
            padding: 0 30upx;
        }
        .list_address{
            display: flex;
            align-items: center;
            // justify-content: space-between;
            width:690upx;
            // height:44upx;
            padding: 28upx 30upx;
            background:rgba(255,255,255,1);
            border-bottom: 2upx solid #F2F2F2;
            .right_icon{
                width: 36upx;
                height: 36upx;
                margin-left: auto;
            }
            .list_txt{
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(26,26,26,1);
                margin-left: 100upx;
            }
            .list_title{
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:500;
                line-height:40upx;
                color:rgba(26,26,26,1);
            }
        }
        .money_box{
            width:750upx;
            height:290upx;
            background:rgba(255,255,255,1);
            box-sizing: border-box;
            padding: 0 30upx;
            border-bottom: 2upx solid #F2F2F2;
            .tips{
                margin-top: 28upx;
                font-size:24upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:34upx;
                color:#C2C2C2;
                text:nth-child(2){
                    margin-left: 40upx;
                }
            }
            .tipsColor{
                color:rgba(245,49,78,1);
            }
            .box{
                display: flex;
                align-items: center;
                margin-top: 32upx;
                input{
                    margin-left: 12upx;
                    width:520upx;
                    height:84upx;
                    font-size:60upx;
                    font-family:PingFang SC;
                    font-weight:400;
                    line-height:84upx;
                    // color:rgba(204,204,204,1);
                }
                .money_icon{
                    width:60upx;
                    height:84upx;
                    font-size:60upx;
                    font-family:PingFang SC;
                    font-weight:800;
                    line-height:84upx;
                    color:rgba(20,20,20,1);
                }
            }
            .money_title{
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(26,26,26,1);
                margin-top: 28upx;
            }
        }
        .list{
            display: flex;
            align-items: center;
            width:750upx;
            height:88upx;
            background:rgba(255,255,255,1);
            padding: 0 30upx;
            box-sizing: border-box;
            border-bottom: 2upx solid #F2F2F2;
            .right_icon{
                margin-left: auto;
                width: 12upx;
                height: 20upx;
                image{vertical-align: top;}
            }
            .list_txt{
                margin-left: 110upx;
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:bold;
                line-height:40upx;
                color:rgba(26,26,26,1);
            }
            .list_title{
                width:120upx;
                height:42upx;
                font-size:30upx;
                font-family:PingFang SC;
                font-weight:400;
                line-height:40upx;
                color:rgba(26,26,26,1);
            }
        }
    }
</style>
