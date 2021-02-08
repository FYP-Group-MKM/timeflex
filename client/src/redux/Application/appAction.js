import {CHANGE_CURRENT_DATE, CHANGE_CURRENT_VIEW} from './appType'

export const changeCurrnetDate = (currentDate) => {
    
    return{
        type:CHANGE_CURRENT_DATE,
        payload:currentDate
    }
}

export const changeCurrentView = (currentView) => {

    return{
        type:CHANGE_CURRENT_VIEW,
        payload:currentView
    }
}