import 'fontsource-roboto';
import googleIcon from './assets/google.png';
import HKULogo from './assets/HKU.jpg';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from '@material-ui/icons/Add';
import Calendar from './components/Calendar/Calendar';
import Dropdown from './components/AppBar/Dropdown';
import DateNavigator from './components/AppBar/DateNavigator';
import AppointmentForm from './components/Forms/AppointmentForm/AppointmentForm';
import SideBar from './components/AppBar/SideBar';
import { makeStyles } from '@material-ui/core/styles';
import { fetchAppointments, setCurrentDate, setSimpleEventForm, setUser } from './actions';
import { connect } from 'react-redux';
import styles from './style.css';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "98vh"
    },
    login: {
        margin: "auto",
        width: "350px",
        height: "400px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    loginTitle: {
        color: "#616161",
        textAlign: "center"
    },
    hkuLogo: {
        width: "150px"
    },
    loginButton: {
        width: "210px",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    loginButtonIcon: {
        height: "18px",
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    appbar: {
        overflow: "hidden"
    },
    title: {
        flexGrow: 1,
        color: "#616161",
        display: "flex",
        alignItems: "baseline"
    },
    todayButton: {
        color: "#616161",
        marginRight: "12px"
    },
    logoutButton: {
        color: "#616161",
    },
    fab: {
        position: "fixed",
        bottom: 25,
        right: 25,
        zIndex: 1,
    },
}));

const App = props => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [snackbarIsOpen, setSnackbar] = useState(false);

    useEffect(async () => {
        await fetch("http://localhost:5000/auth/login/success", { credentials: 'include' })
            .then(res => res.json())
            .then(user => { if (user.googleId) props.setUser(user) })
            .then(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        window.open("http://localhost:5000/auth/logout", "_self");
    };

    const handleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    };

    const TimeFlex = () => {
        return (
            <div className={styles}>
                <AppBar color="inherit" className={classes.appbar}>
                    <Toolbar variant="dense" >
                        <Hidden smUp>
                            <SideBar />
                        </Hidden>
                        <Hidden xsDown>
                            <Link className={classes.title} underline="none" onClick={props.fetchAppointments}>
                                <Typography variant="h6">TimeFlex</Typography>
                            </Link>
                        </Hidden>
                        <DateNavigator className={classes.dateNavigator} />
                        <Hidden xsDown>
                            <Button onClick={() => props.navigateToday()} className={classes.todayButton}>Today</Button>
                            <Dropdown />
                        </Hidden>
                        <Button onClick={handleLogout} className={classes.logoutButton}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <div style={{ height: "50px" }} />
                <Calendar />
                <AppointmentForm popSnackbar={() => setSnackbar(true)} />
                <Tooltip title="Create Event" placement="left" aria-label="add">
                    <Fab className={classes.fab} color="primary" onClick={props.setSimpleEventForm}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                    open={snackbarIsOpen}
                    autoHideDuration={1000}
                    onClose={() => setSnackbar(false)}
                    message="No suggestion available"
                />
            </div >
        );
    }

    const LoginPage = () => {
        return (
            <Paper className={classes.login} variant="outlined">
                <div>
                    <Typography variant="h4" className={classes.loginTitle}>TimeFlex</Typography>
                    <Typography variant="subtitle2" className={classes.loginTitle}>Calendar designed for HKU academia</Typography>
                </div>
                <img src={HKULogo} alt="" className={classes.hkuLogo} />
                <div className={classes.buttonGroup}>
                    <Button onClick={handleLogin} variant="outlined" className={classes.loginButton} >
                        <img src={googleIcon} alt="" className={classes.loginButtonIcon} />
                        Sign in with Google
                    </Button>
                    <Typography variant="caption">*Only available to HKU Connect accounts</Typography>
                </div>
            </Paper>
        );
    }

    return (
        <div className={classes.root}>
            <Router>
                <Route exact path="/">
                    {props.user.googleId ? <Redirect to="/calendar" /> : <Redirect to="/login" />}
                </Route>
                <Route path="/calendar">
                    {loading ? null : (props.user.googleId ? <TimeFlex /> : <Redirect to="/login" />)}
                </Route>
                <Route path="/login">
                    {props.user.googleId ? <Redirect to="/calendar" /> : <LoginPage />}
                </Route>
            </Router>
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.data.user,
})

const mapDispatchToProps = dispatch => ({
    navigateToday: () => dispatch(setCurrentDate(new Date())),
    setSimpleEventForm: () => dispatch(setSimpleEventForm(true)),
    fetchAppointments: () => dispatch(fetchAppointments()),
    setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
