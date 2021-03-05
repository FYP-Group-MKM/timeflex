const initialState = {
    date:new Date()
}


const changeDateReducer = (state = initialState, action) => {
    switch(action.type){
        case 'change_current_date':
            return state = action.payload
        default:
            return state
        
    }
} 

export default changeDateReducer