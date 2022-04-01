module.exports = function (id, ws, config) {

	this.id = id
	this.name = config.name
	this.color = config.color
	this.ws = ws
	this.points = 0
	this.active = false
	this.drawn = false
	this.guessed = false
	this.waiting = this.state !== 'waiting'
	this.lang = config.lang
	this.token = config.token

	this.delete = function () {

		this.ws = null

	}

}