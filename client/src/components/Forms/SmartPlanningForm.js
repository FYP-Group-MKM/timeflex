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

class SmartPlanningForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            titleEmpty: false,
            exDurationEmpty: false,
            minSessionEmpty: false,
            maxSessionEmpty: false,
            smartAppointment: {
                title: "",
                deadline: new Date().setDate(new Date().getDate() + 1),
                exDuration: null,
                divisible: true,
                minSession: 1,
                maxSession: null,
                description: ""
            }
        };
    }

    handleSubmit = () => {
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
                ...this.state.smartAppointment
            };
            fetch('/api/smartplanning', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment)
            });
            this.onClose();
        }
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
        smartAppointment.maxSession = smartAppointment.exDuration;
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

export default SmartPlanningForm;