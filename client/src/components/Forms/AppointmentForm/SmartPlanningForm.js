import React from 'react';
import setMinutes from 'date-fns/setMinutes';
import addWeeks from 'date-fns/addWeeks';
import setHours from 'date-fns/setHours';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FormDatePicker from '../FormDatePicker';
import { connect } from 'react-redux';
import { fetchAppointments, postAppointment } from '../../../actions';

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
    divisibilitySwitch: {
        marginLeft: "-5px"
    },
    timeSectionHeader: {
        color: "#757575",
        width: "50px"
    },
    numberTextFieldRow: {
        width: "100%",
        minHeight: "70px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    numberTextField: {
        maxWidth: "150px"
    },
    formButtons: {
        alignSelf: "flex-end",
    }
});


const SmartPlanningForm = (props) => {
    const classes = useStyles();
    const appointment = props.appointment;
    const setAppointment = props.setAppointment;

    const handleTextFieldInput = (event) => {
        let nam = event.target.name;
        let val = event.target.value;

        if (nam === "exDuration" || nam === "minSession" || nam === "maxSession") {
            val = parseInt(val);
            if (val <= 0)
                return;
        }

        if (nam === "minSession")
            if (val > appointment.exDuration || val > appointment.maxSession)
                return;

        if (nam === "maxSession")
            if (val > appointment.exDuration || val < appointment.minSession)
                return;

        setAppointment({
            ...appointment,
            [nam]: val,
        });
    };

    const handleDeadlineSelection = (date) => {
        setAppointment({
            ...appointment,
            deadline: date
        });
    };

    const handleAppointmentDivisibility = () => {
        setAppointment({
            ...appointment,
            divisible: !appointment.divisible,
            minSession: appointment.exDuration,
            maxSession: appointment.exDuration,
        });
    }

    return (
        <>
            <form className={classes.root} autoComplete="off">
                <Typography variant="body2">There is a smart planning algorithm in TimeFlex, which will help you find a timeslot for your task.</Typography>
                <TextField
                    required
                    fullWidth
                    value={appointment.title}
                    error={props.validity.titleIsEmpty}
                    helperText={props.validity.titleIsEmpty ? "Required" : ""}
                    name="title"
                    label="Title"
                    onChange={handleTextFieldInput}
                    InputLabelProps={{ shrink: true }}
                    className={classes.title}
                />
                <div className={classes.datePickerRow}>
                    <Typography variant="button" className={classes.timeSectionHeader}>Due</Typography>
                    <FormDatePicker
                        allDay={false}
                        currentDate={appointment.deadline ? appointment.deadline : addWeeks(setMinutes(setHours(new Date(), 23), 59), 1)}
                        handleFormChange={handleDeadlineSelection}
                    />
                </div>
                <FormControlLabel
                    // key={appointment.divisible}
                    label={<Typography variant="body2">Divisible</Typography>}
                    className={classes.divisibilitySwitch}
                    checked={appointment.divisible ? true : false}
                    control={<Switch color="primary" size="small" onChange={handleAppointmentDivisibility} />}
                />
                <div className={classes.numberTextFieldRow}>
                    <TextField
                        label="Duration (hours)"
                        name="exDuration"
                        type="number"
                        value={appointment.exDuration ? appointment.exDuration : ""}
                        error={props.validity.exDurationIsEmpty}
                        helperText={props.validity.exDurationIsEmpty ? "Required" : ""}
                        onChange={handleTextFieldInput}
                        InputLabelProps={{ shrink: true }}
                        className={classes.numberTextField}
                    />
                    {appointment.divisible ?
                        <>
                            <TextField
                                label="Session min."
                                name="minSession"
                                type="number"
                                value={appointment.minSession}
                                error={props.validity.minSessionIsEmpty}
                                helperText={props.validity.minSessionIsEmpty ? "Required" : ""}
                                onChange={handleTextFieldInput}
                                InputLabelProps={{ shrink: true }}
                                className={classes.numberTextField}
                            />
                            <TextField
                                label="Session max."
                                name="maxSession"
                                type="number"
                                value={appointment.maxSession ? appointment.maxSession : null}
                                error={props.validity.maxSessionIsEmpty}
                                helperText={props.validity.maxSessionIsEmpty ? "Required" : ""}
                                onChange={handleTextFieldInput}
                                InputLabelProps={{ shrink: true }}
                                className={classes.numberTextField}
                            />
                        </> : null}
                </div>
                <TextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    onChange={handleTextFieldInput}
                    InputLabelProps={{ shrink: true }}
                    multiline rows="2"
                    fullWidth
                />
            </form>
        </>
    );
};

const mapStateToProps = state => ({
    googleId: state.data.user.googleId,
});

const mapDispatchToProps = dispatch => ({
    fetchAppointments: () => dispatch(fetchAppointments()),
    postAppointment: (appointment) => dispatch(postAppointment(appointment))
});

export default connect(mapStateToProps, mapDispatchToProps)(SmartPlanningForm);