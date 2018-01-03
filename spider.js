const https = require('https');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const xls = require('node-xlsx');
const fs = require('fs');
var xlsArr = [
	{
		name: 'aaa',
		data: []
	}
]
var count = 0;
var iNow = 1;
var options = {
	hostname: 'bj.zu.anjuke.com',
	port: 443,
	method: 'GET',
	path: '/fangyuan/p1/',
	headers: {
		'cache-control': 'max-age=0',
		'expires': 0,
		'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36',
	}
}
var bb = spiderPage(options);
function spiderPage(options){
	var req = https.request(options, function(res){
		var content = '';
		res.setEncoding('utf-8');
		res.on('data', function(chunk){
			content += chunk;
		});
		
		res.on('end', function(){
			var $ = cheerio.load(content);
			$('.zu-itemmod').each(function(index, item){
				var data = [$(item).children('.img').attr('title'),
						$(item).find('.details-item a').text(),
						$(item).find('.zu-info .cls-1').text(),
						$(item).find('.zu-side strong').text()]
				xlsArr[0].data.push(data);
				count++;
			});
			while(res.statusCode == 200){
				iNow++
				var iPath = options.path.replace(/\d+/g, iNow);
				options.path = iPath;
				console.log('火速收集数据中，请稍后。。。');
				return spiderPage(options);
			}
			fs.writeFileSync('./aa.xslx', xls.build(xlsArr), 'binary');
		});
	});

	req.end();

}

