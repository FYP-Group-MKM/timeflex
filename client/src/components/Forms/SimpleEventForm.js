import format from 'date-fns/format';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import React, { useState, Component, useEffect } from 'react';
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
import { connect } from 'react-redux'
import { setCurrentDate, setSimpleEventForm, postAppointment, fetchAppointments } from '../../actions';

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
    const [titleIsEmpty, setTitleEmptyError] = useState(false);
    const appointment = props.appointment;
    const setAppointment = props.setAppointment;

    useEffect(() => {
        setAppointment({
            ...appointment,
            startDate: setMinutes(addHours(new Date(), 1), 0),
            endDate: setMinutes(addHours(new Date(), 2), 0),
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
                helperText={titleIsEmpty ? "Title required" : ""}
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
                label="All day"
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
}

// class temp extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // open: this.props.isOpen,
//             titleEmpty: false,
//             // simple: true,
//             recurrence: false,
//             recurMenuAnchorEl: null,
//             simpleAppointment: {
//                 googleId: this.props.googleId,
//                 title: "",
//                 allDay: false,
//                 startDate: addHours(setMinutes(new Date(), 0), 1),
//                 endDate: addHours(setMinutes(new Date(), 0), 2),
//                 rRule: null,
//                 exDate: null,
//                 description: null,
//             },
//         };
//         // () => setRecurMenu(true) = () => setRecurMenu(true).bind(this);
//         ()=>setRecurMenu(false) = ()=>setRecurMenu(false).bind(this);
//     }

//     handleClose = () => {
//         const updatedState = {
//             ...this.state,
//             simple: true,
//             simpleAppointment: {
//                 ...this.state.simpleAppointment,
//                 startDate: addHours(setMinutes(new Date(), 0), 1),
//                 endDate: addHours(setMinutes(new Date(), 0), 2),
//             }
//         }
//         this.setState(updatedState);
//         this.props.setSimpleEventForm(false);
//     }

//     handleSubmit = () => {
//         if (this.appointmentIsValid()) {
//             const appointmentRequest = {
//                 type: "simple",
//                 appointment: { ...this.state.simpleAppointment }
//             };
//             appointmentRequest.appointment.startDate = new Date(appointmentRequest.appointment.startDate);
//             appointmentRequest.appointment.endDate = new Date(appointmentRequest.appointment.endDate);
//             if (appointmentRequest.appointment.allDay) {
//                 appointmentRequest.appointment.startDate = new Date(appointmentRequest.appointment.startDate).setHours(0);
//                 appointmentRequest.appointment.startDate = new Date(appointmentRequest.appointment.startDate).setMinutes(0);
//                 appointmentRequest.appointment.endDate = new Date(appointmentRequest.appointment.endDate).setHours(24);
//                 appointmentRequest.appointment.endDate = new Date(appointmentRequest.appointment.endDate).setMinutes(0);
//             }
//             this.props.postAppointment(appointmentRequest);
//             setTimeout(this.props.fetchAppointments, 50);
//             this.handleClose();
//         }
//     }

    // appointmentIsValid = () => {
    //     if (!this.state.simpleAppointment.title
    //         || (new Date(this.state.simpleAppointment.startDate) < new Date())
    //         || (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate))) {
    //         if (this.state.simpleAppointment.title === null || this.state.simpleAppointment.title === "") {
    //             this.setState({ titleEmpty: true });
    //         }
    //         if (new Date(this.state.simpleAppointment.startDate) < new Date()) {
    //             alert("The start date cannot be in the past");
    //         }
    //         if (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate)) {
    //             alert("The start date cannot be later than the end date");
    //         }
    //         return false;
    //     }
    //     return true;
    // }

//     setAllDay = () => {
//         const simpleAppointment = { ...this.state.simpleAppointment };
//         simpleAppointment.allDay = !this.state.simpleAppointment.allDay;
//         this.setState({ simpleAppointment });
//     }

// handleTextFieldInput = (event) => {
//     let nam = event.target.name;
//     let val = event.target.value;
//     if (this.state.simple) {
//         const simpleAppointment = { ...this.state.simpleAppointment };
//         simpleAppointment[nam] = val;
//         this.setState({ simpleAppointment });
//     }
// }

//     handleStartDateInput = (date) => {
//         const simpleAppointment = { ...this.state.simpleAppointment };
//         simpleAppointment.startDate = date;
//         simpleAppointment.endDate = date;
//         this.setState({ simpleAppointment });
//     }

//     handleEndDateInput = (date) => {
//         const simpleAppointment = { ...this.state.simpleAppointment };
//         simpleAppointment.endDate = date;
//         this.setState({ simpleAppointment });
//     }

//     setSmartPlanningForm = () => {
//         this.setState({ simple: false });
//     }

//     setSimpleForm = () => {
//         this.setState({ simple: true });
//     }

//     handleRecurMenuOpen = event => {
//         this.setState({ recurMenuAnchorEl: event.currentTarget });
//     }

//     handleRecurMenuClose = event => {
//         const { startDate } = this.state.simpleAppointment;
//         this.setState({ recurMenuAnchorEl: null });
//         if (event.currentTarget.title) {
//             this.setState({ recurrence: event.currentTarget.title })
//             let rRule = "";
//             if (event.currentTarget.title === "Daily") {
//                 rRule = "FREQ=DAILY;INTERVAL=1";
//             }
//             if (event.currentTarget.title === "Weekly") {
//                 let dayOfWeek = format(startDate, "EEEEEE").toUpperCase();
//                 rRule = `FREQ=WEEKLY;BYDAY=${dayOfWeek};INTERVAL=1`;
//             }
//             if (event.currentTarget.title === "Monthly") {
//                 let dayOfMonth = format(startDate, "d");
//                 rRule = `FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth};INTERVAL=1`;
//             }
//             if (event.currentTarget.title === "None") {
//                 rRule = "";
//             }
//             const simpleAppointment = { ...this.state.simpleAppointment };
//             simpleAppointment.rRule = rRule;
//             this.setState({ simpleAppointment });
//         }
//     }

//     render() {
//         let formLayout = this.renderSimpleForm();
//         if (!this.state.simple)
//             formLayout = <SmartPlanningForm onClose={this.handleClose} refresh={this.props.refresh} />;
//         return (
//             <Dialog
//                 open={this.props.isOpen}
//                 onClose={this.handleClose}
//                 fullWidth maxWidth="xs"
//             >
//                 {formLayout}
//             </Dialog>
//         );
//     }
// };

const mapStateToProps = state => {
    return {
        currentDate: state.calendar.currentDate,
        isOpen: state.simpleEventForm.isOpen,
        googleId: state.data.user.googleId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
        setSimpleEventForm: (value) => dispatch(setSimpleEventForm(value)),
        fetchAppointments: () => dispatch(fetchAppointments()),
        postAppointment: (appointment) => dispatch(postAppointment(appointment))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleEventForm);