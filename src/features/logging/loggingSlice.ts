import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoggingState, initialLoggingState } from '../window/state'

/** Feedback stays local — no remote upload. */
export const sendFeedbackMessage = createAsyncThunk(
    'logging/sendFeedbackMessage',
    async (_payload: null, { dispatch }) => {
        dispatch(updateFeedbackMessage(''))
        dispatch(closeChat(null))
    }
)

export const loggingSlice = createSlice({
    name: 'settings',
    initialState: initialLoggingState as LoggingState,
    reducers: {
        updateFeedbackMessage(
            loggingState: LoggingState,
            action: PayloadAction<string>
        ) {
            loggingState.feedbackMessage = action.payload
        },
        toggleFeedback(
            loggingState: LoggingState,
            _action: PayloadAction<null>
        ) {
            loggingState.isOpen = !loggingState.isOpen
        },
        closeChat(loggingState: LoggingState, _action: PayloadAction<null>) {
            loggingState.isOpen = false
        },
    },
})

export const { updateFeedbackMessage, toggleFeedback, closeChat } =
    loggingSlice.actions
