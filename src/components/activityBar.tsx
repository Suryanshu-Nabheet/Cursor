import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
    getLeftTab,
    getLeftSideExpanded,
} from '../features/tools/toolSelectors'
import {
    openFileTree,
    openSearch,
    openGit,
    openExtensions,
    collapseLeftSide,
    expandLeftSide,
} from '../features/tools/toolSlice'
import { Codicon } from './codicon'

type ActivityTab = 'filetree' | 'search' | 'git' | 'extensions'

const NAV_ITEMS: { id: ActivityTab; icon: string; title: string }[] = [
    { id: 'filetree', icon: 'files', title: 'Explorer' },
    { id: 'search', icon: 'search', title: 'Search' },
    { id: 'git', icon: 'source-control', title: 'Source Control' },
    { id: 'extensions', icon: 'extensions', title: 'Extensions' },
]

const MORE_ITEMS = [
    { id: 'debug', label: 'Run and Debug', disabled: true },
    { id: 'remote', label: 'Remote Explorer', disabled: true },
] as const

export const ActivityBar = () => {
    const dispatch = useAppDispatch()
    const activeTab = useAppSelector(getLeftTab)
    const isExpanded = useAppSelector(getLeftSideExpanded)
    const [showMore, setShowMore] = useState(false)
    const moreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!showMore) return

        const onPointerDown = (event: MouseEvent) => {
            if (
                moreRef.current &&
                !moreRef.current.contains(event.target as Node)
            ) {
                setShowMore(false)
            }
        }

        document.addEventListener('mousedown', onPointerDown)
        return () => document.removeEventListener('mousedown', onPointerDown)
    }, [showMore])

    const handleTabClick = (tab: ActivityTab) => {
        if (activeTab === tab && isExpanded) {
            dispatch(collapseLeftSide())
            return
        }

        if (tab === 'filetree') dispatch(openFileTree())
        else if (tab === 'search') dispatch(openSearch())
        else if (tab === 'git') dispatch(openGit())
        else if (tab === 'extensions') dispatch(openExtensions())

        dispatch(expandLeftSide())
        setShowMore(false)
    }

    const isActive = (tab: ActivityTab) => activeTab === tab && isExpanded

    return (
        <nav
            className="activity-bar"
            aria-label="Primary sidebar views"
            ref={moreRef}
        >
            <div className="activity-bar__nav" role="tablist">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive(item.id)}
                        aria-label={item.title}
                        title={item.title}
                        className={`activity-bar__item${
                            isActive(item.id) ? ' active' : ''
                        }`}
                        onClick={() => handleTabClick(item.id)}
                    >
                        <Codicon
                            name={item.icon}
                            className="activity-bar__icon"
                        />
                    </button>
                ))}

                <button
                    type="button"
                    aria-label="More views"
                    aria-expanded={showMore}
                    title="More Views"
                    className={`activity-bar__item activity-bar__item--more${
                        showMore ? ' active' : ''
                    }`}
                    onClick={() => setShowMore((open) => !open)}
                >
                    <Codicon
                        name="chevron-down"
                        className="activity-bar__icon activity-bar__icon--chevron"
                    />
                </button>
            </div>

            {showMore && (
                <div className="activity-bar__menu" role="menu">
                    {MORE_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="menuitem"
                            className="activity-bar__menu-item"
                            disabled={item.disabled}
                            title={item.disabled ? 'Coming soon' : item.label}
                            onClick={() => setShowMore(false)}
                        >
                            <span>{item.label}</span>
                            {item.disabled && (
                                <span className="activity-bar__menu-badge">
                                    Soon
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    )
}
