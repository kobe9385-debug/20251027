/*
By Okazz 2025
*/
let palette = ['#fed766', '#009fb7', '#eff1f3', '#e01a4f', '#f15946', '#193680', '#277AEE'];
let ctx;
let centerX, centerY;
let shapes = [];

// --- 選單變數 ---
let menuX;
const menuWidth = 250; // 選單寬度
const menuItems = ['第一單元作品', '第一單元講義', '測驗系統'];
const triggerArea = 200; // 觸發選單的區域寬度
// -----------------

function setup() {
	createCanvas(windowWidth, windowHeight);
	document.body.style.backgroundColor = '#000';
	rectMode(CENTER);
	colorMode(HSB, 360, 100, 100, 100);
	ctx = drawingContext;
	centerX = width / 2;
	centerY = height / 2;

	// 初始化選單位置為隱藏狀態
	menuX = -menuWidth;

	tiling();
}

function draw() {
	background('#050404');

	// 更新並顯示圖形
	for (let i of shapes) {
		i.run();
	}

	// --- 選單邏輯 ---
	// 根據滑鼠位置決定選單的目標位置
	let targetMenuX = (mouseX < triggerArea && mouseX > 0) ? 0 : -menuWidth;

	// 使用 lerp 函數讓選單平滑移動
	menuX = lerp(menuX, targetMenuX, 0.1);

	// 繪製選單
	drawMenu();

	// --- 滑鼠指標邏輯 ---
	let onMenuItem = false;
	// 檢查滑鼠是否在展開的選單上
	if (menuX > -menuWidth && mouseX < menuX + menuWidth) {
		for (let i = 0; i < menuItems.length; i++) {
			let itemTop = 40 + i * 60;
			let itemBottom = itemTop + 60;
			if (mouseY > itemTop && mouseY < itemBottom) {
				onMenuItem = true;
				break; // 找到一個符合就跳出迴圈
			}
		}
	}
	// 根據是否在選項上改變滑鼠指標
	cursor(onMenuItem ? HAND : ARROW);
	// -----------------
}

function tiling() {
	let c = 15;
	let w = width / c;
	for (let i = -1.5; i < c; i += cos(PI / 6)) {
		for (let j = -1; j <= c; j += cos(PI / 3) * 3) {
			let x = i * w + w / 2;
			let y = j * w + w / 2;
			shapes.push(new Shape(x, y, w));
			shapes.push(new Shape(x + w / 2 * cos(PI / 6), y + w * 1.5 * cos(PI / 3), w));
		}
	}
}

function drawMenu() {
	push();
	// 將原點移到選單的當前位置
	translate(menuX, 0);

	// 繪製選單背景
	fill(20, 80); // 半透明深灰色背景
	noStroke();
	rectMode(CORNER);
	rect(0, 0, menuWidth, height);

	// 繪製選單文字
	textSize(32);
	textAlign(LEFT, TOP);
	for (let i = 0; i < menuItems.length; i++) {
		let itemTop = 40 + i * 60;
		let itemBottom = itemTop + 60; // 每個選項的點擊高度設為 60px

		// 檢查滑鼠是否懸停在該選項上
		if (mouseX > menuX && mouseX < menuX + menuWidth && mouseY > itemTop && mouseY < itemBottom) {
			fill('rgba(255, 0, 0, 0.75)'); // 懸停時為 75% 透明度的紅色
		} else {
			fill(255); // 預設為白色
		}
		text(menuItems[i], 20, itemTop);
	}
	pop();
}

function mousePressed() {
	// 檢查選單是否可見 (menuX > -menuWidth 代表選單已滑出或正在滑出)
	// 並且滑鼠在選單的寬度範圍內
	if (menuX > -menuWidth && mouseX < menuX + menuWidth) {

		// 檢查是否點擊到 "第一單元作品"
		// y 座標在 40 到 40+60 (行高) 之間
		if (mouseY > 40 && mouseY < 100) {
			// 呼叫顯示 iframe 的函數，並傳入作品網址
			showIframe('https://kobe9385-debug.github.io/20251020/');
		}
		// 檢查是否點擊到 "第一單元講義"
		// y 座標在 100 到 100+60 (行高) 之間
		else if (mouseY > 100 && mouseY < 160) {
			// 呼叫顯示 iframe 的函數，並傳入講義網址
			showIframe('https://hackmd.io/@KN034512/B1punJ96ll');
		}
	}
}

function showIframe(url) {
	// 如果 iframe 已經存在，就不要再建立了
	if (document.getElementById('content-iframe')) {
		return;
	}

	// 建立 iframe 元素
	let iframe = document.createElement('iframe');
	iframe.id = 'content-iframe';
	iframe.src = url;
	// 設定 iframe 樣式
	iframe.style.position = 'fixed';
	iframe.style.top = '50%';
	iframe.style.left = '50%';
	iframe.style.transform = 'translate(-50%, -50%)';
	iframe.style.width = '70vw'; // 寬度改為 70% 視窗寬
	iframe.style.height = '85vh'; // 高度改為 85% 視窗高
	iframe.style.border = '2px solid #fed766';
	iframe.style.zIndex = '100'; // 確保在 canvas 之上

	// 建立關閉按鈕
	let closeButton = document.createElement('button');
	closeButton.id = 'close-button';
	closeButton.innerText = 'X';
	// 設定按鈕樣式
	closeButton.style.position = 'fixed';
	closeButton.style.top = 'calc(7.5vh - 20px)'; // (100vh - 85vh)/2 = 7.5vh
	closeButton.style.right = 'calc(15vw - 20px)'; // (100vw - 70vw)/2 = 15vw
	closeButton.style.zIndex = '101'; // 在 iframe 之上
	closeButton.style.cursor = 'pointer';

	// 設定關閉按鈕的點擊事件
	closeButton.onclick = () => {
		document.body.removeChild(iframe);
		document.body.removeChild(closeButton);
	};

	// 將 iframe 和按鈕加入到 body 中
	document.body.appendChild(iframe);
	document.body.appendChild(closeButton);
}
/*------------------------------------------------------------------------------------------*/


class Shape {
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.currentW = w;
		this.shapeType = 0;
		let dst = dist(centerX, centerY, x, y);
		this.timer = -int(map(dst, 0, sqrt(sq(width/2) + sq(height/2)), 100, 0));
		this.t1 = 30;
		this.t2 = this.t1 + 30;
		this.t3 = this.t2 + 120;
		this.clr = random(palette);
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(PI / 6);
		fill(this.clr);
		noStroke();
		if (this.shapeType == 0) {
			beginShape();
			for (let a = 0; a < TAU; a += (TAU / 6)) {
				vertex(this.currentW * 0.5 * cos(a), this.currentW * 0.5 * sin(a));
			}
			endShape();
		} else if (this.shapeType == 1) {
			circle(0, 0, this.currentW * 0.5);
		} else if (this.shapeType == 2) {
			rect(0, 0, this.currentW * 0.75, this.currentW * 0.9);
		} else if (this.shapeType == 3) {
			beginShape();
			for (let a = 0; a < TAU; a += (TAU / 3)) {
				vertex(this.currentW * 0.5 * cos(a), this.currentW * 0.5 * sin(a));
			}
			endShape();
		}

		noStroke();
		fill('#00000050');
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.t1) {
			let nrm = norm(this.timer, 0, this.t1 - 1);
			this.currentW = lerp(this.w, this.w * 0.2, nrm ** 3);
		} else if (this.t1 < this.timer && this.timer < this.t2) {
			let nrm = norm(this.timer, this.t1, this.t2 - 1);
			this.currentW = lerp(this.w * 0.2, this.w, nrm ** (1 / 3));
		}
		if (this.timer == this.t1) {
			this.shapeType++;
			if (this.shapeType == 4) {
				this.shapeType = 0;
			}
			this.clr = random(palette);

		}
		if (this.timer > this.t3) {
			this.timer = 0;
		}
		this.timer++;
	}

	run() {
		this.show();
		this.update();
	}
}