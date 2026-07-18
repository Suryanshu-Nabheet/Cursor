import type { ComponentType } from 'react'
import type { AIProvider } from '../../ai/providers'
import { DEFAULT_MODELS } from '../../ai/providers'
import type { Settings } from '../../window/state'
import type { SettingsKeyCore } from '../types'
import {
    ClaudeLogo,
    GeminiLogo,
    OllamaLogo,
    OpenAILogo,
    OpenRouterLogo,
} from './logos'

export type ProviderKind = 'local' | 'byok'

export interface ProviderDefinition {
    id: AIProvider
    name: string
    blurb: string
    kind: ProviderKind
    /** Settings field prefix: openAIKey / useOpenAIKey / openAIModel */
    settingKeyCore: SettingsKeyCore
    Logo: ComponentType
}

export const AI_PROVIDERS: ProviderDefinition[] = [
    {
        id: 'ollama',
        name: 'Ollama',
        blurb: 'Local models — no API key',
        kind: 'local',
        settingKeyCore: 'ollama',
        Logo: OllamaLogo,
    },
    {
        id: 'openai',
        name: 'OpenAI',
        blurb: 'Your OpenAI API key',
        kind: 'byok',
        settingKeyCore: 'openAI',
        Logo: OpenAILogo,
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        blurb: 'Your OpenRouter API key',
        kind: 'byok',
        settingKeyCore: 'openRouter',
        Logo: OpenRouterLogo,
    },
    {
        id: 'gemini',
        name: 'Gemini',
        blurb: 'Your Google AI key',
        kind: 'byok',
        settingKeyCore: 'gemini',
        Logo: GeminiLogo,
    },
    {
        id: 'claude',
        name: 'Claude',
        blurb: 'Your Anthropic API key',
        kind: 'byok',
        settingKeyCore: 'claude',
        Logo: ClaudeLogo,
    },
]

export function getProvider(id: AIProvider): ProviderDefinition | undefined {
    return AI_PROVIDERS.find((p) => p.id === id)
}

export function getProviderModels(id: AIProvider): string[] {
    return DEFAULT_MODELS[id] || []
}

export function isProviderConfigured(
    id: AIProvider,
    settings: Settings
): boolean {
    if (id === 'ollama') return true
    if (id === 'openai') return !!(settings.useOpenAIKey && settings.openAIKey)
    if (id === 'openrouter')
        return !!(settings.useOpenRouterKey && settings.openRouterKey)
    if (id === 'gemini') return !!(settings.useGeminiKey && settings.geminiKey)
    if (id === 'claude') return !!(settings.useClaudeKey && settings.claudeKey)
    return false
}

/** Map settingKeyCore → Settings field names for API key / use flag / model */
export function providerSettingKeys(core: SettingsKeyCore) {
    const capped = core.charAt(0).toUpperCase() + core.slice(1)
    return {
        apiKey: `${core}Key` as const,
        useKey: `use${capped}Key` as const,
        model: `${core}Model` as const,
    }
}
