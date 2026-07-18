import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { findFileIdFromPath } from '../window/fileUtils'
import { CommentFunction, CommentState, FullState } from '../window/state'

const initialState: CommentState = {
    fileThenNames: {},
}

/** Load cached comments from local store only (no remote AI comment backend). */
export const updateCommentsForFile = createAsyncThunk(
    'comments/updateCommentsForFile',
    async (payload: { filePath: string }, { getState, dispatch }) => {
        const state = getState() as FullState
        const global = state.global
        const fileId = findFileIdFromPath(global, payload.filePath)
        if (fileId == null) return

        let cachedComments = state.commentState.fileThenNames[payload.filePath]
        if (cachedComments == null) {
            try {
                //@ts-ignore
                cachedComments = await connector.loadComments(payload.filePath)
                dispatch(
                    updateComments({
                        filePath: payload.filePath,
                        comments: cachedComments,
                    })
                )
            } catch {
                cachedComments = {}
            }
        }
    }
)

export const saveComments = createAsyncThunk(
    'comments/saveComments',
    async (payload: { path: string }, { getState }) => {
        const state = getState() as FullState
        //@ts-ignore
        connector.saveComments({
            path: payload.path,
            blob: state.commentState.fileThenNames[payload.path],
        })
    }
)

export const addCommentToDoc = createAsyncThunk(
    'comments/addCommentsToDoc',
    async (
        payload: { filePath: string; functionName: string },
        { dispatch }
    ) => {
        dispatch(afterAddCommentToDoc(payload))
        dispatch(saveComments({ path: payload.filePath }))
    }
)

export const commentSlice = createSlice({
    name: 'commentState',
    initialState: initialState as CommentState,
    reducers: {
        afterAddCommentToDoc(
            state,
            action: PayloadAction<{ filePath: string; functionName: string }>
        ) {
            const commentFn =
                state.fileThenNames[action.payload.filePath][
                    action.payload.functionName
                ]
            if (commentFn == null) return
            commentFn.marked = true
        },
        updateComments(
            state,
            action: PayloadAction<{
                filePath: string
                comments: { [key: string]: CommentFunction }
            }>
        ) {
            state.fileThenNames[action.payload.filePath] =
                action.payload.comments
        },
        updateSingleComment(
            state,
            action: PayloadAction<{
                filePath: string
                functionName: string
                commentFn: CommentFunction
            }>
        ) {
            if (state.fileThenNames[action.payload.filePath] == null) {
                state.fileThenNames[action.payload.filePath] = {}
            }
            state.fileThenNames[action.payload.filePath][
                action.payload.functionName
            ] = action.payload.commentFn
        },
    },
})

export const { updateComments, updateSingleComment, afterAddCommentToDoc } =
    commentSlice.actions
