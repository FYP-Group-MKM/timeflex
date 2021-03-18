import simpleEventFormReducer from './simpleEventFormReducer';
import calendarReducer from './calendarReducer';
import dataReducer from './dataReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    calendar: calendarReducer,
    simpleEventForm: simpleEventFormReducer,
    data: dataReducer
})

export default rootReducer;