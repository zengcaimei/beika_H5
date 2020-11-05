function getcode(redirect_uri){
	let url = window.location.href;
	let wxurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx90707dd98bf8c20e"+"&response_type=code&scope=snsapi_base"+"&redirect_uri=http://cw.bsstt.com/h5/&state=123#wechat_redirect";
	window.location.href = wxurl;
}
 
 
function getUrlParam(name) {
	var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
	var params = window.location.search.substr(1).replace("__", "&");
	var r = params.match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
 
export default{
	getcode:function(){
		return getcode()
	},
	getUrlParam:function(name){
		return getUrlParam(name)
	}
}