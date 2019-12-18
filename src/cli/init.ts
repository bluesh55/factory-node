import config from '../config'

export default function() {
  const initializedDir = config.initialize()
  console.log(`Configuration file was created at ${initializedDir}! 😎`)
}
