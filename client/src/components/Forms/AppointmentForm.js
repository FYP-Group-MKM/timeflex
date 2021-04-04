import format from 'date-fns/format';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import SwipeableViews from 'react-swipeable-views';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FormDatePicker from './FormDatePicker';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SmartPlanningForm from './SmartPlanningForm';
import TabMenu from './TabMenu';
import SimpleEventForm from './SimpleEventForm';
import { connect } from 'react-redux'
import { setCurrentDate, setSimpleEventForm, postAppointment, fetchAppointments } from '../../actions';

const AppointmentForm = (props) => {
    const [isSimple, setSimple] = useState(true);
    const [appointment, setAppointment] = useState({});
    const [validity, setValidity] = useState({});

    const handleAppointmentFormClose = () => {
        props.setSimpleEventForm(false);
        setAppointment({});
    }

    const handleSubmit = async () => {
        if (!checkValidity())
            return;

        let type;
        if (isSimple)
            type = "simple";
        else
            type = "smart";

        await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
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

    const checkValidity = () => {
        const newValidity = {};
        const { title, startDate, endDate, deadline, exDuration, divisible, minSession, maxSession } = appointment;

        if (!title)
            newValidity.titleIsEmpty = true;

        if (isSimple) {
            if (startDate < new Date() || endDate < new Date()) {
                alert("The start date cannot be in the past")
                newValidity.invalidDate = true;
            }
            if (startDate > endDate) {
                alert("The start date cannot be later than the end date");
                newValidity.invalidDate = true;
            }
        } else {
            if (deadline < new Date()) {
                newValidity.deadlineLegit = false;
                alert("The deadline must be in the future");
            }
            if (!exDuration)
                newValidity.exDurationIsEmpty = true;
            if (!maxSession)
                newValidity.maxSessionIsEmpty = true;
            if (!minSession)
                newValidity.minSessionIsEmpty = true;
            // if (divisible && !maxSession)
            //     newValidity.maxSessionIsEmpty = true;
            // if (divisible && !minSession)
            //     newValidity.minSessionIsEmpty = true;
        }
        setValidity(newValidity);
        for (const requirement in validity) {
            if (!requirement)
                return false;
        }
        return true;
    }

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