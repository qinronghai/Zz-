// "ui";
console.log("你好");
// 配置headers
var cookie =
  "PHPSESSID=dca774345dfb2b48ec5e2dd7c03d0f9c; __51cke__=; __tins__21354221=%7B%22sid%22%3A%201658126532121%2C%20%22vd%22%3A%205%2C%20%22expires%22%3A%201658128450843%7D; __51laig__=11";

let headers = {
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate",
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Proxy-Connection": "keep-alive",
  "X-Requested-With": "XMLHttpRequest",
  Host: "nzks.2009xc.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307001d)",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  Cookie: cookie,
};
let headers1 = {
  Host: "nzks.2009xc.com",
  Connection: "keep-alive",
  Accept: "application/json, text/javascript, */*; q=0.01",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307001d)",
  "X-Requested-With": "XMLHttpRequest",
  Cookie: cookie,
};


/* 可修改项 */
// 试卷编号
var exercise_id = 7;
// 暂停等待时间
// 生成随机暂停时间1-2秒之间的随机数
var sleepTime = (Math.random() * 1 + 1) * 1000;

// 循环次数
var loopNum = 4;


/* 做练习 exercise */
do_exercise(sleepTime, loopNum, exercise_id, cookie); 

function do_exercise(sleepTime, loopNum, exercise_id, cookie) {
  
  while (loopNum > 0) {
    while (exercise_id >= 1) {
    
      console.log("试卷IDDDDD"+exercise_id);
      // 1. 获取第一个token http://nzks.2009xc.com/token
      let firstUrl = "http://nzks.2009xc.com/token";
      var first = http.get(firstUrl, {
        headers: headers,
      });
      let firstToken = first.body.json().data;
      if (first.statusCode == 200) {
        log("请求第一个token成功，token为：" + firstToken);
      }

      // 2. 唤醒开始时间倒计时，接收返回的试卷id
      http://nzks.2009xc.com/mobile/qbank.exercise.execution/entry?i=1&id=6
      let paper_id;
      let secondUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/entry?i=1&id=" + exercise_id;
      let secondPost = http.request(secondUrl, {
        method: "POST",
        headers: headers,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        body: "__token__=" + firstToken,

      });
      if (secondPost.statusCode == 200) {
        // 正则表达匹配规则
        var matchReg = /paper_id=(.*)/;

        let secondToken = secondPost.body.json().token;
        var paperId = secondPost.body.json().data.url.match(matchReg)[1];

        log("请求练习id成功，paper_id=" + paperId);
        log("第二个token：" + secondToken);
        // log(secondPost.body.json().data);
      } else {
        log("请求失败！！！");
      }

      // 3.获取试卷题目
      let threeUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/get?i=1&paper_id=" + paperId;
      var threeGet = http.get(threeUrl, {
        headers: headers1,
      });
      var questionsList = threeGet.body.json().data.questions;
      // log(questionsList);
      var total = threeGet.body.json().data.total;
      // 试题id
      exercise_id = threeGet.body.json().data.paper.exercise_id;
      log("----试题ID为----" + exercise_id);
      log("----试题总数为----" + total); // 习题总数

      // 4.获取第一题的token
      let fourUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution?i=1&paper_id=" + paperId;
      var fourGet = http.get(fourUrl, {
        headers: {
          Host: "nzks.2009xc.com",
          Connection: "keep-alive",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "User-Agent":
            " Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307001d)",
          // "X-Requested-With": "XMLHttpRequest",
          "Upgrade-Insecure-Requests": 1,
          Cookie: cookie,
        },
      });

      var fourMatchReg = /token: '(\S*)'/;
      var first_question_token = fourGet.body.string().match(fourMatchReg)[1];
      log("试卷第一题的token：" + first_question_token);

      // 5. 开始答题 http://nzks.2009xc.com/mobile/qbank.exercise.execution/update?i=1
      var submitAnswerUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/update?i=1";
      var count = 0;
      var new_arr = [];
      for (let i = 0; i < total; i++) {
        // 取题id
        var id = questionsList[i].id;
        // log(id);
        // 取答案
        var correct_answer = questionsList[i].correct_answer;
        // 遍历覆盖
        correct_answer.forEach((item, index, array) => {
          // 根据正确答案覆盖语句
          if (item == 1) {
            array[index] = "&answer%5B%5D=1";
          } else {
            array[index] = "&answer%5B%5D=0";
          }
        });
        // 当前数组存储的是每一题的正确答案
        // console.log(correct_answer);

        // 拟定body提交的参数字符串
        var answer = "";
        correct_answer.forEach((item) => {
          answer = answer + item;
        });
        // console.log(answer);

        // 开始循环答题
        if (i == 0) {
          // 随机时间
          sleepTime = (Math.random() * 1 + 1) * 1000;

          let submitPost = http.request(submitAnswerUrl, {
            method: "POST",
            headers: headers1,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            body: "paper_id=" + paperId + "&id=" + id + answer + "&__token__=" + first_question_token,
          });
          let res = submitPost.body.json();
          if (res.code === 0 && res.msg == "操作成功！") {
            log("第" + (i + 1) + "题答题成功，下一题token：" + res.token);
          }
          // 下一题token
          var nextToken = res.token;
          // 暂停5秒
          sleep(sleepTime);
        } else {
          let submitPost = http.request(submitAnswerUrl, {
            method: "POST",
            headers: headers1,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            body: "paper_id=" + paperId + "&id=" + id + answer + "&__token__=" + nextToken,
          });

          let res = submitPost.body.json();
          if (res.code === 0 && res.msg == "操作成功！") {
            log("第" + (i + 1) + "题答题成功，下一题token：" + res.token);
          }
          // 下一题token
          nextToken = res.token;
          // 暂停5秒
          sleep(sleepTime);
          // 拿最后一题token
          if (i + 1 == total) {
            var lastToken = nextToken;
            console.log("最后一题token：" + lastToken);
          }
        }
      }

      /* 6. 交卷 */
      // 答完题之后 等待2秒交卷
      sleep(2000);
      let finishUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/submit?i=1";
      let finishPost = http.request(finishUrl, {
        method: "POST",
        headers: headers1,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        body: "paper_id=" + paperId + "&__token__=" + lastToken,
      });

      let res = finishPost.body.json();
      console.log(res);

      /* 7. 下一套试卷 */
      exercise_id--;

      // 等待10秒开始下一套练习
      sleep(2000);
    }
    /* 8. 下一次循环 */
    loopNum--;
    exercise_id = 7;
    console.log("第" + loopNum + "循环");
  }
}






// 做对应试卷的函数
function do_exercise(sleepTime, loopNum, exercise_id, cookie) {
  var count = loopNum;
  log("-------------开始答题--------------");
  while (loopNum > 0) {
    console.log("正在执行第" + (count - loopNum + 1) + "次答题...");

    // 1. 获取第一个token http://nzks.2009xc.com/token
    let firstUrl = "http://nzks.2009xc.com/token";
    var first = http.get(firstUrl, {
      headers: headers.A,
    });
    let firstToken = first.body.json().data;
    if (first.statusCode == 200) {
      log("请求第一个token成功，token为：" + firstToken);
    }

    // 2. 唤醒开始时间倒计时，接收返回的试卷id  http://nzks.2009xc.com/mobile/qbank.exercise.execution/entry?i=1&id=6
    let paper_id;
    let secondUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/entry?i=1&id=" + exercise_id;
    let secondPost = http.request(secondUrl, {
      method: "POST",
      headers: headers.A,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      body: "__token__=" + firstToken,
    });
    if (secondPost.statusCode == 200) {
      // 正则表达匹配规则
      var matchReg = /paper_id=(.*)/;

      let secondToken = secondPost.body.json().token;
      var paperId = secondPost.body.json().data.url.match(matchReg)[1];

      log("请求练习id成功，paper_id=" + paperId);
      // log("第二个token：" + secondToken);
      // log(secondPost.body.json().data);
    } else {
      log("请求失败！！！");
    }
    // 3.获取试卷题目
    let threeUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/get?i=1&paper_id=" + paperId;
    var threeGet = http.get(threeUrl, {
      headers: headers.B,
    });
    var questionsList = threeGet.body.json().data.questions;

    var total = threeGet.body.json().data.total;
    // 试题id
    exercise_id = threeGet.body.json().data.paper.exercise_id;
    log("----试题ID为----" + exercise_id);
    log("----试题总数为----" + total); // 习题总数

    // 4.获取第一题的token
    let fourUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution?i=1&paper_id=" + paperId;
    var fourGet = http.get(fourUrl, {
      headers: {
        Host: "nzks.2009xc.com",
        Connection: "keep-alive",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent":
          " Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307001d)",
        // "X-Requested-With": "XMLHttpRequest",
        "Upgrade-Insecure-Requests": 1,
        Cookie: cookie,
      },
    });

    var fourMatchReg = /token: '(\S*)'/;
    var first_question_token = fourGet.body.string().match(fourMatchReg)[1];
    // log("试卷第一题的token：" + first_question_token);

    // 5. 开始答题 http://nzks.2009xc.com/mobile/qbank.exercise.execution/update?i=1
    var submitAnswerUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/update?i=1";

    for (let i = 0; i < total; i++) {
      // 取题id
      var id = questionsList[i].id;
      // log(id);
      // 取答案
      var correct_answer = questionsList[i].correct_answer;
      // 遍历覆盖
      correct_answer.forEach((item, index, array) => {
        // 根据正确答案覆盖语句
        if (item == 1) {
          array[index] = "&answer%5B%5D=1";
        } else {
          array[index] = "&answer%5B%5D=0";
        }
      });
      // 当前数组存储的是每一题的正确答案
      // console.log(correct_answer);

      // 拟定body提交的参数字符串
      var answer = "";
      correct_answer.forEach((item) => {
        answer = answer + item;
      });
      // console.log(answer);

      // 开始循环答题
      if (i == 0) {
        // 每一题的答题延迟都不一样
        // sleepTime = (Math.random() * 1 + 1) * 1000;
        sleepTime = getRandomAnsTm(sleepTime, 1000);

        log(sleepTime);
        let submitPost = http.request(submitAnswerUrl, {
          method: "POST",
          headers: headers.B,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          body: "paper_id=" + paperId + "&id=" + id + answer + "&__token__=" + first_question_token,
        });
        let res = submitPost.body.json();
        if (res.code === 0 && res.msg == "操作成功！") {
          log("第" + (i + 1) + "题答题成功");
        }
        // 下一题token
        var nextToken = res.token;
        // 暂停延迟
        sleep(sleepTime);
      } else {
        sleepTime = getRandomAnsTm(sleepTime, 1000);
        log(sleepTime);
        let submitPost = http.request(submitAnswerUrl, {
          method: "POST",
          headers: headers.B,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          body: "paper_id=" + paperId + "&id=" + id + answer + "&__token__=" + nextToken,
        });

        let res = submitPost.body.json();
        if (res.code === 0 && res.msg == "操作成功！") {
          log("第" + (i + 1) + "题答题成功");
          // log("第" + (i + 1) + "题答题成功，下一题token：" + res.token);
        }
        // 下一题token
        nextToken = res.token;
        // 暂停延迟
        sleep(sleepTime);
        // 拿最后一题token
        if (i + 1 == total) {
          var lastToken = nextToken;
          // console.log("最后一题token：" + lastToken);
        }
      }
    }

    /* 6. 交卷 */
    // 答完题之后 等待2秒交卷
    sleep(2000);
    let finishUrl = "http://nzks.2009xc.com/mobile/qbank.exercise.execution/submit?i=1";
    let finishPost = http.request(finishUrl, {
      method: "POST",
      headers: headers.B,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      body: "paper_id=" + paperId + "&__token__=" + lastToken,
    });

    let res = finishPost.body.json();
    if (res.code == 0) {
      console.log(res.msg + "\n");
      getUserInfo(cookie);
      ui.answeredNum.setText("已答卷次数：" + (count - loopNum + 1) + "/" + count);
    }
    // 等待10秒开始下一套练习
    sleep(2000);

    /* 8. 下一次循环 */
    loopNum--;
  }
}