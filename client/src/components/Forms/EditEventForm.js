import React, { Component, Fragment } from 'react';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux'
import { fetchAppointments, editAppointment, setCurrentDate } from '../../actions'

class EditEventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDay: false,
            error: false,
            id: this.props.editDataId,
            editData: {}
        };
    }

    componentDidMount() {
        fetch('/appointments/' + this.props.googleId + '/' + this.state.id)
            .then(res => res.json())
            .then(data => this.setState({
                editData: {
                    ...data,
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate)
                }
            }))
            .catch(error => console.log(error.message));
    }

    checkPast = () => {
        if (new Date(this.state.editData.startDate) < new Date()) {
            return true;
        }
        return false;
    }

    handleSubmit = async () => {
        if (this.state.editData.title === null || this.state.editData.title === "") {
            this.setState({ error: true });
        } else if (this.state.editData.startDate > this.state.editData.endDate) {
            alert("The start date cannot be later than the end date");
        } else {
            this.setState({ error: false });
            // this.props.editAppointment(this.state.editData);
            await fetch('/appointments/' + this.props.googleId + '/' + this.state.editData.appointmentId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.editData)
            })
            setTimeout(this.props.fetchAppointments, 50);
            this.props.onClose();
        }
    }

    setAllDay = () => {
        this.setState({
            allDay: this.state.allDay ? false : true
        });
    }

    handleTextFieldInput = (event) => {
        if (!this.checkPast()) {
            let nam = event.target.name;
            let val = event.target.value;
            let editData = {
                ...this.state.editData,
                [nam]: val
            }
            this.setState({ editData });
        }
    }

    handleStartDateInput = (date) => {
        let editData = {
            ...this.state.editData,
            startDate: new Date(date)
        }
        if (new Date(editData.startDate) > new Date(editData.endDate)) {
            editData.endDate = editData.startDate;
        }
        this.setState({ editData });
    }

    handleEndDateInput = (date) => {
        let editData = {
            ...this.state.editData,
            endDate: date
        }
        this.setState({ editData });
    }

    renderForm = () => {
        return (
            <form autoComplete="off">
                <Grid container direction="column" spacing={2} justify="space-evenly">
                    <Grid item>
                        <TextField
                            required
                            error={this.state.error}
                            helperText={this.state.error ? "Title required" : ""}
                            name="title"
                            label="Title"
                            disabled={this.checkPast()}
                            defaultValue={this.state.editData.title}
                            onChange={this.handleTextFieldInput}
                            fullWidth
                        />
                    </Grid>
                    <Grid item key={this.state.allDay}>
                        {this.state.allDay
                            ? <div label="allDay">
                                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                    <Grid item style={{ minWidth: "55px" }}>
                                        <Typography variant="body2" style={{ color: "#616161" }}>From</Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormDatePicker currentDate={this.state.editData.startDate} handleFormChange={this.handleStartDateInput} allDay />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                    <Grid item style={{ minWidth: "55px" }}>
                                        <Typography variant="body2" style={{ color: "#616161" }}>Until</Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormDatePicker currentDate={this.state.editData.endDate} handleFormChange={this.handleEndDateInput} allDay />
                                    </Grid>
                                </Grid>
                            </div>
                            : <div label="NonAllDay">
                                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                    <Grid item style={{ minWidth: "55px" }}>
                                        <Typography variant="body2" style={{ color: "#616161" }}>From</Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormDatePicker
                                            currentDate={this.state.editData.startDate}
                                            handleFormChange={this.handleStartDateInput}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                    <Grid item style={{ minWidth: "55px" }}>
                                        <Typography variant="body2" style={{ color: "#616161" }}>Until</Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormDatePicker
                                            currentDate={this.state.editData.endDate}
                                            handleFormChange={this.handleEndDateInput}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        }
                    </Grid>
                    {!this.checkPast()
                        ? <Grid container direction="row" justify="flex-start" style={{ margin: "10px 0" }}>
                            <Grid item style={{ marginLeft: "10px" }}>
                                <FormControlLabel
                                    value="start"
                                    control={<Switch color="primary" size="small" onChange={this.setAllDay} />}
                                    label="All day"
                                />
                            </Grid>
                            <Grid item style={{ marginLeft: "10px" }}>
                                <FormControlLabel
                                    value="start"
                                    control={<Switch color="primary" size="small" />}
                                    label="Repeat"
                                />
                            </Grid>
                        </Grid>
                        : null
                    }
                    <Grid item>
                    </Grid>
                    <Grid item>
                        <TextField
                            name="description"
                            label="Description"
                            variant="outlined"
                            disabled={this.checkPast()}
                            defaultValue={this.state.editData.description ? this.state.editData.description : " "}
                            onChange={this.handleTextFieldInput}
                            multiline rows="2"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </form>
        );
    }

    render() {
        return (
            <Dialog
                aria-labelledby="form-dialog-title"
                open={true}
                onClose={this.props.onClose}
                fullWidth maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">Edit Event</DialogTitle>
                {
                    this.state.editData.startDate
                        ? <DialogContent style={{ minHeight: "300px" }}>{this.renderForm()}</DialogContent>
                        : <LinearProgress />
                }
                <DialogActions>
                    {!this.checkPast()
                        ? <Fragment>
                            <Button onClick={this.props.onClose} color="primary">
                                Cancel
                        </Button>
                            <Button variant="contained" onClick={this.handleSubmit} color="primary" disableElevation>
                                Save
                        </Button>
                        </Fragment>
                        : <Button variant="contained" onClick={this.props.onClose} color="primary">
                            Done
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    currentDate: state.calendar.currentDate,
    googleId: state.data.user.googleId,
});

const mapDispatchToProps = dispatch => ({
    setCurrentDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
    fetchAppointments: () => dispatch(fetchAppointments()),
    editAppointment: (appointment) => dispatch(editAppointment(appointment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm);
