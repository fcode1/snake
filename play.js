// //7.3定义一个定时器，并初始化速度
// var snakeMove;
// var speed = 200;
// var startGameBool = true;
// var startPaushBool = true;
// var scoreBox = document.getElementById('score'); //9.2获取存放分数的容器
// var content = document.getElementById('content');
// var startPage = document.getElementById('startPage');
// var startBtn = document.getElementById('startButton');
// var lose = document.getElementById('lose'); //11.1
// var loseScore = document.getElementById('loseScore'); //11.1
// var closeBtn = document.getElementById('closeBtn');
// var startP = document.getElementById('startP');
// var startBtn = document.getElementById('startButton');

var snakeMove;
var startGameBool = true;
var startPauseBool = true;
var speed = 200;
var scoreBox = document.getElementById('score');
var content = document.getElementById('content');
var lose = document.getElementById('loser');
var loserScore = document.getElementById('loserScore');
var startPaush = document.getElementById('startPaush');
var closeBtn = document.getElementById('close');
var startBtn = document.getElementById('startBtn');
var startPage = document.getElementById('startPage');

init();

function init() {
    //1.取地图宽高
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content; //让地图范围=content容器
    //2.食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0; //食物随机坐标初始化
    this.foodY = 0;

    //5.3蛇
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [
        [3, 0, 'head'], //给定蛇头蛇身的xy值，x依次排列321，防止都罗列在一起，y不用变
        [2, 0, 'body'],
        [1, 0, 'body']
    ]; //蛇头蛇身组成一个数组

    //7.1游戏属性
    this.direct = 'right'; //初始化移动方向为右
    this.left = false; //加锁判断，往右的时候不能往左跟往右，只能上下
    this.right = false;
    this.up = true;
    this.down = true;
    //9.1初始化分数
    this.score = 0;
    scoreBox.innerHTML = this.score;
    bindEvent();
}
// 3.开始游戏函数
function startGame() {
    startPage.style.display = 'none';
    startPaush.style.display = 'block';
    food();
    //5.1执行蛇函数
    snake();
    // //7.4设置运动的定时器，调用move()函数进行运动
    // snakeMove = setInterval(function() {
    //     move();
    // }, speed)
    // bindEvent(); //7.4.1键盘事件开始运动
}
// 4.生成食物
function food() {
    var food = document.createElement('div'); //创建放食物的容器
    food.style.width = this.foodW + 'px'; //让生成的容器=定义好的food宽高
    food.style.height = this.foodH + 'px';
    food.style.borderRadius = '50%';
    food.style.position = 'absolute'; //随机生成食物需要一个定位
    this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW)); //食物随机出现的坐标
    this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));

    food.style.left = this.foodX * this.foodW + 'px'; //随机出现的负的坐标*食物宽度20赋给食物
    food.style.top = this.foodY * this.foodH + 'px';

    food.style.position = 'absolute';

    this.mapDiv.appendChild(food).setAttribute('class', 'food'); //将随机出现的食物，添加到地图的范围内，并赋予class=food属性
}

//5.2生成一个蛇
function snake() {
    // 5.4循环生成蛇的头部身体
    for (var i = 0; i < this.snakeBody.length; i++) {
        var snake = document.createElement('div'); //循环数组每多一节就加一个div
        snake.style.width = this.snakeW + 'px'; //让生成的蛇=定义好的snake宽高
        snake.style.height = this.snakeH + 'px';
        snake.style.borderRadius = '50%';
        snake.style.position = 'absolute'; //需要定位
        snake.style.left = this.snakeBody[i][0] * 20 + 'px'; //取出每个数组元素的第零位，也就是x坐标的值*所占的大小
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]); //区别蛇头还是蛇身的图片可以分别加上一个类名，是第几个就一个标记的字符串--2
        this.mapDiv.appendChild(snake).classList.add('snake'); //由于蛇头蛇身是一个整体，所以共同加上一个clss属性
        //8.改变蛇头按方向移动时的图片方向(蛇头朝向问题)
        switch (this.direct) {
            case 'right':
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            default:
                break;
        }

    }

}
//6.1运动函数
function move() {
    //蛇身位置
    for (var i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    //蛇头位置
    switch (this.direct) {
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;

    }
    removeClass('snake'); //6.2移动之后删除原先的带有snake属性的蛇，并重新生成新的蛇
    snake();
    //9.判断蛇头跟食物是否重合
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
        //9.4蛇身体最后的位置
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) { //判断移动方向并改变身体
            case 'right':
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body'])
                break;
            case 'up':
                this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body'])
                break;
            case 'left':
                this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body'])
                break;
            case 'down':
                this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body'])
                break;
            default:
                break;
        }
        //9.3
        this.score += 1;
        scoreBox.innerHTML = this.score; //分数
        removeClass('food'); //当前食物消失
        food(); //再次生成食物
    }
    //10判断是否碰到边界
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) { //判断蛇头是否小于左边界，或者超出右边界
        // console.log(111);
        //11.碰撞之后重新加载函数
        this.relodGame();
    }
    if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) { //判断蛇头是否小于上边界，或者超出下边界
        // console.log(111);
        this.relodGame();
    }
    //10.1判断蛇头是否碰到自己身体
    var snakeHX = this.snakeBody[0][0]; //取蛇头的xy值
    var snakeHY = this.snakeBody[0][1];
    for (var i = 1; i < this.snakeBody.length; i++) {
        snakeBodyX = this.snakeBody[i][0];
        snakeBodyY = this.snakeBody[i][1];

        if (snakeHX == snakeBodyX && snakeHY == snakeBodyY) {
            // console.log(1111);
            this.relodGame();
        }
    }

}

//7.3接收方向键编码,并绑定到6.1运动函数上
function setDerict(code) {
    switch (code) {
        case 37:
            if (this.left) { //如果按左键，则子只有上下键可继续按
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if (this.up) {
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;

        default:
            break;
    }
}

// 11.碰撞游戏结束之后,清除页面元素
function relodGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);
    startPaush.setAttribute('src', './img/start.png');
    //将游戏的初始值重新拿过来
    this.snakeBody = [
        [3, 2, 'head'],
        [2, 2, 'body'],
        [1, 2, 'body']
    ];
    this.direct = 'right'; //初始化移动方向为右
    this.left = false; //加锁判断，往右的时候不能往左跟往右，只能上下
    this.right = false;
    this.up = true;
    this.down = true;
    //初始化分数
    startPauseBool = true;
    startGameBool = true;

    lose.style.display = 'block'; //11.1
    loserScore.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
}

//6.3删除蛇属性函数
function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while (ele.length > 0) { //如果传进来的元素有值
        ele[0].parentNode.removeChild(ele[0]); //元素找到自己的父级，然后父级再将自己删除
    }
}


//7.2监听键盘事件
function bindEvent() {
    // document.onkeydown = function(e) {
    //     var code = e.keyCode //键盘的方向键码
    //     setDerict(code);
    // }

    // 13, 开始游戏控制全局开关
    startBtn.onclick = function() {
        startAndPauseGame();
    }
    startPaush.onclick = function() {
        startAndPauseGame();
    }

    closeBtn.onclick = function() {
        lose.style.display = 'none';
    }
}

function startAndPauseGame() {
    if (startPauseBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startPaush.setAttribute('src', './img/pause.png');
        //设置运动的定时器，调用move()函数进行运动
        snakeMove = setInterval(function() {
            move();
        }, speed);


        document.onkeydown = function(e) {
            var code = e.keyCode //键盘的方向键码
            setDerict(code);
        };
        startPauseBool = false;
    } else {
        startPaush.setAttribute('src', './img/start.png');
        clearInterval(snakeMove);
        document.onkeydown = function(e) {
            e.returnValue = false;
            return false;
        };
        startPauseBool = true;
    }
};