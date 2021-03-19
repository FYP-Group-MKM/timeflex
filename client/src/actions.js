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
    return (dispatch) => {
        dispatch(fetchAppointmentsRequest());
        fetch('/api/appointments')
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
    return (dispatch) => {
        dispatch(postAppointmentRequest());
        fetch('/api/appointments', {
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

export const deleteAppointmentSuccess = () => {
    return {
        type: 'DELETE_APPOINTMENT_SUCCESS'
    };
};

export const deleteAppointmentFailure = (error) => {
    return {
        type: 'DELETE_APPOINTMENT_FAILURE',
        payload: error
    };
};

export const deleteAppointmentLocally = appointmentId => {
    return {
        type: 'DELETE_APPOINTMENT_LOCALLY',
        payload: appointmentId
    }
}

export const deleteAppointment = appointmentId => {
    return (dispatch) => {
        dispatch(deleteAppointmentRequest());
        dispatch(deleteAppointmentLocally());
        fetch('/api/appointments/' + appointmentId, {
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