import React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Picker from '../Picker';
import {useSelector,useDispatch} from 'react-redux'
import {changeCurrentDate} from '../../redux/actions/index'
const DateNavigator = () => {
    const dispatch = useDispatch()
    const currentDate = useSelector(state => state.currentDate.date)
    const currentView = useSelector(state => state.view.view)
    
    const handleNavNext = () => {
        let date = new Date(currentDate)
        if(currentView === "Day"){
            date.setDate(date.getDate() + 1)
        }
        if(currentView === "Week"){
            date.setDate(date.getDate() + 7)
        }
        if(currentView === "Month"){
            date.setDate(date.getMonth() + 1)
        }
        
        dispatch(changeCurrentDate(date))
        
    }
    
    const handleNavPrev = () =>{
        let date = new Date(currentDate)
        if(currentView === 'Day'){
            date.setDate(date.getDate() - 1)
        }
        if(currentView === 'Week'){
            date.setDate(date.getDate() - 7)
        }
        if(currentView === 'Month'){
            date.setMonth(date.getMonth() - 1)
        }
        dispatch(changeCurrentDate(date))
        
    }

    return (
        <Grid container direction="row" alignItems="center">
                <Hidden xsDown>
                    <IconButton onClick={handleNavPrev}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                </Hidden>
                <Picker
                    key={currentDate + currentView}
                    // currentDate={this.state.currentDate}
                    // currentViewName={this.state.currentViewName}
                    // handleSelectedDate={this.props.currentDateChange}
                />
                <Hidden xsDown>
                    <IconButton onClick={handleNavNext}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Hidden>
            </Grid>
    )
}

export default DateNavigator
