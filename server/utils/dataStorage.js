const fs = require('fs'),
  dataPath = `${__dirname}/../data/`

const resources = [
  { name: 'collections', path: 'collections.json' },
  { name: 'suggestions', path: 'suggestions.json' },
  { name: 'easterEggs', path: 'eastereggs.json' },
  { name: 'perfomance', path: 'perfomance.json' },
]

module.exports = {

  dataPath,

  exists(path) {

    if (!fs.existsSync(dataPath + path)) {

      fs.mkdirSync(dataPath + path, { recursive: true })

    }

  },

  writeFile(path, data, options = {}) {

    if (path.slice(0, 2) === 'r:') {

      const resource = resources.find(r => r.name === path.slice(2))

      if (!resource) throw `Resource not found ${path.slice(2)}`

      path = resource.path

    }

    const fullPath = `${dataPath}${path}`

    let dirPath = fullPath.split('/').slice(0, -1).join('/')

    if (!fs.existsSync(dirPath)) {

      fs.mkdirSync(dirPath, { recursive: true })

    }

    fs.writeFileSync(fullPath, JSON.stringify(data), {
      encondig: 'utf8',
      flag: 'w',
      ...options
    })

  },

  readFile(path) {

    if (path.slice(0, 2) === 'r:') {

      const resource = resources.find(r => r.name === path.slice(2))

      if (!resource) throw `Resource not found ${path.slice(2)}`

      path = resource.path

    }

    const fullPath = `${dataPath}${path}`

    if (!fs.existsSync(fullPath)) return []

    return JSON.parse(fs.readFileSync(fullPath, 'utf8'))

  }

}