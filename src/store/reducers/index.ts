import { combineReducers } from '@reduxjs/toolkit';
import userSliceReducer from './users';
import messageSliceReducer from "./messages"; 

const rootReducer = combineReducers({
  userSlice: userSliceReducer,
  messageSlice: messageSliceReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
