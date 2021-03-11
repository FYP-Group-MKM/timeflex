import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import ButtonDatePicker from '../ButtonDatePicker';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate } from '../../actions';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
    }
}));

const DateNavigator = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.currentDate.currentDate);
    const currentView = useSelector(state => state.view.view);

    const handleNavNext = () => {
        let date = new Date(currentDate)
        if (currentView === "Day") {
            date.setDate(date.getDate() + 1);
        }
        if (currentView === "Week") {
            date.setDate(date.getDate() + 7);
        }
        if (currentView === "Month") {
            date.setDate(date.getMonth() + 1);
        }
        dispatch(setCurrentDate(date));
    };

    const handleNavPrev = () => {
        let date = new Date(currentDate)
        if (currentView === 'Day') {
            date.setDate(date.getDate() - 1);
        }
        if (currentView === 'Week') {
            date.setDate(date.getDate() - 7);
        }
        if (currentView === 'Month') {
            date.setMonth(date.getMonth() - 1);
        }
        dispatch(setCurrentDate(date));
    };

    return (
        <div className={classes.root}>
            <Hidden xsDown>
                <IconButton onClick={handleNavPrev}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </Hidden>
            <ButtonDatePicker />
            <Hidden xsDown>
                <IconButton onClick={handleNavNext}>
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Hidden>
        </div >
    );
}

export default DateNavigator;
