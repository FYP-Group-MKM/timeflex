import {combineReducers} from 'redux'
import appReducer from './Application/appReducer'

const rootReducer = combineReducers({
    app:appReducer
})

export default rootReducer