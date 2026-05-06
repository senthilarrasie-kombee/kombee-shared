import { combineReducers } from '@reduxjs/toolkit';
import rootSliceReducer from './reducers/rootSlice';

const rootReducer = combineReducers({
  root: rootSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
