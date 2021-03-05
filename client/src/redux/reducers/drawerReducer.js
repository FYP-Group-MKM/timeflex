const initialState = {
    drawer:false
}

const drawerReducer = (state = initialState , action) => {
    switch(action.type){
        case 'switch_Drawer':
            return !state
        default:
            return state
        
    }
}

export default drawerReducer