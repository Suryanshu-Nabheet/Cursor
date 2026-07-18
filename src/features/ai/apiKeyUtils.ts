/**
 * BYOK API key helpers — keys come only from user Settings.
 */

import { Settings } from '../window/state'

import { OPENAI_MODELS } from './providers/openai'
import { OPENROUTER_MODELS } from './providers/openrouter'
import { GEMINI_MODELS } from './providers/gemini'
import { CLAUDE_MODELS } from './providers/claude'
import { OLLAMA_MODELS } from './providers/ollama'

export type AIProviderId =
    | 'openai'
    | 'openrouter'
    | 'gemini'
    | 'claude'
    | 'ollama'

/** Resolve a provider API key from Settings (BYOK). */
export async function getAPIKeyFromSettings(
    provider: AIProviderId,
    settings: Settings
): Promise<string | null> {
    switch (provider) {
        case 'openai':
            if (settings.useOpenAIKey && settings.openAIKey) {
                return settings.openAIKey
            }
            break
        case 'openrouter':
            if (settings.useOpenRouterKey && settings.openRouterKey) {
                return settings.openRouterKey
            }
            break
        case 'gemini':
            if (settings.useGeminiKey && settings.geminiKey) {
                return settings.geminiKey
            }
            break
        case 'claude':
            if (settings.useClaudeKey && settings.claudeKey) {
                return settings.claudeKey
            }
            break
        case 'ollama':
            return 'ollama'
    }

    return null
}

/** Active provider + key + model from Settings (BYOK). Defaults to Ollama. */
export async function getActiveProviderAPIKey(
    settings: Settings
): Promise<{ provider: string; apiKey: string | null; model: string } | null> {
    const provider = (settings.aiProvider || 'ollama') as AIProviderId
    const apiKey = await getAPIKeyFromSettings(provider, settings)

    if (!apiKey) {
        return null
    }

    let model = ''
    switch (provider) {
        case 'openai':
            model = settings.openAIModel || OPENAI_MODELS[0]
            break
        case 'openrouter':
            model = settings.openRouterModel || OPENROUTER_MODELS[0]
            break
        case 'gemini':
            model = settings.geminiModel || GEMINI_MODELS[0]
            break
        case 'claude':
            model = settings.claudeModel || CLAUDE_MODELS[0]
            break
        case 'ollama':
            model = settings.ollamaModel || OLLAMA_MODELS[0]
            break
    }

    return {
        provider,
        apiKey,
        model,
    }
}
