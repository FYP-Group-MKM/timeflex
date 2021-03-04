import React, { Component } from 'react';
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


const styles = {
    fab: {
        position: "absolute",
        bottom: 25,
        right: 25,
        zIndex: 1,
    },
};

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            currentViewName: "Week",
            drawerOpen: false,
            create: false,
        };
        this.currentDateChange = this.currentDateChange.bind(this);
        this.currentViewNameChange = this.currentViewNameChange.bind(this);
    };

    currentDateChange = (currentDate) => {
        this.setState({ currentDate });
        // const dispatch = useDispatch()

    }

    currentViewNameChange = (currentViewName) => {
        this.setState({ currentViewName });
    }

    handleDrawerOpen = () => {
        this.setState({ drawerOpen: true })
    }

    handleDrawerClose = () => {
        this.setState({ drawerOpen: false })
    }

    setCreateForm = () => {
        this.setState({ create: true });
    }

    hideCreateForm = () => {
        this.setState({ create: false });
    }

    refresh = (date) => {
        this.setState({ currentDate: date ? date : new Date() });
    }

    render() {
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
                                                        onClick={this.handleDrawerOpen}
                                                        edge="start"
                                                    >
                                                        <MenuIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <DateNavigator
                                                        key={this.state.currentDate + this.state.currentViewName}
                                                        currentDate={this.state.currentDate}
                                                        currentViewName={this.state.currentViewName}
                                                        currentDateChange={this.currentDateChange}
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
                                                        key={this.state.currentDate + this.state.currentViewName}
                                                        currentDate={this.state.currentDate}
                                                        currentViewName={this.state.currentViewName}
                                                        currentDateChange={this.currentDateChange}
                                                    />
                                                </Grid>
                                            </Hidden>
                                            <Grid item>
                                                <Hidden xsDown>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => { this.currentDateChange(new Date()) }}
                                                    >
                                                        Today
                                                    </Button>
                                                </Hidden>
                                                <Hidden smUp>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: "#616161" }}
                                                        onClick={() => { this.currentDateChange(new Date()) }}
                                                    >
                                                        Today
                                                    </Button>
                                                </Hidden>
                                            </Grid>
                                            <Grid item>
                                                <Hidden xsDown>
                                                    <Dropdown
                                                        key={this.state.currentViewName}
                                                        currentViewName={this.state.currentViewName}
                                                        currentViewNameChange={this.currentViewNameChange}
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
                            key={this.state.create}
                            open={this.state.create}
                            currentDate={this.state.currentDate}
                            refresh={this.refresh}
                            onHide={this.hideCreateForm}
                        />
                        <Calendar
                            key={this.state.currentViewName + this.state.currentDate}
                            currentDate={this.state.currentDate}
                            currentViewName={this.state.currentViewName}
                            currentViewNameChange={this.state.currentViewNameChange}
                            refresh={this.refresh}
                        />
                        <SideBar
                            drawerOpen={this.state.drawerOpen}
                            handleDrawerClose={this.handleDrawerClose}
                            currentViewNameChange={this.currentViewNameChange}
                            drawerClose={this.handleDrawerClose}
                        />
                        <Tooltip title="Create Event" placement="left" aria-label="add">
                            <Fab color="primary" aria-label="add" style={styles.fab} onClick={this.setCreateForm}>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </ThemeProvider>
                </body>
            </div>
        );
    }
}
