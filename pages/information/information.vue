<template>
	<view class="container">
		<view class="information">
			<hx-navbar title="入驻信息认证" :back="true" :fixed="true" color="#ffffff" transparent="show" backgroundColorLinearDeg="55"
			 :background-color="[[245,49,78],[238,71,102]]">
			</hx-navbar>
			<view class="list_box">
				<view class="list">
					<view class="list_left">
						姓名
					</view>
					<input type="text" v-model.trim="name" placeholder="请输入姓名" />
				</view>
				<view class="list">
					<view class="list_left">
						身份证号
					</view>
					<input type="idcard" v-model="idCard" placeholder="身份证号" />
					<view class="right_icon">
						<image src="../../static/she_icon.png" mode=""></image>
						<view ref="input" class="input" v-model="file" id="fileUpdate"></view>
					</view>
				</view>
				<view class="list">
					<view class="list_left">
						银行卡号
					</view>
					<input type="number" @input='onKeyInput' v-model="cardNum" placeholder="请输入银行卡号" />
					<view class="right_icon">
						<image src="../../static/she_icon.png" mode=""></image>
						<view ref="input1" class="input" v-model="file" id="fileUpdate"></view>
					</view>
				</view>
				<view class="list">
					<view class="list_left">
						银行卡名称
					</view>
					<picker @change="pickerChange($event,'industry')" :value="data.industry" :range="industryList" range-key="value">
						<view class="uni-input">{{industryList[data.industry].value}}</view>
					</picker>
					<!-- <input type="text" v-model.trim="bank_name" placeholder="请输入银行卡名称" /> -->
				</view>
				<view class="list">
					<view class="list_left">
						本人预留手机号
					</view>
					<input type="number" v-model="phone" placeholder="请输入银行预留手机号" />
				</view>
				<view class="list">
					<view class="list_left">
						支付宝账号
					</view>
					<input type="text" v-model.trim="zfbNum" placeholder="请输入支付宝账号" />
				</view>
			</view>
			<view class="tips">
				身份证信息认证后不可更改， 请认证填写
			</view>
			<view class="btn" @tap="authidcard()">
				提交
			</view>
		</view>

	</view>
</template>

<script>
	import BIN from '@/common/bankCardAttribution.js';
	export default {
		data() {
			return {
				name: "",
				idCard: "",
				cardNum: "",
				phone: "",
				zfbNum: "",
				user_id: "",
				file: '',
				bank_name: "", //银行卡名称
				bank_code:"", //银行卡编号
				data: {
					industry: 0
				},
				industryList: [
					{name:'0',value:'中国银行'}
				],
			};
		},
		mounted() {
			var that = this;
			var input = document.createElement('input');
			var input1 = document.createElement('input');
			input.type = 'file';
			input1.type = 'file';
			// 身份证号
			input.onchange = event => {
				this.file = event;
				var file = this.file.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					var data = e.target.result;
					that.imgbase = data;
					let d = {
						type: "zm",
						baseImg: that.imgbase
					};
					// console.log(JSON.stringify(d));
					that.$http.httpRequest({
						url: that.$baseUrl.uploadCard.url,
						method: that.$baseUrl.uploadCard.method,
						data: {
							baseImg: data,
							type: "zm"
						}
					}).then(res => {
						console.log(res);
						let data = res[1].data;
						console.log(data);
						if (data.code == 200) {
							that.idCard = data.data.idcard;
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					}, err => {})
				};
			};
			// 银行卡号
			input1.onchange = event => {
				this.file = event;
				var file = this.file.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					var data = e.target.result;
					that.$http.httpRequest({
						url: that.$baseUrl.uploadbankcardimg.url,
						method: that.$baseUrl.uploadbankcardimg.method,
						data: {
							baseImg: data
						}
					}).then(res => {
						let data = res[1].data;
						if (data.code == 200) {
							that.cardNum = data.data.bank_card;
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					}, err => {})
				};
			};
			this.$refs.input.$el.appendChild(input);
			this.$refs.input1.$el.appendChild(input1);
		},
		onLoad(option) {
			this.user_id = option.user_id;
			this.getBank_code()
		},
		methods: {
			pickerChange: function(e,val) {
				
				this.data[val]=e.target.value
				console.log(this.industryList[e.target.value].name)
				this.bank_code = this.industryList[e.target.value].name
			},
			 // 获取银行卡列表
			getBank_code(){
				this.$http.httpRequest({
					url: this.$baseUrl.bank_code.url,
					method: this.$baseUrl.bank_code.method,
					data: {
					}
				}).then(res => {
					console.log(res[1].data.data)
					this.industryList = res[1].data.data
				}) 
			},
			onKeyInput: function(event) {
				this.cardNum = event.target.value;
				if (/^([1-9]{1})(\d{15}|\d{18})$/.test(this.cardNum)) {
					let info = BIN.bankCardAttribution(this.cardNum);
					if (info) {
						this.bank_name = info.bankName;
					}
				}
			},
			authidcard() {
				let that = this;
				let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号
				let regex = /^([1-9]{1})(\d{15}|\d{18})$/; //银行卡号
				if (!that.name) {
					that.tipsShow('请填写姓名');
					return false;
				} else if (!that.idCard) {
					that.tipsShow('请填写身份证号');
					return false;
				} else if (!reg.test(that.idCard)) {
					that.tipsShow('身份证号不合法');
					return false
				} else if (!that.cardNum) {
					that.tipsShow('请输入银行卡号');
					return false
				} else if (!regex.test(that.cardNum)) {
					that.tipsShow('银行卡号不正确');
					return false
				} else if (!that.bank_code) {
					that.tipsShow('请选择银行卡名称');
					return false;
				} else if (!that.phone) {
					that.tipsShow('请填写手机号码');
					return false;
				} else if (!(/^1[3456789]\d{9}$/.test(that.phone))) {
					that.tipsShow('请输入正确的手机号码');
					return false;
				} else if (!that.zfbNum) {
					that.tipsShow('请输入支付宝账号');
					return false;
				}
				that.$http.httpRequest({
					url: that.$baseUrl.authidcard.url,
					method: that.$baseUrl.authidcard.method,
					data: {
						nickname: that.name,
						id_card: that.idCard,
						bank_card: that.cardNum,
						pre_mobile: that.phone,
						zfb_num: that.zfbNum,
						user_id: that.user_id,
						bank_code: that.bank_code
					}
				}).then(res => {
					console.log(res);
					let data = res[1].data;
					if (data.code == 200) {
						uni.navigateTo({
							url: `/pages/choice/choice?user_id=${that.user_id}`
						})
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						})
					}
				}, err => {
					console.log(err);
				})
			},
			tipsShow(tips) {
				uni.showToast({
					title: tips,
					icon: 'none'
				})
			},
			choice() {
				uni.navigateTo({
					url: `/pages/choice/choice`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}

	.input {
		opacity: 0;
		width: 36upx;
		height: 36upx;
		position: absolute;
		top: 50%;
		border-radius: 50%;
		transform: translateY(-50%);
		z-index: 10;
		right: 30upx;
		overflow: hidden;
	}

	.btn {
		width: 690upx;
		height: 88upx;
		background: linear-gradient(43deg, rgba(245, 49, 78, 1) 0%, rgba(238, 71, 102, 1) 100%);
		box-shadow: 0upx -4upx 0upx rgba(245, 245, 245, 1);
		border-radius: 10upx;
		margin: 200upx auto 20upx;
		text-align: center;
		line-height: 88upx;
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.tips {
		margin: 20upx 0 0 30upx;
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 40upx;
		color: rgba(245, 49, 78, 1);
	}

	.list_box {
		background-color: #FFFFFF;

		.list {
			display: flex;
			align-items: center;
			// justify-content: space-between;
			box-sizing: border-box;
			padding: 0 30upx;
			width: 750upx;
			height: 88upx;
			background: rgba(255, 255, 255, 1);
			border-bottom: 2upx solid #f5f5f5;
			position: relative;

			.right_icon {
				width: 36upx;
				height: 36upx;
				margin-left: auto;
			}

			.list_right {
				display: flex;
				align-items: center;

				.right_icon {
					margin-left: 16upx;
					width: 16upx;
					height: 20upx;

					image {
						vertical-align: top;
					}
				}

				.right_txt {
					font-size: 30upx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 40upx;
					color: rgba(51, 51, 51, 1);
					opacity: 0.78;
				}
			}

			input {
				width: 350upx;
				height: 42upx;
				font-size: 30upx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 42upx;
				color: #1A1A1A;
				// text-align: right;
				margin-left: 70upx;
			}

			.list_left {
				width: 210upx;
				font-size: 30upx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 40upx;
				color: rgba(26, 26, 26, 1);
			}
		}
	}
	.uni-input{
		width: 386rpx;
		height: 46rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 46rpx;
		color: #1A1A1A;
		margin-left: 76rpx;
	}
</style>
