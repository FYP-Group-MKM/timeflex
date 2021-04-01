import 'fontsource-roboto';
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import Calendar from './components/Calendar/Calendar';
import Dropdown from './components/AppBar/Dropdown';
import DateNavigator from './components/AppBar/DateNavigator';
import SimpleEventForm from './components/Forms/SimpleEventForm';
import SideBar from './components/AppBar/SideBar';
import { makeStyles } from '@material-ui/core/styles';
import { fetchAppointments, setCurrentDate, setSimpleEventForm } from './actions';
import { connect } from 'react-redux';
import styles from './style.css';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    login: {
        margin: "auto"
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
        marginRight: "16px"
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

    const TimeFlex = () => {
        return (
            <div className={`${classes.root} ${styles}`}>
                <AppBar color="inherit" className={classes.appbar}>
                    <Toolbar variant="dense" >
                        <Hidden smUp>
                            <SideBar />
                        </Hidden>
                        <Hidden xsDown>
                            <Link className={classes.title} underline="none" onClick={props.fetchAppointments}>
                                <Typography variant="h6">
                                    TimeFlex
                            </Typography>
                            </Link>
                        </Hidden>
                        <DateNavigator className={classes.dateNavigator} />
                        <Hidden xsDown>
                            <Button onClick={() => props.navigateToday()} className={classes.todayButton}>Today</Button>
                            <Dropdown />
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <div style={{ height: "50px" }} />
                <Calendar />
                <SimpleEventForm />
                <Tooltip title="Create Event" placement="left" aria-label="add">
                    <Fab className={classes.fab} color="primary" onClick={props.setSimpleEventForm}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </div >
        );
    }

    const LoginPage = () => {
        return <Button onClick={() => window.open("http://localhost:5000/auth/google", "_self")} className={classes.login}>Login</Button>
    }

    // if (props.authenticated)
    //     return <TimeFlex />;
    // return <LoginPage />;

    return <TimeFlex />
};

const mapStateToProps = state => ({
    authenticated: state.data.authenticated,
})

const mapDispatchToProps = dispatch => ({
    navigateToday: () => dispatch(setCurrentDate(new Date())),
    setSimpleEventForm: () => dispatch(setSimpleEventForm(true)),
    fetchAppointments: () => dispatch(fetchAppointments())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
