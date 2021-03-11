export const setCurrentDate = (date) => {
    return {
        type: 'SET_CURRENT_DATE',
        payload: date,
    }
}

export const changeView = (view) => {
    return {
        type: 'change_view',
        payload: view,
    }
}

export const switch_Drawer = (value) => {
    return {
        type: 'switch_Drawer',
        payload: value
    }
}

export const createForm = (value) => {
    return {
        type: 'change_create',
        payload: value,
    }
}