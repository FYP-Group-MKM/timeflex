import format from 'date-fns/format';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker, } from '@material-ui/pickers';
import {connect} from 'react-redux'
import {changeView,changeCurrentDate} from '../redux/actions/index'
class Picker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate:this.props.currentDate,
            pickerIsOpen: false,
        };
    }

    setPicker = (pickerIsOpen) => {
        this.setState({ pickerIsOpen });
    }
    
    handleSelectedDate = (currentDate) => {
        this.setState({ currentDate });
        this.props.changeCurrentDate(currentDate)
    }

    render() {
        
        let pickerFormat = "MMMM yyyy";
        let date = format(this.state.currentDate, 'MMM yyyy');
        if (this.props.currentViewName === "Day") {
            pickerFormat = "d MMMM yyyy";
            date = format(this.state.currentDate, 'd MMM yyyy');
        }

        return (
            <div>
                {
                    this.state.pickerIsOpen
                        ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                variant="dialog"
                                format={pickerFormat}
                                disableToolbar={false}
                                value={this.props.currentDate}
                                onChange={this.handleSelectedDate}
                                open={this.state.pickerIsOpen}
                                onOpen={() => { this.setPicker(true) }}
                                onClose={() => { this.setPicker(false) }}
                                KeyboardButtonProps={{ 'aria-label': 'change date', }}
                            />
                        </MuiPickersUtilsProvider>
                        : <div>
                            <Hidden smUp>
                                <Button
                                    endIcon={<ArrowDropDownIcon />}
                                    onClick={() => { this.setPicker(true) }}
                                    style={{ color: "#616161" }}
                                >
                                    {date}
                                </Button>
                            </Hidden>
                            <Hidden xsDown>
                                <Button
                                    onClick={() => { this.setPicker(true) }}
                                    style={{ color: "#616161" }}
                                >
                                    {date}
                                </Button>
                            </Hidden>
                        </div>


                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentDate:state.currentDate.date,
        currentViewName:state.view.view,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeDate:(currentDate) => dispatch(changeCurrentDate(currentDate)),
        changeView:(view) => dispatch(changeView(view)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Picker);
