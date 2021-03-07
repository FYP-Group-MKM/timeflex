import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
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
import theme from './components/theme';
import 'fontsource-roboto';
import {changeCurrentDate,switch_Drawer,createForm} from './redux/actions/index'
import {useSelector,useDispatch} from 'react-redux'
const styles = {
    fab: {
        position: "absolute",
        bottom: 25,
        right: 25,
        zIndex: 1,
    },
};


const App = (props) => {
    const dispatch = useDispatch()
    const currentDate = useSelector(state => state.currentDate.date)
    const currentView = useSelector(state => state.view.view)
    // const drawerOpen = useSelector(state => state.drawer.drawer)
    const create = useSelector(state => state.create.create)
    
    return (
        <div>
                <header>
                    <ThemeProvider theme={theme}>
                        <AppBar color="inherit" elevation={1}>
                            <Toolbar variant="dense">
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justify="space-between"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Hidden xsDown>
                                            <Typography variant="h6" style={{ color: "#616161" }}>
                                                TimeFlex
                                            </Typography>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Grid container direction="row" alignItems="center">
                                                <Grid item>
                                                    <IconButton style={{ color: '#848485' }}
                                                        color="inherit"
                                                        aria-label="open drawer"
                                                        onClick={() => dispatch(switch_Drawer(true))}
                                                        edge="start"
                                                    >
                                                        <MenuIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <DateNavigator
                                                        // key={currentDate + currentView}
                                                        />
                                                </Grid>
                                            </Grid>
                                        </Hidden>
                                    </Grid>
                                    <Grid item>
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            <Hidden xsDown>
                                                <Grid item>
                                                    <DateNavigator
                                                        key={currentDate + currentView} 
                                                        />
                                                </Grid>
                                            </Hidden>
                                            <Grid item>
                                                <Hidden xsDown>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => dispatch(changeCurrentDate(new Date()))}
                                                    >
                                                        Today
                                                    </Button>
                                                </Hidden>
                                                <Hidden smUp>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: "#616161" }}
                                                        onClick={() => dispatch(changeCurrentDate(new Date()))}
                                                    >
                                                        Today
                                                    </Button>
                                                </Hidden>
                                            </Grid>
                                            <Grid item>
                                                <Hidden xsDown>
                                                    <Dropdown
                                                        key={currentView}
                                                        // currentViewName={this.state.currentViewName}
                                                        // currentViewNameChange={this.currentViewNameChange}
                                                    />
                                                </Hidden>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </ThemeProvider>
                </header>
                <body style={{ margin: "0px" }}>
                    <ThemeProvider theme={theme}>
                        <div style={{ marginTop: "60px" }} />
                        <SimpleEventForm
                            key={create}
                            // open={this.state.create}
                            // currentDate={this.state.currentDate}
                            // refresh={this.refresh}
                            // onHide={this.hideCreateForm}
                        />
                        <Calendar
                            key={currentView + currentDate}
                            // currentDate={this.state.currentDate}
                            // currentViewName={this.state.currentViewName}
                            // currentViewNameChange={this.state.currentViewNameChange}
                            // refresh={this.refresh}
                        />
                        <SideBar
                            // drawerOpen={this.state.drawerOpen}
                            // handleDrawerClose={this.handleDrawerClose}
                            // currentViewNameChange={this.currentViewNameChange}
                            // drawerClose={this.handleDrawerClose}
                        />
                        <Tooltip title="Create Event" placement="left" aria-label="add">
                            <Fab color="primary" aria-label="add" style={styles.fab} 
                            onClick={() => dispatch(createForm(true))}
                            >
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </ThemeProvider>
                </body>
            </div>
    )
}

export default App
