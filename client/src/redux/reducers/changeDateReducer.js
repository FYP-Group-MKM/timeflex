const changeDateReducer = (state = new Date(), action) => {
    switch(action.type){
        case 'change_current_date':
            return state = action.payload
        default:
            return state
        
    }
} 

export default changeDateReducer