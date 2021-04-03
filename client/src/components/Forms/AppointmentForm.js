import format from 'date-fns/format';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import SwipeableViews from 'react-swipeable-views';
import React, { useState } from 'react';
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
    const [appointment, setAppointment] = useState({
        startDate: setMinutes(addHours(new Date(), 1), 0),
        endDate: setMinutes(addHours(new Date(), 2), 0),
    });

    console.log(appointment)
    return (
        <div>
            <Dialog open={true} >
                <DialogContent>
                    <TabMenu>
                        <SimpleEventForm appointment={appointment} setAppointment={setAppointment} />
                        <SmartPlanningForm />
                        <p>class</p>
                    </TabMenu>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { }} color="primary">
                        Cancel
                     </Button>
                    <Button variant="contained" onClick={() => { }} color="primary" disableElevation>
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AppointmentForm;