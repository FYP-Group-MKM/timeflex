const initialState = {
    create:false
}

const createReducer = (state = initialState, action) => {
    switch(action.type){
        case 'change_create':
            return {
                create:action.payload,
            }
        default:
            return state
        
    }
} 

export default createReducer