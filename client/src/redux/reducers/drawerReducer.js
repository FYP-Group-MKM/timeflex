const drawerReducer = (state = false , action) => {
    switch(action.type){
        case 'switch_Drawer':
            return !state
        default:
            return state
        
    }
}

export default drawerReducer