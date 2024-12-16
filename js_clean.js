const btnStart = document.querySelector("button");
const timeNode = document.querySelector("#time");
const countNode = document.querySelector("#combo");
const animals = document.querySelectorAll("img");

let time, count;

const redToYellow = [];
const gameStart = () => {
  console.log("gameStart");
  btnStart.removeEventListener("click", gameStart);
  btnStart.disabled = true;

  time = 60;
  count = 0;
  timeNode.textContent = time;
  countNode.textContent = count;
  const timer = setInterval(() => {
    time--;
    timeNode.textContent = time;
    if (time === 0) {
      clearInterval(timer);
      btnStart.addEventListener("click", gameStart);
      btnStart.disabled = false;
    }
  }, 1000);
  for (let i = 0; i < 100; i++) {
    const showObj = {
      space: Math.floor(Math.random() * 9),
      show: Math.floor(Math.random() * 3) + 2,
      id: i,
    };

    setTimeout(() => {
      showIt(showObj);
    }, Math.floor(Math.random() * 59000));
  }
};





const showIt = (obj) => { // 將參數obj傳入showIt函式中
  console.log(obj);

  if (animals[obj.space].classList.length > 0) {  // 如果 animals 這個 NodeList 的第 obj.space 個值的 classList 的長度 >0 的話
    (obj.space = Math.floor(Math.random() * 9)),  // 執行以下程式碼
      setTimeout(() => {showIt(obj);}, 100);
    return;
  } else {
    animals[obj.space].classList.add("red");
    animals[obj.space].src = "img/on.png";
    animals[obj.space].datdaset.playerId = obj.id;

    redToYellow[obj.id] = setTimeout(() => {
      animals[obj.space].classList.remove("red");
      animals[obj.space].src = "img/state.png";
      delete animals[obj.space].dataset.playerId;
    }, obj.show * 1000);
  }
};






const getCombo = (space) => {
  console.log(space);
  if (animals[space].classList.contains("red")) {
    console.log("is red");
    count++;
    countNode.textContent = count;

    animals[space].classList.remove("red");
    animals[space].classList.add("green");
    animals[space].src = "img/off.png";

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
