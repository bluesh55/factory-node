import fs from 'fs'
import path from 'path'

class Configuration {
  public fileName: string
  public configTemplate: string
  public modelsDir: string

  constructor() {
    this.fileName = '.factoryrc.json'
    this.configTemplate = `{
  "modelsDir": "./tests/factories/"
}`
    this.modelsDir = ''
  }

  initialize(): string {
    const filePath = path.resolve('.', this.fileName)
    const absoluteDir = path.dirname(filePath)
    fs.writeFileSync(filePath, this.configTemplate, 'utf8')
    return absoluteDir
  }

  load(basePath = ['.']): boolean | undefined {
    const filePath = path.resolve(...basePath, this.fileName)
    if (fs.existsSync(filePath)) {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const modelsDir = path.resolve(...basePath, config.modelsDir)
      this.modelsDir = modelsDir
      return true
    } else {
      if (filePath === path.resolve('/', this.fileName)) {
        return false
      } else {
        this.load([...basePath, '..'])
      }
    }
  }
}

const config = new Configuration()
export default config
