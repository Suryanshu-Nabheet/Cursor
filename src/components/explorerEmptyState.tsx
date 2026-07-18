import React, { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import * as gs from '../features/globalSlice'
import { Codicon } from './codicon'

export function ExplorerEmptyState() {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(true)

    return (
        <section className="explorer-empty" aria-label="Explorer">
            <header className="explorer-empty__header">
                <button
                    type="button"
                    className="explorer-empty__header-toggle"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                >
                    <Codicon
                        name={isOpen ? 'chevron-down' : 'chevron-right'}
                        className="explorer-empty__chevron"
                    />
                    <span>No Folder Opened</span>
                </button>
            </header>

            {isOpen && (
                <div className="explorer-empty__body">
                    <p className="explorer-empty__text">
                        You have not yet opened a folder.
                    </p>
                    <button
                        type="button"
                        className="explorer-empty__button"
                        onClick={() => dispatch(gs.openFolder(null))}
                    >
                        Open Folder
                    </button>

                    <p className="explorer-empty__text explorer-empty__text--spaced">
                        You can clone a repository locally.
                    </p>
                    <button
                        type="button"
                        className="explorer-empty__button"
                        onClick={() => dispatch(gs.openClonePopup())}
                    >
                        Clone Repository
                    </button>

                    <p className="explorer-empty__footer">
                        To learn more about how to use Git and source control in
                        Cursor{' '}
                        <a
                            className="explorer-empty__link"
                            href="https://github.com/Suryanshu-Nabheet/cursor"
                            target="_blank"
                            rel="noreferrer"
                        >
                            read our docs
                        </a>
                        .
                    </p>
                </div>
            )}
        </section>
    )
}
