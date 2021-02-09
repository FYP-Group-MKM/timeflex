import {CHANGE_CURRENT_DATE ,drawerClose,drawerOpen,showCreateFrom,hideCreateForm, CHANGE_CURRENT_VIEW} from './appType'
const initialState = {
    currentDate: new Date(),
    currentViewName: "Week",
    drawerOpen: false,
    create: false,
}

const appReducer = (state = initialState,action) =>{
    switch(action.type){
        case CHANGE_CURRENT_DATE:
            return{
                ...state,
                currentDate:action.payload
            }
        case CHANGE_CURRENT_VIEW:
            return {
                ...state,
                currentViewName:action.payload
            }
        case drawerClose:
            return{
                ...state,
                drawerOpen:false
                
            }
        case drawerOpen:
            return {
                ...state,
                drawerOpen:true
            }
        case showCreateFrom:
            return {
                ...state,
                create:true

            }
        case hideCreateForm:
            return{
                ...state,
                create:false
            }


    }   
}

export default appReducer