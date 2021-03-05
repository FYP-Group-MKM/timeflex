const initialState = {
    drawer:false
}

const drawerReducer = (state = initialState , action) => {
    switch(action.type){
        case 'switch_Drawer':
            return {
                drawer:action.payload,
            }
        default:
            return state
        
    }
}

export default drawerReducer