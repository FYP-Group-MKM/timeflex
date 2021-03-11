const initialState = {
    isOpen: false
};

const simpleEventFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SIMPLE_EVENT_FORM':
            return {
                ...state,
                isOpen: action.payload,
            }
        default:
            return state;
    };
};

export default simpleEventFormReducer;