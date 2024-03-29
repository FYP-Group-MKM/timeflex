import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import ButtonDatePicker from './ButtonDatePicker';
import { connect } from 'react-redux';
import { setCurrentDate } from '../../actions';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
    }
}));

const DateNavigator = props => {
    const classes = useStyles();
    const currentDate = props.currentDate;
    const currentView = props.currentView;

    const handleNavNext = () => {
        let date = new Date(currentDate);
        if (currentView === "Day") {
            date.setDate(date.getDate() + 1);
        }
        if (currentView === "Week") {
            date.setDate(date.getDate() + 7);
        }
        if (currentView === "Month") {
            date.setMonth(date.getMonth() + 1);
        }
        props.setCurrentDate(date);
    };

    const handleNavPrev = () => {
        let date = new Date(currentDate);
        if (currentView === 'Day') {
            date.setDate(date.getDate() - 1);
        }
        if (currentView === 'Week') {
            date.setDate(date.getDate() - 7);
        }
        if (currentView === 'Month') {
            date.setMonth(date.getMonth() - 1);
        }
        props.setCurrentDate(date);
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
};

const mapStateToProps = state => ({
    currentView: state.calendar.currentView,
    currentDate: state.calendar.currentDate,
});

const mapDispatchToProps = dispatch => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date))
});

export default connect(mapStateToProps, mapDispatchToProps)(DateNavigator);
