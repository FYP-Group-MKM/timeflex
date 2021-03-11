import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { setCurrentView } from '../../actions'

const useStyles = makeStyles(theme => ({
    menuItem: {
        color: "#616161"
    },
    button: {
        color: "#616161"
    }
}));

const Dropdown = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const currentView = props.currentView;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event) => {
        setAnchorEl(null);
        if (event.currentTarget.title) {
            setCurrentView(event.currentTarget.title);
        }
    }


    return (
        <div className={classes.root}>
            <Button onClick={handleClick} endIcon={<ArrowDropDownIcon />} className={classes.button}>
                {currentView}
            </Button >
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                keepMounted
            >
                <MenuItem title="Day" onClick={handleClose} className={classes.menuItem}>Day</MenuItem>
                <MenuItem title="Week" onClick={handleClose} className={classes.menuItem}>Week</MenuItem>
                <MenuItem title="Month" onClick={handleClose} className={classes.menuItem}>Month</MenuItem>
            </Menu>
        </div>
    )
}

const mapStateToProps = state => ({
    currentView: state.calendar.currentView
});

const mapDispatchToProps = dispatch => ({
    setCurrentView: (view) => dispatch(setCurrentView(view))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
