import format from 'date-fns/format';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FormDatePicker from '../FormDatePicker';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from 'react-redux'
import { setCurrentDate, setSimpleEventForm, postAppointment, fetchAppointments } from '../../../actions';

const useStyles = makeStyles({
    root: {
        height: "350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: {
        marginBottom: "10px"
    },
    datePickerRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    allDaySwitch: {
        marginLeft: "-5px"
    },
    timeSectionHeader: {
        color: "#757575",
        width: "50px"
    },
    recurMenu: {
        margin: "10px 0"
    },
    formButtons: {
        alignSelf: "flex-end",
    }
});

const SimpleEventForm = (props) => {
    const classes = useStyles();
    const [recurrenceType, setRecurrenceType] = useState("");
    const [recurMenuAnchorEl, setRecurMenuAnchorEl] = useState(null);
    const appointment = props.appointment;
    const setAppointment = props.setAppointment;

    useEffect(() => {
        setAppointment({
            title: "",
            startDate: setMinutes(addHours(new Date(), 1), 0),
            endDate: setMinutes(addHours(new Date(), 2), 0),
            allDay: false,
            rRule: "",
            description: "",
        });
    }, [])

    const handleTextFieldInput = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setAppointment({
            ...appointment,
            [nam]: val,
        });
    };

    const handleStartDateSelection = (date) => {
        setAppointment({
            ...appointment,
            startDate: date
        });
    };

    const handleEndDateSelection = (date) => {
        setAppointment({
            ...appointment,
            endDate: date
        });
    };

    const handleAllDayButtonChange = () => {
        setAppointment({ ...appointment, allDay: !appointment.allDay });
    };

    const handleRecurMenuClose = (event) => {
        const { startDate } = appointment;

        let rRule = null;
        if (event.currentTarget.title === "Daily")
            rRule = "FREQ=DAILY;INTERVAL=1";
        if (event.currentTarget.title === "Weekly") {
            let dayOfWeek = format(startDate, "EEEEEE").toUpperCase();
            rRule = `FREQ=WEEKLY;BYDAY=${dayOfWeek};INTERVAL=1`;
        }
        if (event.currentTarget.title === "Monthly") {
            let dayOfMonth = format(startDate, "d");
            rRule = `FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth};INTERVAL=1`;
        }

        setRecurrenceType(event.currentTarget.title);
        setRecurMenuAnchorEl(null);
        setAppointment({
            ...appointment,
            rRule: rRule,
        });
    };

    return (
        <form className={classes.root} autoComplete="off">
            <TextField
                required
                fullWidth
                name="title"
                label="Title"
                error={props.validity.titleIsEmpty}
                className={classes.title}
                value={appointment.title}
                onChange={handleTextFieldInput}
                InputLabelProps={{ shrink: true }}
                helperText={props.validity.titleIsEmpty ? "Title required" : ""}
            />
            <div className={classes.datePickerRow}>
                <Typography variant="button" className={classes.timeSectionHeader}>From</Typography>
                <FormDatePicker
                    allDay={appointment.allDay}
                    currentDate={appointment.startDate ? appointment.startDate : setMinutes(addHours(new Date(), 1), 0)}
                    handleFormChange={handleStartDateSelection}
                />
            </div>
            <div className={classes.datePickerRow}>
                <Typography variant="button" className={classes.timeSectionHeader}>Until</Typography>
                <FormDatePicker
                    allDay={appointment.allDay}
                    currentDate={appointment.endDate ? appointment.endDate : setMinutes(addHours(new Date(), 2), 0)}
                    handleFormChange={handleEndDateSelection}
                />
            </div>
            <FormControlLabel
                control={<Switch color="primary" size="small" onChange={handleAllDayButtonChange} />}
                label={<Typography variant="body2">All day</Typography>}
                className={classes.allDaySwitch}
            />
            <Button
                size="small"
                variant="outlined"
                onClick={(event) => setRecurMenuAnchorEl(event.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
                className={classes.recurMenu}
            >
                <Typography variant="button">
                    {appointment.rRule ? recurrenceType : "Doesn't repeat"}
                </Typography>
            </Button >
            <Menu anchorEl={recurMenuAnchorEl} open={Boolean(recurMenuAnchorEl)} onClose={() => setRecurMenuAnchorEl(null)} keepMounted>
                <MenuItem title="None" onClick={handleRecurMenuClose}>
                    <Typography variant="button">Doesn't repeat</Typography>
                </MenuItem>
                <MenuItem title="Daily" onClick={handleRecurMenuClose}>
                    <Typography variant="button">Daily</Typography>
                </MenuItem>
                <MenuItem title="Weekly" onClick={handleRecurMenuClose}>
                    <Typography variant="button">Weekly</Typography>
                </MenuItem>
                <MenuItem title="Monthly" onClick={handleRecurMenuClose}>
                    <Typography variant="button">Monthly</Typography>
                </MenuItem>
            </Menu>
            <TextField
                name="description"
                label="Description"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={handleTextFieldInput}
                multiline rows="2"
                fullWidth
            />
        </form >
    );
};

const mapStateToProps = state => {
    return {
        currentDate: state.calendar.currentDate,
        isOpen: state.simpleEventForm.isOpen,
        googleId: state.data.user.googleId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
        setSimpleEventForm: (value) => dispatch(setSimpleEventForm(value)),
        fetchAppointments: () => dispatch(fetchAppointments()),
        postAppointment: (appointment) => dispatch(postAppointment(appointment))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleEventForm);