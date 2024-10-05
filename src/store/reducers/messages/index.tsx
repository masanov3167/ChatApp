import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type edit = {
    id: number,
    text: string,
    user_id: number
}

type State = {
    editText?: edit,
    ignoreChangeContent: boolean,
    asReadQueue: number[],
};

const initialState: State = {
    ignoreChangeContent: false,
    asReadQueue: []
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        chengeEdit: (state, action: PayloadAction<edit | undefined>) => {
            const data = action.payload
            state.editText = data ?? undefined
            return state
        },
        changeContentIgnore: (state, action: PayloadAction<boolean>) => {
            const data = action.payload
            state.ignoreChangeContent = data
            return state
        },
        addAsReadQueue: (state, action: PayloadAction<number>) => {
            const find = state.asReadQueue.find(q => Number(q) === Number(action.payload));
            if (!find) {
                const data = [...state.asReadQueue, action.payload];
                state.asReadQueue = data;
            }
            return state
        },
        clearAsReadQueue: (state) => {
            state.asReadQueue = [];
            return state
        }
    }
});

export const { chengeEdit, changeContentIgnore, addAsReadQueue, clearAsReadQueue } = messageSlice.actions;
export default messageSlice.reducer;
