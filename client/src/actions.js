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

export const setSimpleEventForm = (isOpen) => {
    return {
        type: 'SET_SIMPLE_EVENT_FORM',
        payload: isOpen,
    };
};

export const fetchAppointmentsRequest = () => {
    return {
        type: 'FETCH_APPOINTMENTS_REQUEST',
    };
};

export const fetchAppointmentsSuccess = appointments => {
    return {
        type: 'FETCH_APPOINTMENTS_SUCCESS',
        payload: appointments
    };
};

export const fetchAppointmentsFailure = error => {
    return {
        type: 'FETCH_APPOINTMENTS_FAILURE',
        payload: error
    };
};

export const fetchAppointments = () => {
    return async (dispatch) => {
        dispatch(fetchAppointmentsRequest());
        await fetch('/appointments')
            .then(res => res.json())
            .then(appointments => dispatch(fetchAppointmentsSuccess(appointments)))
            .catch(error => dispatch(fetchAppointmentsFailure(error.message)));
    };
};

export const postAppointmentRequest = () => {
    return {
        type: 'POST_APPOINTMENT_REQUEST',
    };
};

export const postAppointmentSuccess = () => {
    return {
        type: 'POST_APPOINTMENT_SUCCESS'
    };
};

export const postAppointmentFailure = error => {
    return {
        type: 'POST_APPOINTMENT_FAILURE',
        payload: error
    };
};

export const postAppointment = appointment => {
    return async (dispatch) => {
        dispatch(postAppointmentRequest());
        await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointment)
        })
            .then(dispatch(postAppointmentSuccess()))
            .catch(error => dispatch(postAppointmentFailure(error.message)));
    };
};

export const deleteAppointmentRequest = () => {
    return {
        type: 'DELETE_APPOINTMENT'
    };
};

export const deleteAppointmentSuccess = (appointments) => {
    return {
        type: 'DELETE_APPOINTMENT_SUCCESS',
        payload: appointments
    };
};

export const deleteAppointmentFailure = (error) => {
    return {
        type: 'DELETE_APPOINTMENT_FAILURE',
        payload: error
    };
};

export const deleteAppointment = appointmentId => {
    return async (dispatch) => {
        dispatch(deleteAppointmentRequest());
        await fetch('/appointments/' + appointmentId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(dispatch(deleteAppointmentSuccess()))
            .catch(error => dispatch(deleteAppointmentFailure(error.message)));
    };
};

export const editAppointmentRequest = () => {
    return {
        type: 'EDIT_APPOINTMENT_REQUEST',
    };
};

export const editAppointmentSuccess = () => {
    return {
        type: 'EDIT_APPOINTMENT_SUCCESS'
    };
};

export const editAppointmentFailure = error => {
    return {
        type: 'EDIT_APPOINTMENT_FAILURE',
        payload: error
    };
};

export const editAppointment = editedAppointment => {
    return async (dispatch) => {
        dispatch(editAppointmentRequest());
        await fetch('/appointments/' + editedAppointment.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedAppointment)
        })
            .then(dispatch(editAppointmentSuccess()))
            .catch(error => dispatch(editAppointmentFailure(error.message)));
    };
};
