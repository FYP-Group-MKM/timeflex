import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
// import rootReducer from './rootReducer'
import logger from 'redux-logger'
import appReducer from './Application/appReducer'

const store = createStore(appReducer,composeWithDevTools(applyMiddleware(logger,thunk)))

export default store
