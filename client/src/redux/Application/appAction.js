import {CHANGE_CURRENT_DATE, CHANGE_CURRENT_VIEW,drawerClose,drawerClose,showCreateFrom,hideCreateForm} from './appType'

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

export const closeDrawer = () => {
    return {
        type:drawerClose,
    }
}

export const openDrawer = () => {
    return {
        type:drawerOpen
    }
}

export const showFrom = () =>{
    return {
        type:showCreateFrom,
        
    }
}

export const hideFrom = () => {
    return {
        type:hideCreateForm
    }
}