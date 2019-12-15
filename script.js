window.onload = () => {

	window.addEventListener('resize', resize, false);

	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	document.addEventListener('keydown', (e) => {
		if (e.keyCode === 13 && Board.isRunning === false) {
			Board.isRunning = true;
			setInterval(startTick, 10);
		}
	});

	function resize() {
		let scale = window.devicePixelRatio,
			sizeX = window.innerWidth,
			sizeY = window.innerHeight;
		canvas.style.width = `${sizeX}px`;
		canvas.style.height = `${sizeY}px`;
		canvas.width = sizeX * scale;
		canvas.height = sizeY * scale;
		ctx.scale(scale, scale);
	}

	const tilesX = 100,
		tilesY = 100;

	const Board = {
		tiles: [],
		bounds: {
			x: 50,
			y: 50
		},
		isRunning: false,
		drawSelf: () => {
			return ctx.strokeRect(
				Board.bounds.x,
				Board.bounds.y,
				Board.getWidth(),
				Board.getHeight());
		},
		getWidth: () => {
			return window.innerWidth - Board.bounds.x * 2;
		},
		getHeight: () => {
			return window.innerHeight - Board.bounds.y * 2;
		}
	};

	function makeBoard() {
		let tilesW = Board.getWidth() / tilesX - 2,
			tilesH = Board.getHeight() / tilesY - 2,
			xSpacing = Board.getWidth() / tilesX - tilesW,
			ySpacing = Board.getHeight() / tilesY - tilesH,
			nextX = 0;
		for (let i = 0; i < tilesX; i++) {
			Board.tiles.push([]);

			i === 0 ?
				nextX += (Board.bounds.x + xSpacing / 2) :
				nextX += (tilesW + xSpacing);

			let nextY = 0;
			for (let j = 0; j < tilesY; j++) {

				j === 0 ?
					nextY += (Board.bounds.y + ySpacing / 2) :
					nextY += (tilesH + ySpacing);

				Board.tiles[i].push(new Tile(nextX, nextY, tilesW, tilesH, i, j));
			}
		}
	}

	function Tile(x, y, w, h, r, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.c = c;
		this.alive = false;
	}

	Tile.prototype.update = function () {
		if (Board.isRunning) {
			let aliveNeighbors = this.getNeighbors();
			if (this.alive && aliveNeighbors === 2 || this.alive && aliveNeighbors === 3) {
				this.alive = true;
			} else if (!this.alive && aliveNeighbors === 3) {
				this.alive = true;
			} else {
				this.alive = false;
			}
		}
		this.draw();
	};

	Tile.prototype.getNeighbors = function () {
		let total = 0;
		// top
		if (this.c > 0) {
			total += Board.tiles[this.r][this.c - 1].alive ? 1 : 0;
		}
		// bottom
		if (this.c < tilesY - 1) {
			total += Board.tiles[this.r][this.c + 1].alive ? 1 : 0;
		}
		// left
		if (this.r > 0) {
			total += Board.tiles[this.r - 1][this.c].alive ? 1 : 0;
		}
		// right
		if (this.r < tilesX - 1) {
			total += Board.tiles[this.r + 1][this.c].alive ? 1 : 0;
		}
		// top-left
		if (this.c > 0 && this.r > 0) {
			total += Board.tiles[this.r - 1][this.c - 1].alive ? 1 : 0;
		}
		// top-right
		if (this.c > 0 && this.r < tilesX - 1) {
			total += Board.tiles[this.r + 1][this.c - 1].alive ? 1 : 0;
		}
		// bottom-left
		if (this.c < tilesY - 1 && this.r > 0) {
			total += Board.tiles[this.r - 1][this.c + 1].alive ? 1 : 0;
		}
		// bottom-right
		if (this.c < tilesY - 1 && this.r < tilesX - 1) {
			total += Board.tiles[this.r + 1][this.c + 1].alive ? 1 : 0;
		}
		return total;
	}

	Tile.prototype.draw = function () {
		if (this.alive) {
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.w, this.h);
			ctx.fill();
		}
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	};

	function clearAndUpdate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		Board.drawSelf();
		Board.tiles.forEach(row => {
			row.forEach(tile => {
				tile.update();
			});
		});
	}

	function startTick() {
		clearAndUpdate();
	}

	canvas.onmousedown = function (e) {
		let pos = {
			x: e.clientX,
			y: e.clientY
		}
		Board.tiles.forEach(row => {
			row.forEach(tile => {
				if (isIntersected(pos, tile)) {
					tile.alive = true;
				}
			});
		});
		clearAndUpdate();
	}

	function isIntersected(m, t) {
		return m.x >= t.x &&
			m.x <= t.x + t.w &&
			m.y >= t.y &&
			m.y <= t.y + t.h;
	}

	function init() {
		resize();
		makeBoard();
		clearAndUpdate();
	}

	init();
};