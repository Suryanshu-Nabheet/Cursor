import type { SettingsTab } from './types'

export const APP_VERSION = '1.0.0'
export const GITHUB_URL = 'https://github.com/Suryanshu-Nabheet/cursor'
export const GITHUB_DISPLAY = 'github.com/Suryanshu-Nabheet/cursor'
export const AUTHOR_GITHUB_URL = 'https://github.com/Suryanshu-Nabheet'
export const AUTHOR_GITHUB_DISPLAY = 'github.com/Suryanshu-Nabheet'
export const AUTHOR_LINKEDIN_URL =
    'https://www.linkedin.com/in/suryanshu-nabheet/'
export const AUTHOR_LINKEDIN_DISPLAY = 'linkedin.com/in/suryanshu-nabheet'

export const SETTINGS_TABS: {
    id: SettingsTab
    label: string
    icon: string
    title: string
    description: string
}[] = [
    {
        id: 'General',
        label: 'General',
        icon: 'gear',
        title: 'General',
        description: 'Theme, font, editor chrome, indentation, and auto save',
    },
    {
        id: 'AI',
        label: 'AI',
        icon: 'sparkle',
        title: 'AI',
        description: 'Providers, keys, chat context, and inline completion',
    },
    {
        id: 'Languages',
        label: 'Languages',
        icon: 'code',
        title: 'Languages',
        description: 'Install and control language servers for diagnostics',
    },
    {
        id: 'About',
        label: 'About',
        icon: 'info',
        title: 'About',
        description: 'Version, license, and project links',
    },
]

export const CURATED_THEMES = [
    { value: 'cursor-dark', label: 'Cursor Dark', color: '#000000' },
    { value: 'dark-modern', label: 'Dark Modern', color: '#1f1f1f' },
    { value: 'dark-plus', label: 'Dark Plus', color: '#1e1e1e' },
    { value: 'light-modern', label: 'Light Modern', color: '#ffffff' },
] as const

export const FONT_FAMILIES = [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Menlo',
    'Monaco',
] as const
