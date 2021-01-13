import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FormPicker from './FormPicker';
import SmartPlanningForm from './SmartPlanningForm';

class CreateEventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            titleEmpty: false,
            exDurationEmpty: false,
            minSessionEmpty: false,
            maxSessionEmpty: false,
            simple: true,
            simpleAppointment: {
                title: "",
                allDay: false,
                startDate: new Date().setHours(new Date().getHours() + 1),
                endDate: new Date().setHours(new Date().getHours() + 2),
                description: null,
            },
        };
    }

    handleClose = () => {
        this.setState({ simple: true });
        this.props.onHide();
    }

    handleSubmit = () => {
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
        } else {
            let appointment = {
                ...this.state.simpleAppointment
            };
            fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment)
            });
            this.props.refresh();
            this.handleClose();
        }
    }

    setAllDay = () => {
        let simpleAppointment = { ...this.state.simpleAppointment };
        simpleAppointment.allDay = !simpleAppointment.allDay;
        this.setState({ simpleAppointment });
    }

    setDivisible = () => {
        let smartAppointment = { ...this.state.smartAppointment };
        smartAppointment.divisible = !smartAppointment.divisible;
        this.setState({ smartAppointment });
    }

    handleTextFieldInput = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        if (this.state.simple) {
            let simpleAppointment = { ...this.state.simpleAppointment };
            simpleAppointment[nam] = val;
            this.setState({ simpleAppointment });
        } else {
            let smartAppointment = { ...this.state.smartAppointment };
            if (nam === "maxSession" || nam === "minSession" || nam === "exDuration") {
                val = parseInt(val);
            }
            smartAppointment[nam] = val;
            smartAppointment.maxSession = smartAppointment.exDuration;
            this.setState({ smartAppointment });
        }
    }

    handleStartDateInput = (date) => {
        let simpleAppointment = { ...this.state.simpleAppointment };
        simpleAppointment.startDate = date;
        simpleAppointment.endDate = date;
        this.setState({ simpleAppointment });
    }

    handleEndDateInput = (date) => {
        let simpleAppointment = { ...this.state.simpleAppointment };
        simpleAppointment.endDate = date;
        this.setState({ simpleAppointment });
    }

    setSmartPlanningForm = () => {
        this.setState({ simple: false });
    }

    setSimpleForm = () => {
        this.setState({ simple: true });
    }

    renderSimpleForm = () => {
        return (
            <div>
                <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
                <DialogContent style={{ minHeight: "300px" }}>
                    <form autoComplete="off">
                        <Grid container direction="column" spacing={2} justify="space-evenly">
                            <Grid item>
                                <TextField
                                    autoFocus
                                    required
                                    error={this.state.titleEmpty}
                                    helperText={this.state.titleEmpty ? "Title required" : ""}
                                    name="title"
                                    label="Title"
                                    onChange={this.handleTextFieldInput}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item key={this.state.allDay}>
                                {
                                    this.state.allDay
                                        ? <div label="allDay">
                                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                                <Grid item style={{ minWidth: "55px" }}>
                                                    <Typography variant="caption" style={{ color: "#757575" }}>From</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <FormPicker currentDate={this.state.simpleAppointment.startDate} handleFormChange={this.handleStartDateInput} allDay />
                                                </Grid>
                                            </Grid>
                                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                                <Grid item style={{ minWidth: "55px" }}>
                                                    <Typography variant="caption" style={{ color: "#757575" }}>Until</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <FormPicker currentDate={this.state.simpleAppointment.endDate} handleFormChange={this.handleEndDateInput} allDay />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        : <div label="NonAllDay">
                                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                                <Grid item style={{ minWidth: "55px" }}>
                                                    <Typography variant="caption" style={{ color: "#757575" }}>From</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <FormPicker currentDate={this.state.simpleAppointment.startDate} handleFormChange={this.handleStartDateInput} />
                                                </Grid>
                                            </Grid>
                                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                                <Grid item style={{ minWidth: "55px" }}>
                                                    <Typography variant="caption" style={{ color: "#757575" }}>Until</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <FormPicker key={this.state.simpleAppointment.endDate} currentDate={this.state.simpleAppointment.endDate} handleFormChange={this.handleEndDateInput} />
                                                </Grid>
                                            </Grid>
                                        </div>
                                }
                            </Grid>
                            {/* <Grid container="row" justify="flex-start" style={{ margin: "10px 0" }}>
                                <Grid item style={{ marginLeft: "15px" }}>
                                    <FormControlLabel
                                        control={<Switch color="primary" size="small" onChange={this.setAllDay} />}
                                        label="All day"
                                    />
                                </Grid>
                                <Grid item style={{ marginLeft: "10px" }}>
                                    <FormControlLabel
                                        control={<Switch color="primary" size="small" />}
                                        label="Repeat"
                                    />
                                </Grid>
                            </Grid> */}
                            <Grid item>
                                <Tooltip title="Find a timeslot for a task that does not have a fixed one" placement="top">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={this.setSmartPlanningForm}
                                        style={{ margin: "10px 0px" }}
                                    >
                                        Smart Planning
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item style={{ margin: "10px 0" }}>
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
                </DialogContent >
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                    <Button variant="contained" onClick={this.handleSubmit} color="primary" disableElevation>
                        Save
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
                    onClose={this.handleClose}
                    fullWidth maxWidth="xs"
                >
                    {this.state.simple
                        ? this.renderSimpleForm()
                        : <SmartPlanningForm onClose={this.handleClose} refresh={this.props.refresh} />
                    }
                </Dialog>
            </div>
        );
    }
}

export default CreateEventForm;