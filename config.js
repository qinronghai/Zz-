var cookie =
  "PHPSESSID=cd70b21459a02bf2524bbb8e741eb7b1; __51cke__=; __tins__21354221=%7B%22sid%22%3A%201658192877590%2C%20%22vd%22%3A%203%2C%20%22expires%22%3A%201658194681098%7D; __51laig__=8";

var headers_0 = {
  Host: "nzks.2009xc.com",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Cookie: cookie,
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate",
  "Proxy-Connection": "keep-alive",
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307001d)",
};

var headers_1 = {
  Host: headers_0.Host,
  Connection: "keep-alive",
  Accept: headers_0.Accept,
  Cookie: cookie,
  "User-Agent": headers_0["User-Agent"],
  "X-Requested-With": headers_0["X-Requested-With"],
};

// 用于请求网页HTML
let headers_2 = {
  Host: headers_0.Host,
  Connection: "keep-alive",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  Cookie: cookie,
  "X-Requested-With": headers_0["X-Requested-With"],
  "User-Agent": headers_0["User-Agent"],
  "Accept-Language": headers_0["Accept-Language"],
  "Accept-Encoding": headers_0["Accept-Encoding"],
  "Upgrade-Insecure-Requests": 1,
};
let headers = {
  headers_0,
  headers_1,
  headers_2,
};
module.exports = headers;
