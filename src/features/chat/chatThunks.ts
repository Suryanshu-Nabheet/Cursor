import { createAsyncThunk } from '@reduxjs/toolkit'
import { getViewId } from '../codemirror/codemirrorSelectors'
import {
    FullCodeMirrorState,
    getCodeMirrorView,
} from '../codemirror/codemirrorSlice'
import { acceptDiff } from '../extensions/diff'
import { getActiveFileId, getActiveTabId } from '../window/paneUtils'
import { FullState } from '../window/state'
import {
    activateDiffFromEditor,
    changeMsgType,
    doSetChatState,
    dummySubmitCommandBar,
    endFinishResponse,
    getLastBotMessage,
    interruptGeneration,
    openCommandBar,
    setChatOpen,
    toggleChatHistory,
} from './chatSlice'
import {
    getPrecedingLines,
    getProcedingLines,
    getSelectedPos,
    getSelectedText,
} from '../../components/editor'
import { editBoundaryEffect, insertCursorEffect } from '../extensions/hackDiff'
import { getPathForFileId } from '../window/fileUtils'
import { streamCommandBarClient } from '../ai/commandBarStream'
import { triggerAICommandPalette } from '../tools/toolSlice'

export const finishResponse = createAsyncThunk(
    'chat/finishResponse',
    async (_arg, { dispatch, getState }) => {
        const chatState = (getState() as FullState).chatState
        connector.setStore('chatState', chatState)
        dispatch(endFinishResponse())
    }
)

export const initializeChatState = createAsyncThunk(
    'chat/initializeChatState',
    async (_payload: null, { dispatch }) => {
        const chatState = await connector.getStore('chatState')
        dispatch(doSetChatState(chatState))
    }
)

function openAISidebar(getState: () => unknown, dispatch: (a: any) => void) {
    const open = (getState() as FullState).toolState?.aiCommandPaletteTriggered
    if (!open) {
        dispatch(triggerAICommandPalette())
    }
}

export const pressAICommand = createAsyncThunk(
    'chat/pressAICommand',
    (
        keypress:
            | 'Shift-Enter'
            | 'k'
            | 'l'
            | 'Enter'
            | 'Backspace'
            | 'singleLSP'
            | 'history',
        { getState, dispatch }
    ) => {
        const chatState = (getState() as FullState).chatState
        const globState = (getState() as FullState).global

        const tabId = getActiveTabId(globState)
        const fileId = getActiveFileId(globState)

        const viewId = getViewId(tabId)(getState() as FullCodeMirrorState)
        const editorView = viewId && getCodeMirrorView(viewId)

        const lastBotMessage = getLastBotMessage(
            chatState,
            chatState.currentConversationId
        )
        if (chatState.generating && keypress != 'Backspace') {
            return
        }
        switch (keypress) {
            case 'history':
                dispatch(toggleChatHistory())
                return
            case 'Enter':
                if (
                    chatState.msgType === 'edit' ||
                    chatState.msgType == 'chat_edit'
                ) {
                    if (lastBotMessage?.finished && editorView) {
                        acceptDiff(lastBotMessage.conversationId)(editorView)
                    }
                }
                return
            case 'Backspace':
                if (chatState.msgType != 'edit') {
                    if (lastBotMessage && chatState.generating) {
                        dispatch(
                            interruptGeneration(lastBotMessage.conversationId)
                        )
                    }
                }
                return
            case 'l':
            case 'Shift-Enter':
            case 'singleLSP':
                // Freeform / fix-error chat lives in the BYOK AI sidebar
                openAISidebar(getState, dispatch)
                return
            case 'k':
                if (!editorView) {
                    dispatch(changeMsgType('generate'))
                    dispatch(openCommandBar())
                    dispatch(
                        activateDiffFromEditor({
                            currentFile: fileId
                                ? getPathForFileId(globState, fileId)!
                                : null,
                            precedingCode: null,
                            procedingCode: null,
                            currentSelection: null,
                            pos: 0,
                            selection: null,
                        })
                    )
                    return
                }
                {
                    const selPos = getSelectedPos(editorView)
                    const selection = editorView.state.selection.main
                    editorView.dispatch({
                        effects: editBoundaryEffect.of({
                            start: selPos.startLinePos,
                            end: selPos.endLinePos,
                        }),
                    })
                    const cursorPos = selection.from

                    editorView.dispatch({
                        effects: insertCursorEffect.of({
                            pos: cursorPos,
                        }),
                    })

                    if (selection.from != selection.to) {
                        dispatch(changeMsgType('edit'))
                        dispatch(openCommandBar())
                    } else {
                        dispatch(changeMsgType('generate'))
                        dispatch(openCommandBar())
                    }
                    dispatch(
                        activateDiffFromEditor({
                            currentFile: getPathForFileId(globState, fileId!)!,
                            precedingCode: getPrecedingLines(editorView)!,
                            procedingCode: getProcedingLines(editorView),
                            currentSelection: getSelectedText(editorView)!,
                            pos: selection.from,
                            selection: {
                                from: selection.from,
                                to: selection.to,
                            },
                        })
                    )
                }
                return
            default:
                return
        }
    }
)

export const submitCommandBar = createAsyncThunk(
    'chat/submitCommandBar',
    async (_payload: null, { getState, dispatch }) => {
        dispatch(dummySubmitCommandBar())
        const msgType = (getState() as FullState).chatState.msgType
        if (msgType === 'edit' || msgType === 'generate') {
            dispatch(streamCommandBarClient(null))
        } else {
            // Freeform chat is the AI sidebar (BYOK), not a remote backend
            openAISidebar(getState, dispatch)
            dispatch(setChatOpen(false))
        }
    }
)
