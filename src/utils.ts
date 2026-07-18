// Cursor is a fully independent IDE
import { connector } from './connector'
import { getPlatformInfo as getPlatformInfoFromPlatform } from './platform'

export { getPlatformInfoFromPlatform as getPlatformInfo }

/** User-facing AI / provider errors (BYOK client-side). */
export class ExpectedBackendError extends Error {
    public title: string | null = null
}

export class OpenAIError extends ExpectedBackendError {}
export class BadOpenAIAPIKeyError extends OpenAIError {
    constructor(
        message = 'The provided OpenAI API key is invalid. Please provide a valid API key.'
    ) {
        super(message)
        this.name = 'BadOpenAIAPIKeyError'
    }
}

export class BadModelError extends ExpectedBackendError {
    constructor(
        message = 'The provided model ID is invalid. Please provide a valid model ID.'
    ) {
        super(message)
        this.name = 'BadModelError'
    }
}

export type ExpectedError = BadOpenAIAPIKeyError | BadModelError

export function join(a: string, b: string): string {
    if (a[a.length - 1] === connector.PLATFORM_DELIMITER) {
        return a + b
    }
    return a + connector.PLATFORM_DELIMITER + b
}

// make a join method that can handle ./ and ../
export function joinAdvanced(a: string, b: string): string {
    if (b.startsWith('./')) {
        return joinAdvanced(a, b.slice(2))
    }
    if (b.startsWith('../')) {
        if (a[a.length - 1] === connector.PLATFORM_DELIMITER) {
            a = a.slice(0, -1)
        }
        const aOneHigher = a.slice(
            0,
            a.lastIndexOf(connector.PLATFORM_DELIMITER)
        )
        return joinAdvanced(aOneHigher, b.slice(3))
    }
    return join(a, b)
}

export function removeBeginningAndEndingLineBreaks(str: string): string {
    str = str.trimEnd()
    while (str[0] === '\n') {
        str = str.slice(1)
    }
    while (str[str.length - 1] === '\n') {
        str = str.slice(0, -1)
    }
    return str
}
