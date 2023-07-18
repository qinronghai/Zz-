var cookie =
  "PHPSESSID=76596d8dbcdbe818920990cac2284c4a; __51cke__=; __51laig__=2; __tins__21354221=%7B%22sid%22%3A%201689054253955%2C%20%22vd%22%3A%202%2C%20%22expires%22%3A%201689056074599%7D";

var A = {
  Host: "ksxt.nnch.net",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Cookie: cookie,
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate",
  "Proxy-Connection": "keep-alive",
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.39(0x1800272c) NetType/WIFI Language/zh_CN",
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
