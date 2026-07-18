import { app } from 'electron'
import log from 'electron-log'
import path from 'path'

import { isAppInApplicationsFolder } from '../utils'

const logLocation = path.join(app.getPath('userData'), 'log.log')

if (isAppInApplicationsFolder) {
    log.transports.file.resolvePath = () => logLocation
}
Object.assign(console, log.functions)

function logError(error: any) {
    log.info('uncaughtException', error)
}

export default function setupLogger() {
    process.on('uncaughtException', (error) => {
        logError(error)
    })
    process.on('unhandledRejection', (error) => {
        logError(error)
    })
}
