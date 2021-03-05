export const changeCurrentDate = (currentDate) => {
    return {
        type:'change_current_date',
        payload:currentDate,
    }
}

export const changeView = (view) => {
    return{
        type:'change_view',
        payload:view,
    }
}

export const switch_Drawer = (value) => {
    return{
        type:'switch_Drawer',
        payload:value
    }
}

export const createFrom = (value) => {
    return {
        type:'create',
        payload:value,
    }
}