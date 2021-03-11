export const setCurrentDate = (date) => {
    return {
        type: 'SET_CURRENT_DATE',
        payload: date,
    };
};

export const setCurrentView = (view) => {
    return {
        type: 'SET_CURRENT_VIEW',
        payload: view,
    };
};

export const switch_Drawer = (value) => {
    return {
        type: 'switch_Drawer',
        payload: value
    };
};

export const setSimpleEventForm = (value) => {
    return {
        type: 'SET_SIMPLE_EVENT_FORM',
        payload: value,
    };
};