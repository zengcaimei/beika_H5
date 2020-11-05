const url = {
    sendcode:{
        url:'/api/User/sendcode',
        method:"POST"
    },
    checklogin:{
        url:'/api/User/checklogin',
        method:'POST'
    },
    authidcard:{
        url:'/api/User/authidcard',
        method:'POST'
    },
    getbankbytype:{
        url:'/api/bank/getbankbytype',
        method:'POST'
    },
    // 识别身份证号
    uploadCard:{
        url:'/api/User/uploadCard',
        method:'POST'
    },
    // 银行卡号
    uploadbankcardimg:{
        url:'/api/User/uploadbankcardimg',
        method:'POST'
    },
    // 通道列表
    getprodlist:{
        url:'/api/channel/getprodlist',
        method:'POST'
    },
    // 选择通道下一步
    checkchannelisallbank:{
        url:'/api/channel/checkchannelisallbank',
        method:'POST'
    },
    // 添加信用卡
    userbindcard:{
        url:'/api/user/userbindcard',
        method:'POST'
    },
    // 请求支付
    paystep:{
        url:'/api/microshop/paystep',
        method:'POST'
    },
    // 我的储蓄卡
    getmybank:{
        url:'/api/bank/getmybank',
        method:'POST'
    },
    // 地址定位
    getcityLlocation:{
        url:'/api/api/getcityLlocation',
        method:'POST'
    },
    // 计算手续费
   rateCount:{
        url:'/api/channel/rateCount',
        method:'POST'
    },
	// 获取银行列表
	bank_code:{
	     url:'/apiagent/Branch/bank_code',
	     method:'GET'
	 },
}

export default{
    ...url
}  