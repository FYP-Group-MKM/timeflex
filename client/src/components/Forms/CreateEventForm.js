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
            titleEmpty: false,
            exDurationEmpty: false,
            minSessionEmpty: false,
            maxSessionEmpty: false,
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
                minSession: 1,
                maxSession: null,
                cushion: 0,
                description: ""
            }
        };
    }

    handleClose = () => {
        this.props.onHide();
    }

    handleSubmit = () => {
        if (this.state.simple) {
            if (this.state.simpleAppointment.title === null || this.state.simpleAppointment.title === "") {
                this.setState({ titleEmpty: true });
            } else if (new Date(this.state.simpleAppointment.startDate) > new Date(this.state.simpleAppointment.endDate)) {
                alert("The start date cannot be later than the end date");
            } else {
                let appointment = {
                    type: "simple",
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
        } else {
            if (!(this.state.smartAppointment.title && this.state.smartAppointment.deadline && this.state.smartAppointment.exDuration)) {
                if (this.state.smartAppointment.title === null || this.state.smartAppointment.title === "") {
                    this.setState({ titleEmpty: true });
                }
                if (this.state.smartAppointment.deadline < new Date()) {
                    alert("The deadline cannot be earlier than this moment");
                }
                if (this.state.smartAppointment.exDuration === null) {
                    this.setState({ exDurationEmpty: true });
                }
            } else if (this.state.smartAppointment.divisible && !(this.state.smartAppointment.minSession || this.state.smartAppointment.maxSession)) {
                if (this.state.smartAppointment.minSession === null) {
                    this.setState({ minSessionEmpty: true });
                }
                if (this.state.smartAppointment.maxSession === null) {
                    this.setState({ maxSessionEmpty: true });
                }
                console.log("testing")
            } else {
                let appointment = {
                    type: "smart",
                    ...this.state.smartAppointment
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
                                    <FormPicker currentDate={this.state.smartAppointment.deadline} handleFormChange={this.handleSmartDeadlineInput} />
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
                                            <Tooltip title="Minimum hours of a divided session" placement="top">
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
                                            <Tooltip title="Maximum hours of a divided session" placement="top">
                                                <TextField
                                                    key={this.state.smartAppointment.exDuration}
                                                    id="standard-number"
                                                    label="Max. hours"
                                                    type="number"
                                                    name="maxSession"
                                                    defaultValue={this.state.smartAppointment.exDuration}
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