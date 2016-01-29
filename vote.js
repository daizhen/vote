var http = require("http");
var url = require('url');
var fs = require("fs");
var proxyUrl = null;
    //"web-proxy.usa.hp.com";
var proxyPort = 8080;

function LoadProxyList()
{
    var proxy_list = [];
    var data = fs.readFileSync("proxy_list.txt");
    var dataString = data.toString("utf8");
    var lineItems = dataString.split('\n');
    var reg_ip = /(\d+\.\d+\.\d+)\:(\d+)/;
   // console.log(lineItems.length);
//    console.log(lineItems[1]);
    
    for(var i=0;i<lineItems.length;i++)
    {
        var current_item = lineItems[i];
        if(reg_ip.test(current_item))
        {
            var match_result = reg_ip.exec(current_item);
            //console.log(match_result[1]+":"+match_result[2]);
            proxy_list.push({"host":match_result[1],"port":match_result[2]});
        }
    }
    
    return proxy_list;
}

var opt = 
{  
        method: "POST",  
        host: "web-proxy.usa.hp.com",
		port:8080,
        path: "http://ud.cq.qq.com/api/activity/13455/vote/image/451098/jsonp",  
        headers: {  
            "Content-Type": 'application/javascript;charset=UTF-8', 
			"Accept-Encoding": 'gzip,deflate',
			"User-Agent": "Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; M032 Build/IML74K) UC AppleWebKit/534.31 (KHTML, like Gecko) Mobile Safari/534.31",
			"Proxy-Connection": "Keep-Alive",
			"Content-Length": 0,
			Origin:"http://ud.cq.qq.com/",
			DNT:1,
			Host:"ud.cq.qq.com"
		}  
    };  
var proxy_index = 0;
function vote(proxy,url)
{
	//proxy_index = proxy_index % (proxy_list.length-1);
	//opt.host = proxy_list[proxy_index];
    //opt.path = "http://ud.cq.qq.com/api/activity/13455/vote/image/451098/jsonp";
    opt.host = proxy.host;
    opt.port = proxy.port;
    opt.path = url;
	//console.log(opt.host);
	
	//req.write("");
	try
	{
		var req = http.request(opt,function(response)
		{  
            var body = ""; 
		    response.on('data', function (data) { body += data; })  
					.on('end', function () { console.log(body);})
                    .on('error', function(){console.error("Error to connect to ...")});
		});
        req.on("error",function(err){console.error(err)});
		req.end();
	}
	catch(ex)
	{
		console.error("Exception:"+ex);
	}
}
function Process()
{
    var  proxy_list = LoadProxyList();
    try
    {
        proxy_index = proxy_index % (proxy_list.length-1);
        
        console.log(proxy_index+"-----"+proxy_list[proxy_index].host+":"+proxy_list[proxy_index].port);
        vote(proxy_list[proxy_index],"http://ud.cq.qq.com/api/activity/13455/vote/image/451098/jsonp");
        vote(proxy_list[proxy_index],"http://ud.cq.qq.com/api/activity/13451/vote/image/451092/jsonp");
    }
    catch(ex)
    {
           console.error(ex);
        //nothng to do.
    }
    proxy_index++;
}
setInterval(Process,400);