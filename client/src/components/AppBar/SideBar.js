import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import { setCurrentView } from '../../actions';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));

const SideBar = props => {
    const classes = useStyles();
    const [isOpen, setOpen] = useState(false);

    const handleDayClicked = (view) => {
        props.setCurrentView(view);
        setOpen(false);
    }

    return (
        <div>
            <IconButton color="#616161" onClick={() => setOpen(true)} edge="start">
                <MenuIcon />
            </IconButton>
            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                classes={{ paper: classes.drawerPaper }}
            >
                <div className={classes.drawerHeader}>
                    <Typography variant="h6" style={{ color: "#616161" }}>
                        TimeFlex
                        </Typography>
                    <IconButton onClick={() => setOpen(false)} style={{ color: '#616161' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="Day View" style={{ color: '#616161' }} onClick={() => handleDayClicked("Day")} value="Day">
                        <ListItemText primary="Day View" />
                    </ListItem>

                    <ListItem button key="Week View" style={{ color: '#616161' }} onClick={() => handleDayClicked("Week")} value="Week">
                        <ListItemText primary="Week View" />
                    </ListItem>

                    <ListItem button key="Month View" style={{ color: '#616161' }} onClick={() => handleDayClicked("Month")} value="Month">
                        <ListItemText primary="Month View" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    setCurrentView: (view) => dispatch(setCurrentView(view))
});

export default connect(null, mapDispatchToProps)(SideBar);