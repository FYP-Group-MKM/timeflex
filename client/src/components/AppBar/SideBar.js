import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useSelector , useDispatch} from 'react-redux'
import {changeView} from '../../redux/actions/index'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
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
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function SideBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleClickDay = () => {
        props.currentViewNameChange("Day")
        dispatch(changeView('Day'))
        props.drawerClose()
    }
    const handleClickWeek = () => {
        props.currentViewNameChange("Week")
        dispatch(changeView('Week'))
        props.drawerClose()
    }

    const handleClickMonth = () => {
        props.currentViewNameChange("Month")
        dispatch(changeView('Month'))
        props.drawerClose()
    }
    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography variant="h6" style={{ color: "#616161" }}>
                        TimeFlex
                    </Typography>
                    {/* <h6>TimeFlex</h6> */}
                    <IconButton onClick={props.handleDrawerClose} style={{ color: '#616161' }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="Day View" style={{ color: '#616161' }} onClick={handleClickDay} value="Day">
                        <ListItemText primary="Day View" />
                    </ListItem>

                    <ListItem button key="Week View" style={{ color: '#616161' }} onClick={handleClickWeek} value="Week">
                        <ListItemText primary="Week View" />
                    </ListItem>

                    <ListItem button key="Month View" style={{ color: '#616161' }} onClick={handleClickMonth} value="Month">
                        <ListItemText primary="Month View" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
