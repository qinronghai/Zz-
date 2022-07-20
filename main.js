"ui";
("ui");

/* *
-可配置选项
*/
// 试卷编号
var exercise_id = 7;
// 答题延时时间：生成随机暂停时间1-2秒之间的随机数(保留两位小数)
var sleepTime = ((Math.random() * 1 + 1) * 1000).toFixed(2);
// 循环执行次数
var loopNum = 10;
// 用户姓名
var name = "";
// 用户当前积分   "(?<=(您的积分.*\n\s*(<span class=\"info-value\">)))([0-9]{0,})"gm
var currentIntegral = 0;
// 练习试卷列表
var dataList =
  "请选择练习的试卷|基层补偿知识练习10题| 研究生资助知识练习10题| 国家奖助学金知识练习30题| 入伍资助知识练习20题| 贷款知识练习30题|综合练习50题|征信知识练习30题| 轮询练习| 最终考试";
// 副本-练习试卷列表
var dataList_copy = ["请选择练习的试卷", 7, 6, 5, 4, 3, 2, 1, 8, 9];
var dataList_copy_2 = [
  "请选择练习的试卷",
  "基层补偿知识练习10题",
  "研究生资助知识练习10题",
  "国家奖助学金知识练习30题",
  "入伍资助知识练习20题",
  "贷款知识练习30题",
  "综合练习50题",
  "征信知识练习30题",
  "轮询练习",
  "最终考试",
];
// 已答卷次数
var answeredNum = 0;

// 在config.js文件重已经配置
var headers = require("config.js");

// UI布局
ui.layout(
  <vertical h="auto">
    <appbar>
      <toolbar id="toolbar" title="得分小助手" />
    </appbar>
    <viewpager margin="30">
      <vertical id="parent">
        <vertical>
          <text id="name" text="姓名：{{name}}" textSize="16sp" h="25dp" textColor="blue" />
          <text id="integral" text="当前积分：{{currentIntegral}}" textSize="16sp" h="25dp" textColor="red" />
          <text text="Cookie" textColor="black" textStyle="bold" h="30dp" textSize="18sp" />
          <input maxHeight="300" id="Cookie" text="" textSize="18sp" />
        </vertical>
        <spinner id="spinner" entries="{{dataList}}" textColor="red" />

        <horizontal>
          <text text="请输入答题延时" inputType="number" textColor="black" paddingLeft="8dp" textSize="14sp">
            请输入答题延时
          </text>
          <input id="delay" w="100dp" gravity="center_horizontal" text="{{sleepTime}}" />
        </horizontal>
        <horizontal>
          <text inputType="number" textColor="black" paddingLeft="8dp" textSize="14sp">
            （执行 | 轮询）次数
          </text>
          <input id="loop" text="{{loopNum}}" w="90dp" gravity="center_horizontal" />
        </horizontal>
        <horizontal>
          <vertical>
            <button w="80" h="40" id="start_btn" marginTop="18dp" bg="#27c671">
              开始答题
            </button>
            <button w="80" h="40" marginTop="18dp" bg="#f38b00">
              开始考试
            </button>
          </vertical>
          <vertical>
            <button w="80" h="40" marginTop="18dp" bg="#6574eb">
              爬取题目
            </button>
            <button id="stop" w="80" h="40" marginTop="18dp" bg="#e83434">
              停止
            </button>
          </vertical>
          <vertical h="98" marginTop="18dp" marginLeft="60">
            <button w="*" h="40" bg="#00acf6">
              查询考试成绩
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
          <text text="日志" gravity="center_vertical" textStyle="bold" textSize="16sp" textColor="black" />
          <com.stardust.autojs.core.console.ConsoleView marginTop="5" id="console" h="auto" />
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
  var myAdapterListener = new android.widget.AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
      if (isFirst) {
        isFirst = false;
      } else {
        log("选择的试卷是: " + dataList_copy_2[id]);
        // 设置试卷id
        exercise_id = dataList_copy[id];
      }
    },
  });
  // 监听事件
  ui.spinner.setOnItemSelectedListener(myAdapterListener);

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
}

// 获取用户信息
function getUserInfo(cookie) {
  let url = "http://nzks.2009xc.com/mobile/system.member.Index?i=1";
  var getHtml = http.get(url, {
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
  // 取得html内容
  let htmlString = getHtml.body.string();
  // 中转正则
  const REGEX_TRANSIT = /((<span class=\"info-value\">))([0-9]{0,})/gm;
  let transitVar = htmlString.match(REGEX_TRANSIT)[1];

  // 取积分-数字类型
  const REGEX_CURPOINTS = /([0-9]{0,})/gm;
  let curIntegralCharArr = transitVar.match(REGEX_CURPOINTS);

  // 中转正则
  const REGEX_NAME_TRANSIT = /((<span class=\"info-type\">)\D*)/gm;
  transitVar = htmlString.match(REGEX_NAME_TRANSIT)[0];

  // 取姓名-中文类型
  const REGEX_NAME = /[\u4e00-\u9fa5·]{3}/;
  let name = transitVar.match(REGEX_NAME)[0];

  curIntegralCharArr.forEach((item) => {
    if (item != "") {
      currentIntegral = item;
    }
  });

  ui.integral.setText("当前积分：" + currentIntegral);
  ui.name.setText("姓名：" + name);

  return { name, currentIntegral };
}

// 做对应试卷的函数
function do_match_exercise(sleepTime, loopNum, exercise_id, cookie) {
  var count = loopNum;
  log("-------------开始答题--------------");
  while (loopNum > 0) {
    console.log("正在执行第" + (count - loopNum + 1) + "次答卷...");

    doExercise(sleepTime, exercise_id, cookie);

    ui.answeredNum.setText("已答卷次数：" + (count - loopNum + 1) + "/" + count);
    // 等待开始下一次答卷
    sleep(2000);

    // 下一次循环
    loopNum--;
  }
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

// 做一套试卷的完整逻辑
function doExercise(sleepTime, exercise_id, cookie) {
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
  }
}
