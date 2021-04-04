import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SmartPlanningForm from './SmartPlanningForm';
import TabMenu from './TabMenu';
import SimpleEventForm from './SimpleEventForm';
import { connect } from 'react-redux'
import { setSimpleEventForm, fetchAppointments } from '../../actions';

const AppointmentForm = (props) => {
    const [isSimple, setSimple] = useState(true);
    const [appointment, setAppointment] = useState({});
    const [validity, setValidity] = useState({});

    const handleAppointmentFormClose = () => {
        props.setSimpleEventForm(false);
        setAppointment({});
        setValidity({});
    }

    const handleSubmit = async () => {
        if (isSimple && !simpleAppointmentIsValid())
            return;
        if (!isSimple && !smartAppointmentIsValid())
            return;
        await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: isSimple ? "simple" : "smart",
                appointment: {
                    googleId: props.googleId,
                    ...appointment
                }
            })
        }).then((res) => {
            if (res.status === 200)
                props.fetchAppointments();
            // if (res.status === 404)
            //     this.setState({ snackbar: true });
        });
        handleAppointmentFormClose();
    }

    const simpleAppointmentIsValid = () => {
        const { title, startDate, endDate } = appointment;
        let newValidity = {};
        let isValid = true;

        if (!title) {
            newValidity.titleIsEmpty = true;
            isValid = false;
        }

        if (startDate < new Date()) {
            newValidity.invalidDate = true;
            isValid = false;
            alert("The start date cannot be in the past");
        }

        if (endDate < new Date()) {
            newValidity.invalidDate = true;
            isValid = false;
            alert("The end date cannot be in the past");
        }

        if (startDate > endDate) {
            newValidity.invalidDate = true;
            isValid = false;
            alert("The start date cannot be later than the end date");
        }

        setValidity(newValidity);
        return isValid;
    };

    const smartAppointmentIsValid = () => {
        const { title, deadline, exDuration, divisible, minSession, maxSession } = appointment;
        let newValidity = {};
        let isValid = true;

        if (!title) {
            newValidity.titleIsEmpty = true;
            isValid = false;
        }

        if (deadline < new Date()) {
            newValidity.invalidDeadline = true;
            isValid = false;
            alert("The deadline must be in the future");
        }

        if (!exDuration) {
            newValidity.exDurationIsEmpty = true;
            isValid = false;
        }

        if (divisible && !maxSession) {
            newValidity.maxSessionIsEmpty = true;
            isValid = false;
        }

        if (divisible && !minSession) {
            newValidity.minSessionIsEmpty = true;
            isValid = false;
        }

        setValidity(newValidity);
        return isValid;
    }
    console.log(appointment);
    return (
        <div>
            <Dialog open={props.open} onClose={handleAppointmentFormClose}>
                <DialogContent>
                    <TabMenu appointment={appointment} setAppointment={setAppointment} setSimple={setSimple}>
                        <SimpleEventForm
                            key={appointment}
                            appointment={appointment}
                            setAppointment={setAppointment}
                            validity={validity}
                            setValidity={setValidity}
                        />
                        <SmartPlanningForm
                            key={appointment}
                            appointment={appointment}
                            setAppointment={setAppointment}
                            validity={validity}
                            setValidity={setValidity}
                        />
                        <p>class</p>
                    </TabMenu>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAppointmentFormClose} color="primary">
                        Cancel
                     </Button>
                    <Button variant="contained" onClick={handleSubmit} color="primary" disableElevation>
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => ({
    open: state.simpleEventForm.isOpen,
    googleId: state.data.user.googleId,
});

const mapDispatchToProps = dispatch => ({
    setSimpleEventForm: (val) => dispatch(setSimpleEventForm(val)),
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentForm);