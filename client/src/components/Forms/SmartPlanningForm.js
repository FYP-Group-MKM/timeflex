import React, { Component } from 'react';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import addWeeks from 'date-fns/addWeeks';
import setHours from 'date-fns/setHours';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FormDatePicker from './FormDatePicker';
import { connect } from 'react-redux';
import { fetchAppointments, postAppointment } from '../../actions';

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
    const validity = props.validity;
    const setValidity = props.validity;

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
                <div className={classes.numberTextFieldRow}>
                    <TextField
                        label="Duration (hours)"
                        name="exDuration"
                        type="number"
                        value={appointment.exDuration ? appointment.exDuration : null}
                        error={props.validity.exDurationIsEmpty}
                        helperText={props.validity.exDurationIsEmpty ? "Required" : ""}
                        onChange={handleTextFieldInput}
                        InputLabelProps={{ shrink: true }}
                        className={classes.numberTextField}
                    />
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


class SmartPlanning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // open: true,
            // snackbar: false,
            smartAppointment: {
                googleId: this.props.googleId,
                title: "",
                deadline: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(23)).setMinutes(59),
                exDuration: null,
                divisible: true,
                minSession: 1,
                maxSession: null,
                description: ""
            },
            validity: {
                titleEmpty: false,
                exDurationEmpty: false,
                deadlineLegit: true,
                minSessionEmpty: false,
                maxSessionEmpty: false,
            }
        };
    }

    handleSubmit = async () => {
        if (this.checkValid()) {
            const appointmentRequest = {
                type: "smart",
                appointment: { ...this.state.smartAppointment }
            };
            await fetch('/appointments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentRequest)
            }).then((res) => {
                if (res.status === 200)
                    this.props.fetchAppointments();
                if (res.status === 404)
                    this.setState({ snackbar: true });
            });
            this.onClose();
        }
    }

    checkValid = () => {
        const { title, deadline, exDuration, divisible, minSession, maxSession } = this.state.smartAppointment;
        const validity = { ...this.state.validity };

        if (!title)
            validity.titleEmpty = true;
        if (deadline < new Date()) {
            validity.deadlineLegit = false;
            alert("The deadline must be in the future");
        }
        if (!exDuration)
            validity.exDurationEmpty = true;
        if (divisible && !maxSession)
            validity.maxSessionEmpty = true;
        if (divisible && !minSession)
            validity.minSessionEmpty = true;

        this.setState({ validity });

        for (const requirement in validity) {
            if (!requirement)
                return false;
        }
        return true;
    }

    onClose = () => {
        this.setState({ open: false });
        this.props.onClose();
    }

    setDivisible = () => {
        let smartAppointment = { ...this.state.smartAppointment };
        smartAppointment.divisible = !smartAppointment.divisible;
        this.setState({ smartAppointment });
    }

    handleTextFieldInput = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let smartAppointment = { ...this.state.smartAppointment };
        if (nam === "maxSession" || nam === "minSession" || nam === "exDuration") {
            val = parseInt(val);
        }
        smartAppointment[nam] = val;
        // smartAppointment.maxSession = smartAppointment.exDuration;
        this.setState({ smartAppointment });
    }

    handleSmartDeadlineInput = deadline => {
        let smartAppointment = { ...this.state.smartAppointment };
        smartAppointment.deadline = deadline;
        this.setState({ smartAppointment });
    }

    renderSmartPlanningForm = () => {
        return (
            <div>
                <DialogTitle id="form-dialog-title">Smart Planning</DialogTitle>
                <DialogContent style={{ minHeight: "300px" }}>
                    <Typography variant="body2" style={{ marginBottom: "10px" }}>
                        Pleaese provide the following information for TimeFlex to generate suggested timeslot(s).
                    </Typography>
                    <form autoComplete="off">
                        <Grid container direction="column" spacing={2} justify="space-evenly">
                            <Grid item>
                                <TextField
                                    autoFocus
                                    required
                                    error={this.state.titleEmpty}
                                    helperText={this.state.titleEmpty ? "Required" : ""}
                                    name="title"
                                    label="Title"
                                    onChange={this.handleTextFieldInput}
                                    fullWidth
                                />
                            </Grid>
                            <Grid container direction="row" alignItems="baseline" justify="flex-start" spacing={2}>
                                <Grid item style={{ minWidth: "55px", margin: "0 8px" }}>
                                    <Typography variant="caption" style={{ color: "#757575" }}>Deadline</Typography>
                                </Grid>
                                <Grid item>
                                    <FormDatePicker currentDate={this.state.smartAppointment.deadline} handleFormChange={this.handleSmartDeadlineInput} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-number"
                                    label="Duration (hours)"
                                    name="exDuration"
                                    error={this.state.exDurationEmpty}
                                    helperText={this.state.exDurationEmpty ? "Required" : ""}
                                    type="number"
                                    onChange={this.handleTextFieldInput}
                                    InputLabelProps={{ shrink: true }}
                                    style={{ margin: "10px 0" }}
                                />
                            </Grid>
                            <Grid item style={{ marginLeft: "6px" }}>
                                <FormControlLabel
                                    control={<Switch color="primary" size="small" checked={this.state.smartAppointment.divisible} onChange={this.setDivisible} />}
                                    label="Divsible"
                                />
                            </Grid>
                            {
                                this.state.smartAppointment.divisible
                                    ? <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                        <Grid item style={{ maxWidth: "110px", marginLeft: "8px" }}>
                                            <Tooltip title="Minimum hours per day" placement="top">
                                                <TextField
                                                    id="standard-number"
                                                    label="Min. hours"
                                                    name="minSession"
                                                    defaultValue={this.state.smartAppointment.minSession}
                                                    error={this.state.minSessionEmpty}
                                                    helperText={this.state.minSessionEmpty ? "Required" : ""}
                                                    type="number"
                                                    onChange={this.handleTextFieldInput}
                                                    InputLabelProps={{ shrink: true }}
                                                    style={{ margin: "10px 0" }}
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item style={{ maxWidth: "110px", marginLeft: "8px" }}>
                                            <Tooltip title="Maximum hours per day" placement="top">
                                                <TextField
                                                    key={this.state.smartAppointment.exDuration}
                                                    id="standard-number"
                                                    label="Max. hours"
                                                    type="number"
                                                    name="maxSession"
                                                    error={this.state.maxSessionEmpty}
                                                    helperText={this.state.maxSessionEmpty ? "Required" : ""}
                                                    onChange={this.handleTextFieldInput}
                                                    InputLabelProps={{ shrink: true }}
                                                    style={{ margin: "10px 0" }}
                                                />
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    : null
                            }
                            <Grid item style={{ margin: "15px 0" }}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    variant="outlined"
                                    defaultValue=" "
                                    onChange={this.handleFormChange}
                                    multiline rows="2"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClose} color="primary">
                        Cancel
                        </Button>
                    <Button variant="contained" onClick={this.handleSubmit} color="primary" disableElevation>
                        Find a time
                    </Button>
                </DialogActions>
            </div >
        );
    }

    render() {
        return (
            <div>
                <Dialog
                    aria-labelledby="form-dialog-title"
                    open={this.state.open}
                    onClose={this.onClose}
                    fullWidth maxWidth="xs"
                >
                    {this.renderSmartPlanningForm()}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    googleId: state.data.user.googleId,
});

const mapDispatchToProps = dispatch => ({
    fetchAppointments: () => dispatch(fetchAppointments()),
    postAppointment: (appointment) => dispatch(postAppointment(appointment))
});

export default connect(mapStateToProps, mapDispatchToProps)(SmartPlanningForm);