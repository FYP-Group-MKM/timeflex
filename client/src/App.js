import 'fontsource-roboto';
import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { ThemeProvider } from '@material-ui/core/styles';
import Calendar from './components/Calendar/Calendar';
import Dropdown from './components/AppBar/Dropdown';
import DateNavigator from './components/AppBar/DateNavigator';
import SimpleEventForm from './components/Forms/SimpleEventForm';
import SideBar from './components/AppBar/SideBar';
import { makeStyles } from '@material-ui/core/styles';
import { setCurrentDate, setSimpleEventForm, switch_Drawer } from './actions';
import { connect } from 'react-redux';
import styles from './style.css';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
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

    return (
        <div className={`${classes.root} ${styles}`}>
            <AppBar color="inherit">
                <Toolbar variant="dense">
                    <Typography variant="h6" className={classes.title}>
                        TimeFlex
                    </Typography>
                    <DateNavigator className={classes.dateNavigator} />
                    <Button onClick={() => props.navigateToday()} className={classes.todayButton}>Today</Button>
                    <Dropdown />
                </Toolbar>
            </AppBar>
            <SideBar />
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
};


const mapDispatchToProps = dispatch => ({
    navigateToday: () => dispatch(setCurrentDate(new Date())),
    setSimpleEventForm: () => dispatch(setSimpleEventForm(true))
});

export default connect(null, mapDispatchToProps)(App);
