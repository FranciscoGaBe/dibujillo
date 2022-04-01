const stringSimilarity = require('string-similarity')

module.exports = function Room(id, code, config, wss) {

  //<editor-fold desc="variables">

  //Config variables
  this.id = id
  this.creator = config.creator
  this.name = config.name
  this.rounds = config.rounds
  this.roundTime = config.roundTime
  this.shownWordPercentage = config.shownWordPercentage / 100
  this.wordShowRounds = config.wordShowRounds
  this.private = config.private
  this.password = config.password
  this.collection = config.collection
  this.collectionName = config.collectionName
  this.customWords = config.customWords
  this.maxPlayers = config.maxPlayers
  this.minStart = config.minStart
  this.code = code

  // List variables
  this.users = []
  this.words = []
  this.history = []

  // Game flow variables
  this.state = 'waiting'
  this.word = []
  this.activeUser = null
  this.activeReport = []
  this.voteKick = {}
  this.round = 0
  this.currentRoundTime = 0
  this.currentDrawing = []
  this.bgColor = 'white'

  // Update controle variables
  this.lastUserUpdate = ''
  this.lastSendWord = ''

  // Misc variables
  this.timeouts = []
  //</editor-fold>

  //<editor-fold desc="users">
  this.addUser = user => {

    if (this.users.length >= this.maxPlayers) return user.ws.sendMsg('errorMsg', '{@room.roomFullError@}')

    user.points = 0
    user.active = false
    user.drawn = false
    user.guessed = false
    user.waiting = this.state !== 'waiting'
    user.ws.room = this

    this.users.push(user)

    user.ws.sendMsg('joinRoom', {
      id: this.id,
      name: this.name,
      code: this.code,
      config: {
        rounds: this.rounds,
        roundTime: this.roundTime,
        shownWordPercentage: this.shownWordPercentage * 100 + '%',
        wordShownRounds: this.wordShowRounds,
        private: this.private ? 'Si' : 'No',
        collection: this.collection === 'custom' ? '{@room.custom@}' :
          wss.collections().find(c => c.value === this.collection).name,
        maxPlayers: this.maxPlayers,
        minStart: this.minStart
      },
      creator: {
        id: this.creator.id,
        name: this.creator.name
      }
    })

    if (this.currentDrawing.length) {

      user.ws.sendMsg('deleteDrawing', this.bgColor)
      user.ws.sendMsg('instantDraw', this.currentDrawing)

    }

    if (this.state === 'waiting' && this.users.length >= this.minStart) {

      this.broadcast('word', '{@room.startingGame@}', false)

      setTimeout(() => {

        if (this.state === 'waiting' && this.users.length >= this.minStart) this.start()
        else if (this.state === 'waiting')
          this.broadcast('word', '{@room.waitingPlayers@}', false)

      }, 20000)

    }

    user.ws.sendMsg('chat', `{@room.userWelcome@} ${this.name}`, {
      id: -1,
      name: 'admin'
    })

    user.ws.broadcastRoom('chat', `${user.name} {@room.userJoined@}`, false, {
      id: -1,
      name: 'admin',
    })

    this.updateUsers(user)

  }

  this.removeUser = user => {

    const index = this.users.findIndex(u => u === user)

    if (index > -1) {

      const reportIndex = this.activeReport.findIndex(a => a === user.id)

      this.users.splice(index, 1)
      if (reportIndex >= 0) this.activeReport.splice(reportIndex, 1)
      if (user === this.activeUser) this.activeUser = null
      if (this.voteKick[user.id]) delete this.voteKick[user.id]
      Object.keys(this.voteKick).forEach(k => {

        const index = this.voteKick[k].findIndex(v => v === user.id)

        if (index < 0) return

        this.voteKick[k].splice(index, 1)

      })

      user.ws.room = null

      if (!this.users.length) this.delete()

      this.broadcast('chat', `${user.name} {@room.userLeft@}`)

      if (this.creator === user && this.users.length) {

        this.creator = this.users[0]

        this.broadcast('chat', `${this.creator.name} {@room.newCreator@}`)
        this.broadcast('updateRoomInfo', {
          creator: {
            id: this.creator.id,
            name: this.creator.name
          }
        })

      }

      this.updateUsers()

      return true

    }

    return false

  }

  this.getSafeUsers = () => {

    return this.users.map(u => ({
      id: u.id,
      name: u.name,
      points: u.points,
      active: u === this.activeUser,
      drawn: u.drawn,
      user: u.waiting,
      guessed: u.guessed,
      waiting: u.waiting,
      color: u.color
    })).sort((a, b) => a.points < b.points ? 1 : -1)

  }

  //</editor-fold>

  //<editor-fold desc="game">
  this.start = () => {

    if (this.state !== 'waiting' || this.users.length === 0) return

    this.state = 'starting'
    this.activeUser = null
    this.round = 0

    this.updateUsers()

    this.timeouts.push(setTimeout(() => {

      this.state = 'playing'

      if (this.collection === 'custom') {

        this.words = this.customWords.map(w => Array.isArray(w) ? w : [w, w])

      }
      else {

        this.words = wss.collectionWords(this.collection)

      }

      this.gameHandler()

    }, 5000))

  }

  this.endGame = () => {

    if (this.users.length === 0) return

    this.state = 'ending'

    this.updateUsers()

    this.broadcast('gameEnd', this.getSafeUsers(), false)

    if (wss.rooms.findIndex(r => r === this) < 0) return

    this.resetGame()

  }

  this.resetGame = () => {

    if (this.users.length === 0) return

    this.users.forEach(user => {

      user.points = 0
      user.active = false
      user.drawn = false
      user.guessed = false

    })

    this.timeouts.forEach(to => clearTimeout(to))

    this.timeouts = []
    this.state = 'waiting'
    this.word = []

    this.updateUsers()

    this.broadcast('word', '{@room.nextGame@}', false)

    setTimeout(() => {

      if (this.state === 'waiting' && this.users.length >= this.minStart) this.start()
      else if (this.state === 'waiting') this.broadcast('word', '{@room.waitingPlayers@}', false)

    }, 20000)

  }

  //</editor-fold>

  //<editor-fold desc="game flow">

  this.gameHandler = async () => {

    try {

      if (this.users.length === 0) return

      await this.nextRound()

      this.endGame()

    }
    catch (err) { logger.error(err) }

  }

  this.nextRound = async () => {

    try {

      if (this.users.length === 0) return

      this.round++

      this.users.forEach(u => {

        u.drawn = false
        u.guessed = false
        u.waiting = false

      })

      this.broadcast('round', this.round, false)

      await this.nextDrawing()

      if (this.round < this.rounds || this.users.length === 0) await this.nextRound()
      else {

        this.broadcast('gameMessage', {
          msg: '{@room.endingGame@}',
          word: this.word
        }, false)

        await new Promise(resolve => setTimeout(() => resolve(), 5000))

      }

    }
    catch (err) { logger.error(err) }

  }

  this.nextDrawing = () => {

    return new Promise((resolve, reject) => {

      try {

        if (this.users.length === 0) return

        this.users.forEach(u => {

          u.waiting = false
          u.active = false
          u.guessed = false

        })

        this.deleteDrawing()
        this.updateUsers()
        this.currentDrawing = []

        const user = this.users.sort((a, b) => a.points < b.points ? 1 : -1)
          .find(u => !u.drawn)

        if (user) {

          this.broadcast('gameMessage', {
            msg: '{@room.nextTurn@}',
            word: this.word
          }, user)

          this.timeouts.push(setTimeout(async () => {

            this.broadcast('nextTurn', undefined, false)

            await this.wordHandler(user)
            await this.turnHandler(user)
            await this.nextDrawing()

            resolve()

          }, 5000))

        }
        else resolve()

      }
      catch (err) { logger.error(err) }

    })

  }

  this.wordHandler = user => {

    if (!user.ws || this.users.length === 0) return

    const randomWords = (words = 1) =>
      this.words.splice(Math.floor(Math.random() * this.words.length), words)

    return new Promise((resolve, reject) => {

      try {

        const words = randomWords(6)

        const setWord = word => {

          const index = words.findIndex(w => w[0] === word)

          this.word = words
            .splice(index > -1 ? index : Math.floor(Math.random() * words.length), 1)[0]

          words.forEach(w => this.words.push(w))

          if (user && user.ws) user.ws.removeEventListener('words', onWords)

          resolve()

        }

        const onWords = word => {

          if (timeout) clearTimeout(timeout)

          setWord(word)

        }

        let timeout = null

        if (!user || !user.ws) reject()

        user.ws.sendMsg('words', {
          words: words,
          time: 10
        })

        user.ws.on('words', onWords)

        timeout = setTimeout(() => {

          setWord()

        }, 15000)

      }
      catch (err) { reject(err) }

    })

  }

  this.turnHandler = user => {

    if (!user.ws || this.users.length === 0) return

    return new Promise((resolve, reject) => {

      try {

        this.activeUser = user
        this.activeReport = []

        user.active = true

        this.updateUsers()

        if (user && user.ws) user.ws.sendMsg('secretWord', this.word)

        const wordsContainer = this.word.slice(1).map(c => {

          let charsPerShow = Math.floor(this.shownWordPercentage * c.length / this.wordShowRounds),
            shownWord = c.split('').map(c => c !== ' ' ? '_' : ' '),
            shownWords = new Array(this.wordShowRounds).fill(0)

          if (charsPerShow < 1) charsPerShow = 1

          return [
            c.split('').map(c => c !== ' ' ? '_' : ' ').join(''),
            ...shownWords.map(() => {

              const hiddenIndexes = shownWord
                .map((c, i) => c === '_' ? i : -1).filter(i => i >= 0)

              if (c.length * (1 - this.shownWordPercentage) > hiddenIndexes.length - charsPerShow)
                return shownWord.join('')

              for (let w = 0; w < charsPerShow; w++) {

                const index = hiddenIndexes
                  .splice(Math.floor(Math.random() * hiddenIndexes.length), 1)[0]

                shownWord[index] = c.charAt(index)

              }

              return shownWord.join('')

            })
          ]

        })

        this.currentRoundTime = this.roundTime

        if (this.currentRoundTime % 10 !== 0)
          this.broadcast('roundTime', this.currentRoundTime, false)

        const update = () => {

          this.shownWordsHandler(wordsContainer)

          if (this.currentRoundTime <= 0 || this.activeUser === null) {

            user.drawn = true

            this.broadcast('roundTime', 0, false)

            if (this.activeUser) {

              this.history.push({
                drawer: this.activeUser.name,
                word: this.word[0],
                data: this.currentDrawing,
                bg: this.bgColor
              })

              if (this.history.length > 100) this.history = this.history.slice(-100)

            }

            this.activeUser = null

            resolve()

            return

          }

          if (this.currentRoundTime % 10 === 0)
            this.broadcast('roundTime', this.currentRoundTime, false)

          this.currentRoundTime--

          if (this.activeUser === null) {

            resolve()

            return

          }

          this.timeouts.push(setTimeout(update, 1000))

        }

        update()

      }
      catch (err) { reject(err) }

    })

  }

  this.checkWord = (msg, user) => {

    if (user.admin) return this.broadcast('chat', msg)

    const cleanMsg = msg.safe().toLowerCase(),
      cleanWords = this.word.slice(1).map(w => w.safe().toLowerCase())

    if (this.state === 'playing' && !user.waiting &&
      this.activeUser !== user && !user.guessed &&
      this.currentRoundTime > 0) {

      if (cleanWords.includes(cleanMsg)) {

        const output = `${user.name} {@room.userGuessedWord@}`,
          guessed = this.users.filter(u => u.guessed).length,
          points = Math.trunc(this.currentRoundTime * (1 - guessed * .08))

        this.activeUser.points += Math.trunc(5 + 2 * (guessed - 1))
        user.points += points < 10 ? 10 : points
        user.guessed = true

        this.broadcast('chat', output, { color: user.color })

        this.updateUsers()

        if (this.users.length > 1 &&
          this.users.filter(u => !u.guessed && u !== this.activeUser && !u.waiting).length === 0
        ) this.currentRoundTime = 0

        return user.ws.$subtitute(output)

      }
      else if (cleanWords.map(w => stringSimilarity.compareTwoStrings(cleanMsg, w)).some(w => w > .70)) {

        const output = `${user.name}, {@room.userAlmostGuessedWord@}`

        this.broadcast('chat', output, { color: user.color })

        return user.ws.$subtitute(output)

      }

    }

    user.ws.broadcastRoom('chat', msg)

    return msg

  }

  this.shownWordsHandler = (wordsContainer) => {

    if (this.shownWordPercentage === 0 || this.users.length === 0) return

    if (
      this.roundTime - this.currentRoundTime >=
      (this.wordShowRounds + 1 - wordsContainer[0].length) * (this.roundTime) / this.wordShowRounds
    ) {

      const words = wordsContainer.map(w => w.splice(0, 1)[0])

      if (JSON.stringify(words) !== this.lastSendWord) {

        this.users.filter(u => u.ws && u !== this.activeUser).forEach(u => u.ws.sendMsg('word', words))

      }

      this.lastSendWord = JSON.stringify(words)

    }

  }
  //</editor-fold>

  //<editor-fold desc="Game update">
  this.getHistory = (start = 0) => { return this.history.slice(start) }

  this.deleteDrawing = (color = 'white') => {

    if (!this.currentDrawing.length && this.bgColor === color) return

    this.broadcast('deleteDrawing', color, false)

    this.currentDrawing = []
    this.bgColor = color

  }

  this.updateUsers = () => {

    const users = this.getSafeUsers(),
      stringUsers = JSON.stringify(users)

    if (this.lastUserUpdate === stringUsers) return

    this.broadcast('users', users, false)

    this.lastUserUpdate = stringUsers

  }
  //</editor-fold>

  //<editor-fold desc="misc">
  this.broadcast = (event, msg, user = {}) => {

    if (this.users.length === 0) return

    if (user) user = { id: -1, name: 'admin', color: '#718096', ...user }

    wss.broadcastRoom(event, this, msg, false, user)

  }

  this.delete = function () {

    const index = wss.rooms.findIndex(r => r === this)

    if (index < 0) return

    wss.rooms.splice(index, 1)

    this.endGame()

  }
  //</editor-fold>

}
