import simpleEventFormReducer from './simpleEventFormReducer';
import calendarReducer from './calendarReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    calendar: calendarReducer,
    simpleEventForm: simpleEventFormReducer,
})

export default rootReducer;