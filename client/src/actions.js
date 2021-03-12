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

export const setSideBar = (isOpen) => {
    return {
        type: 'SET_SIDEBAR',
        payload: isOpen
    };
};

export const setSimpleEventForm = (isOpen) => {
    return {
        type: 'SET_SIMPLE_EVENT_FORM',
        payload: isOpen,
    };
};