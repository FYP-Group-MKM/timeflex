import changeDateReducer from './changeDateReducer'
import changeViewReducer from './changeViewReducer'
import drawerReducer     from './drawerReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    currentDate : changeDateReducer,
    view        : changeViewReducer,
    drawer      : drawerReducer,
})


export default rootReducer