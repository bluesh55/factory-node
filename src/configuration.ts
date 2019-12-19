import fs from 'fs'
import path from 'path'

class Configuration {
  public configFileName = '.factoryrc.json'
  public defaultConfig = {
    modelsDir: './tests/factories/',
    loaderDir: './tests/helpers',
  }
  public modelsDir: string
  public loaderDir: string

  constructor() {
    this.modelsDir = ''
    this.loaderDir = ''
  }

  load(): boolean {
    const isConfigFileLoaded = this.loadConfigFileRecursively()

    if (!isConfigFileLoaded) {
      throw new Error('Configuration file does not exist')
    }

    return true
  }

  loadConfigFileRecursively(basePath = ['.']): boolean | undefined {
    const filePath = path.resolve(...basePath, this.configFileName)
    if (fs.existsSync(filePath)) {
      const config = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const modelsDir = path.resolve(...basePath, config.modelsDir)
      const loaderDir = path.resolve(...basePath, config.loaderDir)

      this.modelsDir = modelsDir
      this.loaderDir = loaderDir

      return true
    } else {
      if (filePath === path.resolve('/', this.configFileName)) {
        return false
      } else {
        return this.loadConfigFileRecursively([...basePath, '..'])
      }
    }
  }
}

export const configuration = new Configuration()
