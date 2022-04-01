Array.prototype.last = function (pos = 1) { return this[this.length - pos] }
Array.prototype.random = function () { return this[Math.floor(Math.random() * this.length)] }

String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.slice(1) }
String.prototype.safe = function () { return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "") }