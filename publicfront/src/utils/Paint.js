import Hammer from 'hammerjs'

export default function (config, callback, sendTimeout = 1000) {

	this.precision = 10000
	this.canvas = config.canvas
	this.ctx = this.canvas.getContext('2d')
	this.pen = config.pen
	this.lastPoint = null
	this.drawQueue = []
	this.drawing = []
	this.drawTimeout = null
	this.drawWait = 0
	this.lastSavedPoint = null
	this.canDraw = false
	this.color = 'black'
	this.size = 10

	this.addDrawListeners = () => {

		const mc = new Hammer.Manager(this.canvas)
		const tap = new Hammer.Tap({
			event: 'tap',
			pointers: 1,
			taps: 1,
			interval: 300,
			thime: 250,
			threshold: 2,
			posThreshold: 10
		})
		const singlepan = new Hammer.Pan({
			event: 'pan',
			direction: Hammer.DIRECTION_ALL,
			threshold: 1,
			pointers: 1
		})

		mc.add(tap)
		mc.add(singlepan)
		singlepan.recognizeWith(tap)

		mc.on('tap', ev => this.addClick(ev))
		mc.on('panstart', ev => this.addClick(ev))
		mc.on('panmove', ev => this.addClick(ev, true))

	}

	this.addClick = (ev, dragging = false) => {

		if (!this.canDraw || ev.changedPointers[0].target !== this.canvas) return

		const point = [
			Math.trunc(ev.changedPointers[0].offsetX * this.precision / this.canvas.width),
			Math.trunc(ev.changedPointers[0].offsetY * this.precision / this.canvas.height),
			dragging,
			Math.trunc(this.size * this.precision / this.canvas.width),
			this.color
		]

		if (this.lastSavedPoint) {

			const oldPoint = [...point]

			point.forEach((p, i) => {

				if (p !== this.lastSavedPoint[i]) return

				point[i] = ''

			})

			this.lastSavedPoint = oldPoint

		}
		else this.lastSavedPoint = point

		this.drawing.push(point)

		this.draw([point])

	}

	this.draw = (data, instant = false) => {

		this.drawQueue = [...this.drawQueue, ...data]
		this.drawWait = 950 / this.drawQueue.length

		const draw = (d) => {

			if (!d || !Array.isArray(d) || !d.length) return

			const point = {
				x: d[0] === '' ? this.lastPoint.x : (d[0] / this.precision * this.canvas.width),
				y: d[1] === '' ? this.lastPoint.y : (d[1] / this.precision * this.canvas.height),
				d: d[2] === '' ? this.lastPoint.d : d[2],
				s: d[3] === '' ? this.lastPoint.s : (d[3] / this.precision * this.canvas.width),
				c: d[4] === '' ? this.lastPoint.c : d[4]
			}

			this.ctx.lineWidth = point.s
			this.ctx.strokeStyle = point.c
			this.ctx.beginPath()

			if (point.d && this.lastPoint) {

				this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
				this.ctx.lineTo(point.x, point.y)
				this.ctx.closePath()
				this.ctx.stroke()

			}
			else {

				this.ctx.fillStyle = point.c
				this.ctx.arc(point.x, point.y, point.s / 2, 0, 2 * Math.PI)
				this.ctx.fill()

			}

			this.lastPoint = point

			if (this.pen) {

				this.pen.style.top = `${point.y}px`
				this.pen.style.left = `${point.x}px`
				this.pen.style.color = point.c
				this.pen.style.fontSize = `${point.s * 10}px`

			}

			if (this.drawQueue.length > 0 && !instant) {

				this.drawTimeout = setTimeout(() => { draw(this.drawQueue.splice(0, 1)[0]) }, this.drawWait)

			}
			else {

				this.drawTimeout = null

				setTimeout(() => {

					if (!this.pen) return

					this.pen.style.top = '10000px'
					this.pen.style.left = '10000px'

				}, 50)

			}

		}

		this.ctx.lineJoin = 'round'

		if (instant) {

			this.drawQueue.forEach(d => draw(d))
			this.drawQueue = []

			return

		}

		if (this.drawTimeout) return
		if (this.drawQueue.length > 0) this.drawTimeout = draw(this.drawQueue.splice(0, 1)[0])

	}

	this.erase = (color = 'white') => {

		this.drawQueue = []

		this.ctx.fillStyle = color
		this.ctx.beginPath()
		this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
		this.ctx.closePath()
		this.ctx.fill()

		if (this.pen) {

			this.pen.style.top = '10000px'
			this.pen.style.left = '10000px'

		}

		clearTimeout(this.drawTimeout)
		this.drawTimeout = null
		this.lastPoint = null
		this.lastSavedPoint = null

	}

	if (config.draw) this.addDrawListeners()

	if (callback) {

		const send = () => {

			callback([...this.drawing])

			this.drawing.length = 0

			setTimeout(send, sendTimeout)

		}

		setTimeout(send, sendTimeout)

	}

}