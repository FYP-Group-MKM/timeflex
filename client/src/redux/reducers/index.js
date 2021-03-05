import changeDateReducer from './changeDateReducer'
import changeViewReducer from './changeViewReducer'
import drawerReducer     from './drawerReducer'
import createReducer     from './createReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    currentDate : changeDateReducer,
    view        : changeViewReducer,
    drawer      : drawerReducer,
    create      : createReducer,
})


export default rootReducer