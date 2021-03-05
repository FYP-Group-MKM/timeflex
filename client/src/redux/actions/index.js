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

export const switch_Drawer = () => {
    return{
        type:'switch_Drawer',
    }
}

export const createFrom = (value) => {
    return {
        type:'create',
        payload:value,
    }
}