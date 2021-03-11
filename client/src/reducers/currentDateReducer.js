const initialState = {
    currentDate: new Date()
}

const currentDateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_DATE':
            return {
                ...state,
                currentDate: action.payload
            };
        default:
            return state;
    }
}

export default currentDateReducer;