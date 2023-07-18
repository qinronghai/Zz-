" ui";
// "ui";
("ui");

/* *
-可配置选项
*/
// 试卷编号
var exercise_id = 12;
// 答题延时时间：生成随机暂停时间1-2秒之间的随机数(保留两位小数)
var timme = 1500;
var sleepTime = ((Math.random() * 1 + 1) * timme).toFixed(2);
// 循环执行次数
var loopNum = 10;
// 用户姓名
var name = "";
// 用户当前积分   "(?<=(您的积分.*\n\s*(<span class=\"info-value\">)))([0-9]{0,})"gm
var currentIntegral = 0;
// 练习试卷列表
var dataList = "请选择练习的试卷|练习| 最终考试";
// 副本-练习试卷列表
var dataList_copy = ["请选择练习的试卷", 12, 4];
var dataList_copy_2 = ["请选择练习的试卷", "练习", "最终考试"];
// 已答卷次数
var answeredNum = 0;

// 在config.js文件重已经配置
var headers = require("config.js");

// 没有的题
var noProblem = 0;

// UI布局
ui.layout(
  <vertical h="auto">
    <appbar>
      <toolbar
        id="toolbar"
        title="得分小助手2"
      />
    </appbar>
    <viewpager margin="30">
      <vertical id="parent">
        <vertical>
          <text
            id="name"
            text="姓名：{{name}}"
            textSize="16sp"
            h="25dp"
            textColor="blue"
          />
          <text
            id="integral"
            text="当前积分：{{currentIntegral}}"
            textSize="16sp"
            h="25dp"
            textColor="red"
          />
          <text
            text="Cookie"
            textColor="black"
            textStyle="bold"
            h="30dp"
            textSize="18sp"
          />
          <input
            maxHeight="300"
            id="Cookie"
            text=""
            textSize="18sp"
          />
        </vertical>
        <spinner
          id="spinner"
          entries="{{dataList}}"
          textColor="red"
        />

        <horizontal>
          <text
            text="请输入答题延时"
            inputType="number"
            textColor="black"
            paddingLeft="8dp"
            textSize="14sp"
          >
            请输入答题延时
          </text>
          <input
            id="delay"
            w="100dp"
            gravity="center_horizontal"
            text="{{sleepTime}}"
          />
        </horizontal>
        <horizontal>
          <text
            inputType="number"
            textColor="black"
            paddingLeft="8dp"
            textSize="14sp"
          >
            （执行 | 轮询）次数
          </text>
          <input
            id="loop"
            text="{{loopNum}}"
            w="90dp"
            gravity="center_horizontal"
          />
        </horizontal>
        <horizontal>
          <vertical>
            <button
              w="80"
              h="40"
              id="start_btn"
              marginTop="18dp"
              bg="#27c671"
            >
              开始答题
            </button>
            <button
              w="80"
              h="40"
              id="exam_btn"
              marginTop="18dp"
              bg="#f38b00"
            >
              开始考试
            </button>
          </vertical>
          <vertical>
            <button
              id="paqu"
              w="80"
              h="40"
              marginTop="18dp"
              bg="#6574eb"
            >
              爬取题目
            </button>
            <button
              id="stop"
              w="80"
              h="40"
              marginTop="18dp"
              bg="#e83434"
            >
              停止
            </button>
          </vertical>
          <vertical
            h="98"
            marginTop="18dp"
            marginLeft="60"
          >
            <button
              id="confirmUser"
              w="*"
              h="40"
              bg="#00acf6"
            >
              获取用户信息
            </button>
            <text
              id="answeredNum"
              text="已答卷次数：{{ answeredNum }}"
              gravity="center_vertical"
              textSize="14sp"
              h="58"
              textColor="black"
            ></text>
          </vertical>
        </horizontal>

        <vertical h="auto">
          <text
            text="日志"
            gravity="center_vertical"
            textStyle="bold"
            textSize="16sp"
            textColor="black"
          />
          <com.stardust.autojs.core.console.ConsoleView
            marginTop="5"
            id="console"
            h="auto"
          />
        </vertical>
      </vertical>
    </viewpager>
  </vertical>
);

main();

// 主函数
function main() {
  var cookie;
  // 两个线程

  // 设置控制台
  ui.console.setConsole(runtime.console);
  // 设置控制台字体颜色
  let c = new android.util.SparseArray();
  let Log = android.util.Log;
  c.put(Log.DEBUG, new java.lang.Integer(colors.parseColor("#363537")));
  ui.console.setColors(c);

  // 监听下拉列表
  var isFirst = true;
  /* var myAdapterListener = new android.widget.AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
      if (isFirst) {
        isFirst = false;
      } else {
        log("选择的试卷是: " + dataList_copy_2[id]);
        // 设置试卷id
        exercise_id = dataList_copy[id];
      }
    },
  }); */
  // 监听事件
  // ui.spinner.setOnItemSelectedListener(myAdapterListener);

  // 开始答题按钮
  ui.start_btn.on("click", () => {
    // 设置cookie
    cookie = ui.Cookie.getText();

    // 如未填写cookie，则发出警告
    if (cookie == "") {
      log("请输入cookie之后再开始答题");
      alert("请输入cookie之后再开始答题");
      return;
    }
    // 配置cookie
    headers.A.cookie = cookie;
    headers.B.cookie = cookie;
    log("该用户的cookie是" + cookie + "\n");

    // 设置答题延时
    log("答题延时是" + ui.delay.getText());
    sleepTime = ui.delay.getText();
    // 设置答题次数
    log("执行次数是" + ui.loop.getText());
    loopNum = ui.loop.getText();

    //在新线程执行的代码
    Thread = threads.start(function () {
      // 获取用户信息
      let userInfo = getUserInfo(cookie);
      log("用户的名字为：" + userInfo.name);
      log("当前积分为：" + userInfo.currentIntegral);

      // 答题前积分
      let forwardIntegral = userInfo.currentIntegral;

      if (exercise_id == 8) {
        // 轮询7套试卷循环
        ui.answeredNum.setText("已答卷次数：0");

        loop_do_exercise(sleepTime, loopNum, exercise_id, cookie);
      } else {
        // 做相应的试卷
        do_match_exercise(sleepTime, loopNum, exercise_id, cookie);
      }
      // 答题后积分
      let afterIntegral = currentIntegral;
      let diff = afterIntegral - forwardIntegral;

      alert("执行任务完成！本次获得" + diff + "积分");
    });
  });

  // 停止答题按钮
  ui.stop.on("click", () => {
    Thread.interrupt();
    log("已停止答题...");
    alert("已停止答题...");
  });

  // 开始考试按钮
  ui.exam_btn.on("click", () => {
    // 考试的逻辑
    // 设置cookie
    cookie = ui.Cookie.getText();

    // 如未填写cookie，则发出警告
    if (cookie == "") {
      log("请输入cookie之后再开始答题");
      alert("请输入cookie之后再开始答题");
      return;
    }
    // 配置cookie
    headers.A.cookie = cookie;
    headers.B.cookie = cookie;
    log("该用户的cookie是" + cookie + "\n");

    // 设置答题延时
    log("答题延时是" + ui.delay.getText());
    sleepTime = ui.delay.getText();
    toast("开始考试");
    //在新线程执行的代码
    Thread = threads.start(function () {
      // 获取用户信息
      let userInfo = getUserInfo(cookie);
      if (userInfo && userInfo.name) {
        log("用户的名字为：" + userInfo.name);
        log("当前积分为：" + userInfo.currentIntegral);

        doExam(sleepTime, 5, cookie, "exam");
        alert("考试完成！");
      } else {
        log("无法考试，用户信息获取失败");
      }
    });
  });

  // 获取用户信息
  ui.confirmUser.on("click", () => {
    // 设置cookie
    cookie = ui.Cookie.getText();

    // 如未填写cookie，则发出警告
    if (cookie == "") {
      log("请输入cookie之后再开始答题");
      alert("请输入cookie之后再开始答题");
      return;
    }
    // 配置cookie
    headers.A.cookie = cookie;
    headers.B.cookie = cookie;
    log("该用户的cookie是" + cookie + "\n");

    //在新线程执行的代码
    Thread = threads.start(function () {
      // 获取用户信息
      let userInfo = getUserInfo(cookie);
      if (userInfo && userInfo.name) {
        log("用户的名字为：" + userInfo.name);
        log("当前积分为：" + userInfo.currentIntegral);

        // 继续执行后续逻辑
        // ...
      } else {
        log("未能获取到用户信息");
      }
    });
    Thread.join();
    Thread.interrupt();
    log("执行获取用户信息任务完成！");
  });

  // 爬取考试题目
  ui.paqu.on("click", () => {
    // 获取cookie
    let cookies = ui.Cookie.getText();
    if (cookies == "") {
      log("请输入cookie之后再开始爬取答题");
      alert("请输入cookie之后再开始爬取答题");
      return;
    }
    // 配置cookie
    headers.A.cookie = cookie;
    headers.B.cookie = cookie;
    log("该用户的cookie是" + cookie + "\n");

    //在新线程执行的代码
    Thread = threads.start(function () {
      // 获取用户信息
      let userInfo = getUserInfo(cookie);
      if (userInfo && userInfo.name) {
        log("用户的名字为：" + userInfo.name);
        log("当前积分为：" + userInfo.currentIntegral);

        console.log("开始爬取题库");
        // 3.获取试卷题目
        let threeUrl = "http://ksxt.nnch.net/mobile/qbank.question.mistake/getList?i=1&category=31&limit=12";
        var threeGet = http.get(threeUrl, {
          headers: headers.B,
        });
        var questionsList = threeGet.body.json().data;
        // 创建子线程
        var thread = threads.start(function () {
          // 在子线程中执行耗时操作

          var tiku = getTiKu();
          crawlKaoShiQuestions(questionsList, tiku);
        });

        thread.join();

        // ...
      } else {
        log("未能获取到用户信息");
      }
    });
    Thread.join();
    Thread.interrupt();
    log("执行获取用户信息任务完成！");
  });
}

// 考试的完整逻辑
function doExam(sleepTime, exercise_id, cookie, type) {
  timme = 2000;
  // 1. 获取第一个token http://ksxt.nnch.net/token
  let firstUrl = "http://ksxt.nnch.net/token";
  var first = http.get(firstUrl, {
    headers: headers.A,
  });
  let firstToken = first.body.json().data;
  if (first.statusCode == 200) {
    log("请求第一个token成功，token为：" + firstToken);
  }

  // 2. 唤醒开始时间倒计时，接收返回的试卷id  http://ksxt.nnch.net/mobile/qbank.exercise.execution/entry?i=1&id=6
  let paper_id;
  let secondUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/entry?i=1&id=" + exercise_id;
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
    // var paperId = 127746;

    log("请求试卷id成功，paper_id=" + paperId);
    // log("第二个token：" + secondToken);
    // log(secondPost.body.json().data);
  } else {
    log("请求失败！！！");
  }
  // 3.获取试卷题目
  let threeUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/get?i=1&paper_id=" + paperId;
  var threeGet = http.get(threeUrl, {
    headers: headers.B,
  });
  var questionsList = threeGet.body.json().data.questions;

  // 打印考试试题
  log(threeGet.body.json().data, "本次考试试题json");

  var tiku = [];
  // -创建子线程
  var thread = threads.start(function () {
    // 在子线程中执行耗时操作

    tiku = getTiKu(); // 获取本地题库
    // 抽取考试题库中需要的字段，无答案
  });
  thread.join();

  var noAnswerData = questionsList.map(function (question) {
    return {
      id: question.id,
      content: question.content,
      correct_answer: question.answer,
      options: question.options,
    };
  });

  //-将noAnswerData中每一项的content属性去和本地题库tiku的每一项题目的content去比对
  //-比对相同的话则noAnswerData中当前项的correct_answer属性等于tiku中与之匹配的项的correct_answer
  //-不相同的项留空
  for (var i = 0; i < noAnswerData.length; i++) {
    var noAnswerQuestion = noAnswerData[i];

    for (var j = 0; j < tiku.length; j++) {
      var tikuQuestion = tiku[j];

      if (noAnswerQuestion.content === tikuQuestion.content) {
        // 匹配到相同的题目，设置correct_answer属性
        noAnswerQuestion.correct_answer = tikuQuestion.correct_answer;
        break;
      } else {
      }
    }
  }

  log(noAnswerData, "本次考试中题库");
  // 在本地题库中寻找
  crawlKaoZhongShiQuestions(noAnswerData);

  var total = threeGet.body.json().data.total;
  // 试题id
  exercise_id = threeGet.body.json().data.paper.exam_id;
  log("----试题ID为----" + exercise_id);
  log("----试题总数为----" + total); // 习题总数

  // 4.获取第一题的token
  let fourUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution?i=1&paper_id=" + paperId;
  var fourGet = http.get(fourUrl, {
    headers: {
      Host: "ksxt.nnch.net",
      Connection: "keep-alive",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.39(0x1800272c) NetType/WIFI Language/zh_CN",
      // "X-Requested-With": "XMLHttpRequest",
      "Upgrade-Insecure-Requests": 1,
      Cookie: cookie,
    },
  });

  var fourMatchReg = /token: '(\S*)'/;
  var first_question_token = fourGet.body.string().match(fourMatchReg)[1];
  // log("试卷第一题的token：" + first_question_token);

  // 5. 开始答题 http://ksxt.nnch.net/mobile/qbank.exercise.execution/update?i=1
  var submitAnswerUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/update?i=1";

  for (let i = 0; i < total; i++) {
    // 取题id
    var id = noAnswerData[i].id;
    // log(id, "题目id");
    // -取答案
    var correct_answer = noAnswerData[i].correct_answer;

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
    // console.log(correct_answer, "当前未处理的答案");

    // 拟定body提交的参数字符串
    var answer = "";
    correct_answer.forEach((item) => {
      answer = answer + item;
    });
    // console.log(answer, "处理后的这道题的答案");

    // 开始循环答题
    if (i == 0) {
      // 每一题的答题延迟都不一样
      // sleepTime = (Math.random() * 1 + 1) * 100;
      sleepTime = getRandomAnsTm(sleepTime, timme);

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
      sleepTime = getRandomAnsTm(sleepTime, timme);
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
  /*  let finishUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/submit?i=1";
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
  } */

  log("++++++++++++++考试结束，还未交卷！！！++++++++++++++++");

  // return questionsList;
}

// 获取用户信息
function getUserInfo(cookie) {
  try {
    let url = "http://ksxt.nnch.net/mobile/system.member.Index?i=1";
    var getHtml = http.get(url, {
      headers: {
        Host: "ksxt.nnch.net",
        Connection: "keep-alive",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.39(0x1800272c) NetType/WIFI Language/zh_CN",
        // "X-Requested-With": "XMLHttpRequest",
        "Upgrade-Insecure-Requests": 1,
        Cookie: cookie,
      },
    });
    // 取得html内容
    let htmlString = getHtml.body.string();
    // log("用户", htmlString);
    // 中转正则
    const REGEX_TRANSIT = /((<span class=\"info-value\">))([0-9]{0,})/gm;

    let transitVar = htmlString.match(REGEX_TRANSIT);
    log(transitVar, "2ge标签");
    if (transitVar && transitVar.length >= 2) {
      transitVar = transitVar[1];
      // 取积分-数字类型
      const REGEX_CURPOINTS = /([0-9]{0,})/gm;
      let curIntegralCharArr = transitVar.match(REGEX_CURPOINTS);

      // 中转正则
      const REGEX_NAME = /<span class="info-type">\s*\[(.*?)\]\s*<\/span>/;
      const match = htmlString.match(REGEX_NAME);

      var name;
      if (match && match.length >= 2) {
        const nameInBrackets = match[1];
        console.log(nameInBrackets); // 输出 "蒙双"
        name = nameInBrackets;
      }
      // let name = transitVar.match(REGEX_NAME)[0];

      curIntegralCharArr.forEach((item) => {
        if (item != "") {
          currentIntegral = item;
        }
      });

      ui.integral.setText("当前积分：" + currentIntegral);
      ui.name.setText("姓名：" + name);

      return { name, currentIntegral };
      // 继续处理后续逻辑
      // ...
    } else {
      log("匹配结果为空或长度不足");
      toast("匹配结果为空或长度不足");
    }
    // let transitVar = htmlString.match(REGEX_TRANSIT)[1];
  } catch (error) {
    log(error, "获取用户信息出错");
    toast("获取用户信息出错");
  }
}

// 做相应练习的的逻辑
function do_match_exercise(sleepTime, loopNum, exercise_id, cookie) {
  var count = loopNum;
  log("-------------开始答题--------------");
  while (loopNum > 0) {
    console.log("正在执行第" + (count - loopNum + 1) + "次答卷...");

    doExercise(sleepTime, exercise_id, cookie, "exercise");

    ui.answeredNum.setText("已答卷次数：" + (count - loopNum + 1) + "/" + count);
    // 等待开始下一次答卷
    sleep(2000);

    // 下一次循环
    loopNum--;
  }
  log("本次轮询获得" + noProblem + " 道新题");
}
// 轮询做试卷的函数
function loop_do_exercise(sleepTime, loopNum, exercise_id, cookie) {
  var count = loopNum;
  log("-------------开始答题--------------");
  exercise_id = 7;
  while (loopNum > 0) {
    console.log("正在执行第" + (count - loopNum + 1) + "次轮询");

    while (exercise_id >= 1) {
      doExercise(sleepTime, exercise_id, cookie);
      // 等待10秒开始下一套练习
      sleep(2000);
      exercise_id--;
    }
    ui.answeredNum.setText("已轮询次数：" + (count - loopNum + 1) + "/" + count);

    // 下一次轮询
    loopNum--;
    // 重置试卷id
    exercise_id = 7;
  }
}

// 生成一个随机数 在1-5秒之间，90%的概率在2-3秒。
function getRandomAnsTm(sleepTime, min) {
  return (Math.random() * sleepTime + min).toFixed(2);
}

// 做练习的完整逻辑
function doExercise(sleepTime, exercise_id, cookie, type) {
  timme = 100;
  // 1. 获取第一个token http://ksxt.nnch.net/token
  let firstUrl = "http://ksxt.nnch.net/token";
  var first = http.get(firstUrl, {
    headers: headers.A,
  });
  let firstToken = first.body.json().data;
  if (first.statusCode == 200) {
    log("请求第一个token成功，token为：" + firstToken);
  }

  // 2. 唤醒开始时间倒计时，接收返回的试卷id  http://ksxt.nnch.net/mobile/qbank.exercise.execution/entry?i=1&id=6
  let paper_id;
  let secondUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/entry?i=1&id=" + exercise_id;
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
    // var paperId = 127746;

    log("请求练习id成功，paper_id=" + paperId);
    // log("第二个token：" + secondToken);
    // log(secondPost.body.json().data);
  } else {
    log("请求失败！！！");
  }
  // 3.获取试卷题目
  let threeUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/get?i=1&paper_id=" + paperId;
  var threeGet = http.get(threeUrl, {
    headers: headers.B,
  });
  var questionsList = threeGet.body.json().data.questions;

  // 创建子线程
  var thread = threads.start(function () {
    // 在子线程中执行耗时操作

    var tiku = getTiKu();
    crawlQuestions(paperId, exercise_id, questionsList, tiku);
  });

  thread.join();

  var total = threeGet.body.json().data.total;
  // 试题id
  exercise_id = threeGet.body.json().data.paper.exercise_id;
  log("----试题ID为----" + exercise_id);
  log("----试题总数为----" + total); // 习题总数

  // 4.获取第一题的token
  let fourUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution?i=1&paper_id=" + paperId;
  var fourGet = http.get(fourUrl, {
    headers: {
      Host: "ksxt.nnch.net",
      Connection: "keep-alive",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.39(0x1800272c) NetType/WIFI Language/zh_CN",
      // "X-Requested-With": "XMLHttpRequest",
      "Upgrade-Insecure-Requests": 1,
      Cookie: cookie,
    },
  });

  var fourMatchReg = /token: '(\S*)'/;
  var first_question_token = fourGet.body.string().match(fourMatchReg)[1];
  // log("试卷第一题的token：" + first_question_token);

  // 5. 开始答题 http://ksxt.nnch.net/mobile/qbank.exercise.execution/update?i=1
  var submitAnswerUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/update?i=1";

  for (let i = 0; i < total; i++) {
    // 取题id
    var id = questionsList[i].id;
    // log(id, "题目id");
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
    // console.log(correct_answer, "当前未处理的答案");

    // 拟定body提交的参数字符串
    var answer = "";
    correct_answer.forEach((item) => {
      answer = answer + item;
    });
    // console.log(answer, "处理后的这道题答案");

    // 开始循环答题
    if (i == 0) {
      // 每一题的答题延迟都不一样
      // sleepTime = (Math.random() * 1 + 1) * 100;
      sleepTime = getRandomAnsTm(sleepTime, timme);

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
      sleepTime = getRandomAnsTm(sleepTime, timme);
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

      /* // !提交交卷
      if (i > 2) {
        summit(paperId, nextToken);
        return;
      } */
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
  let finishUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/submit?i=1";
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
  }
  // return questionsList;
}

// 爬取练习的题库
function crawlQuestions(paper_id, exercise_id, questionsList, tiku) {
  try {
    const filePath = "./tiku2.json";
    console.log("开始爬取题库");
    // 抽取需要的字段
    var extractedData = questionsList.map(function (question) {
      return {
        id: question.id,
        content: question.content,
        correct_answer: question.correct_answer,
      };
    });

    for (var i = 0; i < extractedData.length; i++) {
      var question = extractedData[i];
      var exists = false;

      for (var j = 0; j < tiku.length; j++) {
        var existingQuestion = tiku[j];
        if (existingQuestion.content === question.content) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        tiku.push(question);
        noProblem++;
        log("加入试题成功+++++++++");
      } else {
        // log("该试题已存在");
      }
    }

    const jsonString = JSON.stringify(tiku, null, 2);
    files.write(filePath, jsonString);
    log("写入试题成功");
  } catch (error) {
    log(error, "错误");
  }
}
// 爬取之前考试过的考试错题的题库
function crawlKaoShiQuestions(questionsList, tiku) {
  try {
    const filePath = "./tiku2.json";
    console.log("开始爬取题库");
    // 抽取需要的字段
    var extractedData = questionsList.map(function (question) {
      return {
        id: question.id,
        content: question.content,
        correct_answer: question.correct_answer,
        options: question.options,
      };
    });

    for (var i = 0; i < extractedData.length; i++) {
      var question = extractedData[i];
      var exists = false;

      for (var j = 0; j < tiku.length; j++) {
        var existingQuestion = tiku[j];
        if (existingQuestion.content === question.content) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        tiku.push(question);
        noProblem++;
        log("加入试题成功+++++++++");
      } else {
        log("该试题已存在");
      }
    }

    const jsonString = JSON.stringify(tiku, null, 2);
    files.write(filePath, jsonString);
    log("写入试题成功");
  } catch (error) {
    log(error, "错误");
  }
}
// 爬取当前考试的题目
function crawlKaoZhongShiQuestions(questionsList) {
  try {
    const filePath = "./kaoshi.json";
    console.log("开始爬取考试题库");
    var tiku = [];
    // -创建子线程
    var thread = threads.start(function () {
      // 在子线程中执行耗时操作
      let filePath = "./tiku2.json";
      var d = files.read(filePath, "utf-8");
      tiku = JSON.parse(d);
    });
    thread.join();

    var kaoshi = [];

    // -创建子线程
    var thread = threads.start(function () {
      // 在子线程中执行耗时操作
      let filePath = "./kaoshi.json";
      var d = files.read(filePath, "utf-8");
      kaoshi = JSON.parse(d);
    });
    thread.join();
    for (var i = 0; i < questionsList.length; i++) {
      var question = questionsList[i];
      var exists = false;

      for (var j = 0; j < tiku.length; j++) {
        var existingQuestion = tiku[j];
        if (existingQuestion.content === question.content) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        kaoshi.push(question);

        log("加入考试试题成功+++++++++");
      } else {
        log("该考试试题已存在");
      }
    }

    const jsonString = JSON.stringify(kaoshi, null, 2);
    files.write(filePath, jsonString);
    log("写入考试试题成功");
  } catch (error) {
    log(error, "错误");
  }
}

// 提前交考试卷
function summit(paperId, lastToken) {
  let type = "exercise";

  // 直接交卷
  let finishUrl = "http://ksxt.nnch.net/mobile/qbank." + type + ".execution/submit?i=1";
  let finishPost = http.request(finishUrl, {
    method: "POST",
    headers: headers.B,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    body: "paper_id=" + paperId + "&__token__=" + lastToken,
  });
}

// 获取本地题库
function getTiKu() {
  var filePath = "./tiku2.json";
  var d = files.read(filePath, "utf-8");
  d = JSON.parse(d);
  return d;
}
