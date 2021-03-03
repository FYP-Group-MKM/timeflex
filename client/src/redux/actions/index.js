export const changeCurrentDate = (currentDate) => {
    return {
        type:'change_current_date',
        payload:currentDate,
    }
}

export const changeView = () => {
    return{
        type:'change_view'
    }
}

export const switch_Drawer = () => {
    return{
        type:'switch_Drawer',
    }
}

export const create = () => {
    return {
        type:'create'
    }
}