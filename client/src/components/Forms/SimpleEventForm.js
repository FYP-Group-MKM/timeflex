import format from 'date-fns/format';
import React,{useState} from 'react';
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
import FormPicker from './FormPicker';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SmartPlanningForm from './SmartPlanningForm';
import {changeCurrentDate,createFrom} from '../../redux/actions/index'
import {useSelector,useDispatch} from 'react-redux'



const SimpleEventForm = () => {
    const dispatch = useDispatch()
    const openCreate = useSelector(state => state.create.create)
    const currentDate = useSelector(state => state.currentDate.date)
    const [titleEmpty,setTitleEmpty] = useState(false)
    const [simple,setSimple] = useState(true)
    const [recurrence,setStateRecurrence] = useState(false)
    const [recurMenuAnchorEl,setRecurMenuAnchorEl] = useState(null)
    const [simpleAppointment,setSimpleAppointment] = useState({
        title: "",
        allDay: false,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)).setMinutes(0),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)).setMinutes(0),
        rRule: null,
        exDate: null,
        description: null,
    })
    const [smartAppointment,setSmartAppointment] = useState(null)
    
    const refresh = (date) => {
        currentDate ? dispatch(changeCurrentDate(date)): dispatch(changeCurrentDate(new Date()))
        
    }
    
    const handleClose = () => {
        setSimple(true);
        dispatch(createFrom(false))
    }

    const handleSubmit = () => {
        if(!simpleAppointment.title
            || (new Date(simpleAppointment.startDate) < new Date())
            || (new Date (simpleAppointment.startDate) > new Date(simpleAppointment.endDate))){
                if(simpleAppointment.title === null || simpleAppointment.title === ""){
                    setTitleEmpty(true)
                }
                if(new Date(simpleAppointment.startDate) < new Date()){
                    alert("The start date cannot be in the past");
                }
                if(new Date(simpleAppointment.startDate) > new Date(simpleAppointment.endDate)){
                    alert("The start date cannot be later than the end date")
                }
        } else {
            const appointment = {...simpleAppointment}
            if(appointment.allDay){
                appointment.startDate = new Date(appointment.startDate)
                appointment.endDate = new Date (appointment.endDate)
                appointment.startDate = new Date (appointment.startDate).setHours(0);
                appointment.startDate = new Date (appointment.startDate).setMinutes(0);
                appointment.endDate   = new Date (appointment.endDate).setHours(23);
                appointment.endDate   = new Date (appointment.endDate).setMinutes(59);
            }
            fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment)
            });
            refresh();
            handleClose();
            
        }
    }

    const setAllDay = () => {
        let sipAppointment = {...simpleAppointment}
        sipAppointment.allDay = !sipAppointment.allDay
        setSimpleAppointment(sipAppointment)
    }

    const setRecurrence = () => {
        if(recurrence){
            const sipAppointment = {...simpleAppointment}
            sipAppointment.rRule = null;
            sipAppointment.exDate = null;
            setSimpleAppointment = (sipAppointment);
        }
        setStateRecurrence(false)
    }

    const setDivisible = () => {
        const stAppointment = {...smartAppointment}
        stAppointment.divisible = !stAppointment.divisible
        setSmartAppointment(stAppointment)
    }

    const handleTextFieldInput = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        if(simple){
            let sipAppointment = {...simpleAppointment}
            sipAppointment[nam] = val
            setSimpleAppointment(sipAppointment)
        } else {
            const smtAppointment = {...smartAppointment};
            if(nam === "maxSession" || nam === "minSession" || nam === "exDuration") {
                val = parseInt(val);
            } 
            smtAppointment[nam] = val;
            smtAppointment.maxSession = smtAppointment.exDuration
            setSmartAppointment(smtAppointment)
        }
    }

    const handleStartDateInput = (date) => {
        const sipAppointment = {...simpleAppointment};
        sipAppointment.startDate = date;
        sipAppointment.endDate = date;
        setSimpleAppointment(sipAppointment)
    }

    const handleEndDateInput = (date) => {
        const sipAppointment = {...simpleAppointment};
        sipAppointment.endDate = date;
        setSimpleAppointment(sipAppointment)
    }

    const setSmartPlanningForm = () => {
        setSimple(false)
    }

    const setSimpleForm = () => {
        setSimple(true)
    }

    const handleRecurMenuOpen = event => {
        setRecurMenuAnchorEl(event.currentTarget)
    }

    const handleRecurMenuClose = event => {
        const {startDate} = simpleAppointment
        setRecurMenuAnchorEl(null)
        if(event.currentTarget.title) {
            setRecurrence(event.currentTarget.title)
            let rRule = "";
            if(event.currentTarget.title === "Daily") {
                rRule = "FREQ=DAILY;INTERVAL=1";
            }
            if (event.currentTarget.title === "Weekly") {
                let dayOfWeek = format(startDate, "EEEEEE").toUpperCase();
                rRule = `FREQ=WEEKLY;BYDAY=${dayOfWeek};INTERVAL=1`;
            }
            if (event.currentTarget.title === "Monthly") {
                let dayOfMonth = format(startDate, "d");
                rRule = `FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth};INTERVAL=1`;
            }
            const simAppointment = {...simpleAppointment}
            simAppointment.rRule = rRule;
            setSimpleAppointment(simAppointment);
        }
    }

    const renderTitleTextField = () => {
        return (
            <Grid item>
                <TextField
                    autoFocus
                    required
                    error={titleEmpty}
                    helperText={titleEmpty ? "Title required" : ""}
                    name="title"
                    label="Title"
                    onChange={handleTextFieldInput}
                    fullWidth
                />
            </Grid>
        )
    }

    const renderPickers = () => {
        return (
            <Grid item key={simpleAppointment.allDay}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                    <Grid item style={{ minWidth: "55px" }}>
                        <Typography variant="button" style={{ color: "#757575" }}>From</Typography>
                    </Grid>
                    <Grid item>
                        <FormPicker
                            allDay={simpleAppointment.allDay}
                            currentDate={simpleAppointment.startDate}
                            handleFormChange={handleStartDateInput}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                    <Grid item style={{ minWidth: "55px" }}>
                        <Typography variant="button" style={{ color: "#757575" }}>Until</Typography>
                    </Grid>
                    <Grid item>
                        <FormPicker
                            allDay={simpleAppointment.allDay}
                            currentDate={simpleAppointment.endDate}
                            handleFormChange={handleEndDateInput}
                        />
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    const renderOptions = () => {
        return (
            <Grid container="row" justify="flex-start" alignItems="center" style={{ margin: "10px 0" }}>
                <Grid item style={{ marginLeft: "15px" }}>
                    <FormControlLabel
                        control={<Switch color="primary" size="small" onChange={setAllDay} />}
                        label="All day"
                    />
                </Grid>
                <Grid item>
                    <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleRecurMenuOpen}
                        size="small"
                        endIcon={<ArrowDropDownIcon />}
                    >
                        <Typography variant="button">
                            {recurrence ? recurrence : "Doesn't repeat"}
                        </Typography>
                    </Button >
                    <Menu
                        id="simple-menu"
                        anchorEl={recurMenuAnchorEl}
                        keepMounted
                        open={Boolean(recurMenuAnchorEl)}
                        onClose={handleRecurMenuClose}
                    >
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
                </Grid>
            </Grid>
        );
    }
    
    const renderSmartPlanningButton = () => {
        return (
            <Grid item>
                <Tooltip title="Find a timeslot for a task that does not have a fixed one" placement="top">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={setSmartPlanningForm}
                        style={{ margin: "10px 0px" }}
                    >
                        Smart Planning
                    </Button>
                </Tooltip>
            </Grid>
        );
    }

    const renderDescriptionTextField = () => {
        return (
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
        );
    }
    
    const renderSimpleForm = () => {
        return (
            <>
                <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
                <DialogContent style={{ minHeight: "300px" }}>
                    <form autoComplete="off">
                        <Grid container direction="column" spacing={2} justify="space-evenly">
                            {this.renderTitleTextField()}
                            {this.renderPickers()}
                            {this.renderOptions()}
                            {this.renderSmartPlanningButton()}
                            {this.renderDescriptionTextField()}
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={this.handleSubmit} color="primary" disableElevation>
                        Save
                    </Button>
                </DialogActions>
            </ >
        );
    }
    
    let formLayout = renderSimpleForm()
    if(!simple){
        formLayout = <SmartPlanningForm onClose={handleClose} refresh={refresh} />;
    }

    return (
        
        <Dialog
                aria-labelledby="form-dialog-title"
                open={openCreate}
                onClose={handleClose}
                fullWidth maxWidth="xs"
            >
                {formLayout}
        </Dialog>
    )
}

export default SimpleEventForm
