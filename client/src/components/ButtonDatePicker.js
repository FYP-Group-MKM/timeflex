import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker, } from '@material-ui/pickers';
import { connect } from 'react-redux';
import { changeView, setCurrentDate } from '../actions';

// class Picker extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             currentDate: this.props.currentDate,
//             pickerIsOpen: false,
//         };
//     }

//     setPicker = (pickerIsOpen) => {
//         this.setState({ pickerIsOpen });
//     }

//     handleSelectedDate = (currentDate) => {
//         this.setState({ currentDate });
//         this.props.setCurrentDate(currentDate)
//     }

//     render() {
//         let pickerFormat = "MMMM yyyy";
//         let date = format(this.state.currentDate, 'MMM yyyy');
//         if (this.props.currentViewName === "Day") {
//             pickerFormat = "d MMMM yyyy";
//             date = format(this.state.currentDate, 'd MMM yyyy');
//         }

//         return (
//             <div>
//                 {
//                     this.state.pickerIsOpen
//                         ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                             <DatePicker
//                                 variant="dialog"
//                                 format={pickerFormat}
//                                 disableToolbar={false}
//                                 value={this.props.currentDate}
//                                 onChange={this.handleSelectedDate}
//                                 open={this.state.pickerIsOpen}
//                                 onOpen={() => { this.setPicker(true) }}
//                                 onClose={() => { this.setPicker(false) }}
//                                 KeyboardButtonProps={{ 'aria-label': 'change date', }}
//                             />
//                         </MuiPickersUtilsProvider>
//                         : <div>
//                             <Hidden smUp>
//                                 <Button
//                                     endIcon={<ArrowDropDownIcon />}
//                                     onClick={() => { this.setPicker(true) }}
//                                     style={{ color: "#616161" }}
//                                 >
//                                     {date}
//                                 </Button>
//                             </Hidden>
//                             <Hidden xsDown>
//                                 <Button
//                                     onClick={() => { this.setPicker(true) }}
//                                     style={{ color: "#616161" }}
//                                 >
//                                     {date}
//                                 </Button>
//                             </Hidden>
//                         </div>


//                 }
//             </div>
//         )
//     }
// }

// const mapStateToProps = state => {
//     return {
//         currentDate: state.currentDate.currentDate,
//         currentViewName: state.view.view,
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         changeDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
//         changeView: (view) => dispatch(changeView(view)),
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Picker);

const useStyles = makeStyles(theme => ({
    button: {
        color: "#616161"
    }
}));

const ButtonDatePicker = props => {
    const classes = useStyles();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isOpen, setOpen] = useState(false);

    const handleDatePicked = date => {
        setCurrentDate(date);
        props.setCurrentDate(date);
    }

    const renderButton = () => {
        let dateString = format(currentDate, "MMMM yyyy");
        if (props.currentViewName === "Day")
            dateString = format(currentDate, "d MMM yyyy");

        const renderArrowDropdownIcon = () => (
            <Hidden smUp>
                <ArrowDropDownIcon />
            </Hidden>
        );

        return (
            <Button endIcon={renderArrowDropdownIcon} onClick={() => setOpen(true)} className={classes.button}>
                {dateString}
            </Button >
        );
    }

    return (
        renderButton()
    );
};

export default ButtonDatePicker;