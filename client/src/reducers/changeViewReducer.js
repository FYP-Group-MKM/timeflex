const initialState = {
    view:'Week'
}

const changeViewReducer = (state = initialState, action) => {
    switch(action.type){
        case 'change_view':
            return {
                view:action.payload
            }
        default:
            return state
        
    }
} 

export default changeViewReducer