import React, { Component } from 'react';
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
import FormPicker from './FormPicker';

class CreateEventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.open,
            error: false,
            simple: true,
            simpleAppointment: {
                title: "",
                allDay: false,
                startDate: this.props.currentDate,
                endDate: this.props.currentDate,
                description: null,
            },
            smartAppointment: {
                title: "",
                deadline: new Date(),
                exDuration: null,
                divisible: true,
                minSession: 60,
                maxSession: null,
                cushion: 0,
                preference: null,
                description: ""
            }
        };
    }

    handleClose = () => {
        this.props.onHide();
    }

    handleSubmit = () => {
        console.log(this.state.simpleAppointment.startDate);
        console.log(this.state.simpleAppointment.endDate);
        if (this.state.simpleAppointment.title === null || this.state.simpleAppointment.title === "") {
            this.setState({ error: true });
        } else if (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate)) {
            alert("The start date cannot be later than the end date");
        } else {
            this.setState({ error: false });
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
            let smartAppointment = { ...this.state.simpleAppointment };
            smartAppointment[nam] = val;
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

    handleSmartDeadlineInput = deadline => {
        let smartAppointment = { ...this.state.smartAppointment };
        smartAppointment.deadline = deadline;
        this.setState({ smartAppointment });
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
                                    error={this.state.error}
                                    helperText={this.state.error ? "Title required" : ""}
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
                                    error={this.state.error}
                                    helperText={this.state.error ? "Title required" : ""}
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
                                    <FormPicker currentDate={this.state.smartAppointment.deadline} handleFormChange={this.handleSmartDeadlineInput} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-number"
                                    label="Duration (hours)"
                                    type="number"
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
                                            <Tooltip title="Minimum hours of a divided session" placement="top">
                                                <TextField
                                                    id="standard-number"
                                                    label="Min. hours"
                                                    type="number"
                                                    InputLabelProps={{ shrink: true }}
                                                    style={{ margin: "10px 0" }}
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item style={{ maxWidth: "110px", marginLeft: "8px" }}>
                                            <Tooltip title="Maximum hours of a divided session" placement="top">
                                                <TextField
                                                    id="standard-number"
                                                    label="Max. hours"
                                                    type="number"
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
                    <Button onClick={this.handleClose} color="primary">
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
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    fullWidth maxWidth="xs"
                >
                    {this.state.simple
                        ? this.renderSimpleForm()
                        : this.renderSmartPlanningForm()
                    }
                </Dialog>
            </div>
        );
    }
}

export default CreateEventForm;