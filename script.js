// 初始宣告區域，作為全域使用，讓整份JS都能讀取到
const btnStart = document.querySelector("button"); // 抓到<button>標籤
const timeNode = document.querySelector("#time"); // 抓到 id=time 的標籤
const countNode = document.querySelector("#combo"); // 抓到 id=combo 的標籤
const animals = document.querySelectorAll("img"); // 抓到全部<img>標籤

let time, count;
const redToYellow = [];
// Step.1 規劃功能函式
const gameStart = () => {
  console.log("gameStart");
  // Step.1 一開始讓 btnStart 失去作用，移除 click 點擊事件，同時也讓標籤 disabled (雙重認證)
  btnStart.removeEventListener("click", gameStart); // 移除start按鈕點擊事件
  btnStart.disabled = true; // 禁用 start 按鈕

  // Step.1 將剩餘時間初始化為60秒，將成績分數初始化為0分
  time = 60;
  count = 0;
  timeNode.textContent = time; // 將初始時間 time 塞到變數 timeNode 中 (id=time的標籤)
  countNode.textContent = count; // 將初始分數 count 塞到變數 countNode 中 (id=combo的標籤)

  // Step.3 開始計時
  const timer = setInterval(() => {
    time--; // 初始時間 time 少1秒
    timeNode.textContent = time; // 再重新塞到變數 timeNode 中 (id=time的標籤)
    if (time === 0) {
      // 如果時間為0(倒數計時完了))
      clearInterval(timer); // 停止 timer 這個函式(停止計時)
      // 讓 btnStart 恢復，可以重新玩遊戲
      btnStart.addEventListener("click", gameStart); // 恢復開始遊戲的點擊事件
      btnStart.disabled = false; // 讓 disabled 不能執行 (可以重新start)
    }
  }, 1000);
  /* 用 JS 內建的函式 setInterval() 每1000毫秒執行一次箭頭函式
    () => {
        time--; 
        timeNode.textContent = time;
        if (time === 0) {
            clearInterval(timer);
            btnStart.addEventListener("click", gameStart);
            btnStart.disabled = false;
            }
        }
    */

  // Step.4 產生100個 red 事件，然後指定到9宮格內某個空閒的 state.png 位置，然後同時設定這100個 red 事件出現的時間，再決定 red 事件的曝光時間長短
  for (let i = 0; i < 100; i++) {
    // const atSpace = Math.floor(Math.random() * 9); // 把 0~8 個數字 指定給九宮格
    // const atTime = Math.floor(Math.random() * 56000); // 0~56s => rand 0~55999ms
    // const atShow = Math.floor(Math.random() * 3000); // 2~4s => (0~2)+2
    const showObj = {
      // 設置一個物件 showObj 裝3個屬性：space、show、id
      space: Math.floor(Math.random() * 9), // space 屬性裝資料：隨機產生 0.00001~0.999999 的浮點數，再乘以 9 = 0.0000009 ~ 8.999999，再無條件捨去 = 0 ~ 8 的整數，表示要裝入的九宮格編號 0 ~ 8
      show: Math.floor(Math.random() * 3) + 2, // show 屬性裝資料：隨機產生 0.00001~0.999999 的浮點數，再乘以 3 = 0.0000003 ~ 2.999999，再無條件捨去 = 0 ~ 2 的整數，再 +2 = 2 ~ 4 的整數，表示要讓 red 事件 出場的時間長短 2 ~ 4 秒
      id: i, // 設置每個 red 事件 的 id = 0 ~ 99
    };

    // 在單一 red 事件下，試圖觸發到畫面上，根據 atTime 延遲觸發 red 事件
    setTimeout(() => {
      // 設置一個延遲觸發函式setTimeOut(JS內建函式)，來執行函式showIt()，延遲時間為 0 ~ 59 秒之間隨機產生的時間
      // showIt(atTime, i, atShow, atSpace);
      showIt(showObj); // 將 showObj 物件作為參數傳入showIt函式
    }, Math.floor(Math.random() * 59000));
  }
};

const showIt = (obj) => {
  // 負責將 red 事件顯示在畫面上
  console.log(obj);

  // Step.1 試圖找到指定的圖片，替換為red，並控制幾秒後消失返回yellow
  // 如果當下 space 位置已經是red，則不要覆蓋，想辦法換個位置重新安排出場
  if (animals[obj.space].classList.length > 0) {
    // 如果當下 space 位置已經是red 或 green，則不要覆蓋，想辦法換個位置重新安排出場
    obj.space = Math.floor(Math.random() * 9); // 再重新決定 0~8
    // 如果畫面都是 red ，大家都找不到空間出場，大家都會立刻去找新位置，當下會發生無限迴圈，電腦效能變差
    // 解決方法：稍微空窗0.1秒，不要那麼快去找空間
    setTimeout(() => {
      showIt(obj);
    }, 100);
    return;
  } else {
    animals[obj.space].classList.add("red");
    animals[obj.space].src = "img/on.png";
    animals[obj.space].datdaset.playerId = obj.id;

    // 記下當時 timeOut 的定時器id，利於某時機可以清除
    redToYellow[obj.id] = setTimeout(() => {
      // 回傳定時器的序號，把它當作 value 存入
      animals[obj.space].classList.remove("red");
      animals[obj.space].src = "img/state.png";
      delete animals[obj.space].dataset.playerId;
    }, obj.show * 1000);
  }
};

const getCombo = (space) => {
  console.log(space);
  if (animals[space].classList.contains("red")) {
    // 如果是red，計分+1分，並讓 red 事件turn to green 事件
    console.log("is red");
    count++;
    countNode.textContent = count;

    animals[space].classList.remove("red");
    animals[space].classList.add("green");
    animals[space].src = "img/off.png";

    // const playerId=animals[space].dataset.playerId;
    // const BombSN=redToYellow[playerId];
    // clearTimeout(BombSN);
    clearTimeout(redToYellow[animals[space].dataset.playerId]);

    setTimeout(() => {
      animals[space].classList.remove("green");
      animals[space].src = "img/state.png";
    }, 1000);
  }
};

// 初始執行區域
btnStart.addEventListener("click", gameStart);
document.onkeydown = function (event) {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 103:
      getCombo(0);
      break;
    case 104:
      getCombo(1);
      break;
    case 105:
      getCombo(2);
      break;
    case 100:
      getCombo(3);
      break;
    case 101:
      getCombo(4);
      break;
    case 102:
      getCombo(5);
      break;
    case 97:
      getCombo(6);
      break;
    case 98:
      getCombo(7);
      break;
    case 99:
      getCombo(8);
      break;
  }
};

/* animals.forEach((animals, index)=>{
    animals.addEventListener("click",()=>{
        getCombo(index);
    })
});
*/
