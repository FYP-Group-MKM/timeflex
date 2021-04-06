import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import TabMenu from './TabMenu';
import SmartPlanningForm from './SmartPlanningForm';
import SimpleEventForm from './SimpleEventForm';
import { connect } from 'react-redux'
import { setSimpleEventForm, fetchAppointments } from '../../../actions';

const styles = {
    loadingScreen: {
        minWidth: "300px",
        minHeight: "200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

const AppointmentForm = (props) => {
    const [isSimple, setSimple] = useState(true);
    const [appointment, setAppointment] = useState({});
    const [validity, setValidity] = useState({});
    const [loading, setLoading] = useState(false);

    const handleAppointmentFormClose = () => {
        props.setSimpleEventForm(false);
        setAppointment({});
        setValidity({});
    }

    const handleSubmit = async () => {
        // setLoading(true);
        if (isSimple && !simpleAppointmentIsValid())
            return;
        if (!isSimple && !smartAppointmentIsValid())
            return;
        await fetch('http://localhost:' + process.env.PORT || 5000 + '/appointments', {
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
            }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then((res) => {
                if (res.message === "NO_SOLUTION_AVAILABLE")
                    props.popSnackbar();
                props.fetchAppointments();
            })
            .then(() => setLoading(false))
            .then(() => handleAppointmentFormClose())
            .catch(error => console.log(error));
        setLoading(false);
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

    return (
        <div>
            <Dialog open={props.open} onClose={handleAppointmentFormClose}>
                <DialogContent>
                    {!loading ?
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
                        </TabMenu> :
                        <div style={styles.loadingScreen}>
                            <CircularProgress />
                        </div>}
                </DialogContent>
                <DialogActions>
                    {!loading ? <>
                        <Button onClick={handleAppointmentFormClose} color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} color="primary" disableElevation>
                            Create Event
                        </Button>
                    </> : null}
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