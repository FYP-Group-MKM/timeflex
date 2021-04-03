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

    const handleSubmit = () => {
        console.log(checkValidity());
    }

    const checkValidity = () => {
        if (isSimple) {
            checkSimpleAppointmentValidity();
        } else {
            const { title, deadline, exDuration, divisible, minSession, maxSession } = appointment;

            const newValidity = {};
            if (!title)
                newValidity.titleIsEmpty = true;
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

            setValidity(newValidity);

            for (const requirement in validity) {
                if (!requirement)
                    return false;
            }
            return true;
        }
    }

    const checkSmartAppointmentValidity = () => {
        const { title, deadline, exDuration, divisible, minSession, maxSession } = appointment;

        const newValidity = {};
        if (!title)
            newValidity.titleEmpty = true;
        if (deadline < new Date()) {
            newValidity.deadlineLegit = false;
            alert("The deadline must be in the future");
        }
        if (!exDuration)
            newValidity.exDurationEmpty = true;
        if (divisible && !maxSession)
            newValidity.maxSessionEmpty = true;
        if (divisible && !minSession)
            newValidity.minSessionEmpty = true;

        setValidity(newValidity);

        for (const requirement in validity) {
            if (!requirement)
                return false;
        }
        return true;
    }

    const checkSimpleAppointmentValidity = () => {
        if (!this.state.simpleAppointment.title
            || (new Date(this.state.simpleAppointment.startDate) < new Date())
            || (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate))) {
            if (this.state.simpleAppointment.title === null || this.state.simpleAppointment.title === "") {
                this.setState({ titleEmpty: true });
            }
            if (new Date(this.state.simpleAppointment.startDate) < new Date()) {
                alert("The start date cannot be in the past");
            }
            if (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate)) {
                alert("The start date cannot be later than the end date");
            }
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
});

const mapDispatchToProps = dispatch => ({
    setSimpleEventForm: (val) => dispatch(setSimpleEventForm(val)),
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentForm);