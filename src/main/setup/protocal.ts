import { app } from 'electron'
import path from 'path'

const PROTOCOL = 'cursor'

export default function setupProtocal() {
    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
                path.resolve(process.argv[1]),
            ])
        }
    } else {
        app.setAsDefaultProtocolClient(PROTOCOL)
    }
}
