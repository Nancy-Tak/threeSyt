//百度地图坐标获取的API根据网站请求头切换
var httpOrS = 'https:' == document.location.protocol ? true: false;
var head = document.getElementsByTagName('head')[0];
var scriptHttp = scriptHttps = document.createElement('script');
scriptHttp.type = scriptHttps.type = 'text/javascript';
scriptHttps.src = 'https://api.map.baidu.com/api?v=2.0&ak=MtoHfKTGzxoZlYeCACbOwmDipRIV5hcf';
scriptHttp.src = 'http://api.map.baidu.com/api?v=2.0&ak=MtoHfKTGzxoZlYeCACbOwmDipRIV5hcf';

if(httpOrS){
    head.appendChild(scriptHttps);
}else{
    head.appendChild(scriptHttp);
}
