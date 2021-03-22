import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker, } from '@material-ui/pickers';
import { connect } from 'react-redux';
import { setCurrentView, setCurrentDate } from '../../actions';

const useStyles = makeStyles(theme => ({
    button: {
        color: "#616161"
    }
}));

const ButtonDatePicker = props => {
    const classes = useStyles();
    const currentDate = props.currentDate;
    const currentView = props.currentView;
    const [isOpen, setOpen] = useState(false);

    const handleDatePicked = date => {
        setCurrentDate(date);
        props.setCurrentDate(date);
    }

    const renderButton = () => {
        let dateString = format(props.currentDate, "MMMM yyyy");
        if (currentView === "Day")
            dateString = format(currentDate, "d MMM yyyy");

        const renderArrowDropdownIcon = () => (
            <Hidden smUp>
                <ArrowDropDownIcon />
            </Hidden>
        );

        return (
            <Button endIcon={renderArrowDropdownIcon()} onClick={() => setOpen(true)} className={classes.button}>
                {dateString}
            </Button >
        );
    }

    const renderDatePicker = () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                variant="dialog"
                format="d MMMM yyy"
                value={currentDate}
                onChange={handleDatePicked}
                open={isOpen}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                showTodayButton
            />
        </MuiPickersUtilsProvider>
    );

    if (isOpen)
        return renderDatePicker();
    else
        return renderButton();
};

const mapStateToProps = state => ({
    currentDate: state.calendar.currentDate,
    currentView: state.calendar.currentView
});

const mapDispatchToProps = dispatch => {
    return {
        setCurrentDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
        setCurrentView: (view) => dispatch(setCurrentView(view)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDatePicker);
