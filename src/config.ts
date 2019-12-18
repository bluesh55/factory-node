import fs from 'fs'
import path from 'path'

class Configuration {
  public configFileName: string
  public configTemplate: string
  public modelsDir: string
  public tsConfig: any

  constructor() {
    this.configFileName = '.factoryrc.json'
    this.configTemplate = `{
  "modelsDir": "./tests/factories/"
}`
    this.modelsDir = ''
  }

  initialize(): string {
    const filePath = path.resolve('.', this.configFileName)
    const absoluteDir = path.dirname(filePath)
    fs.writeFileSync(filePath, this.configTemplate, 'utf8')
    return absoluteDir
  }

  load(): boolean {
    const isModelsDirLoaded = this.loadModelsDir()

    if (!isModelsDirLoaded) {
      throw new Error('Models directory does not exist')
    }

    return true
  }

  loadModelsDir(basePath = ['.']): boolean | undefined {
    const filePath = path.resolve(...basePath, this.configFileName)
    if (fs.existsSync(filePath)) {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const modelsDir = path.resolve(...basePath, config.modelsDir)
      this.modelsDir = modelsDir
      return true
    } else {
      if (filePath === path.resolve('/', this.configFileName)) {
        return false
      } else {
        this.loadModelsDir([...basePath, '..'])
      }
    }
  }
}

const config = new Configuration()
export default config
