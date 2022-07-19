var cookie =
  "PHPSESSID=cd70b21459a02bf2524bbb8e741eb7b1; __51cke__=; __tins__21354221=%7B%22sid%22%3A%201658202175397%2C%20%22vd%22%3A%201%2C%20%22expires%22%3A%201658203975397%7D; __51laig__=10";

var A = {
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

var B = {
  Host: A.Host,
  Connection: "keep-alive",
  Accept: A.Accept,
  Cookie: cookie,
  "User-Agent": A["User-Agent"],
  "X-Requested-With": A["X-Requested-With"],
};

// 用于请求网页HTML
let C = {
  Host: A.Host,
  Connection: "keep-alive",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  Cookie: cookie,
  "X-Requested-With": A["X-Requested-With"],
  "User-Agent": A["User-Agent"],
  "Accept-Language": A["Accept-Language"],
  "Accept-Encoding": A["Accept-Encoding"],
  "Upgrade-Insecure-Requests": 1,
};
let headers = {
  A,
  B,
  C,
};

module.exports = headers;
