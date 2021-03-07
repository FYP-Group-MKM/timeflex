import format from 'date-fns/format';
import React ,{useState}from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker, } from '@material-ui/pickers';
import {useSelector,useDispatch} from 'react-redux'
import {changeCurrentDate} from '../redux/actions/index'

const Picker = () => {
    const dispatch    = useDispatch()
    const currentDate = useSelector(state => state.currentDate.date)
    const currentView = useSelector(state => state.view.view)
    const [pickerIsOpen, setPickerIsOpen] = useState(false)

    // const setPicker = (pickerIsOpen) => {
    //     setPickerIsOpen(pickerIsOpen)
    // }
   

    const handleDateChange = (currentDate) => {
        dispatch(changeCurrentDate(currentDate))
        
    }

    let pickerFormat = "MMMM yyyy"
    let date = format(currentDate,'MMM yyyy')
    if(currentView === "Day"){
        pickerFormat = "d MMMM yyyy"
        date = format(currentDate, 'd MMM yyyy');

    }
    
    
    return (
        <div>
                {
                    pickerIsOpen
                        ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                variant="dialog"
                                format={pickerFormat}
                                disableToolbar={false}
                                value={currentDate}
                                onChange={handleDateChange}
                                open={pickerIsOpen}
                                onOpen={() => { setPickerIsOpen(true) }}
                                onClose={() => { setPickerIsOpen(false) }}
                                KeyboardButtonProps={{ 'aria-label': 'change date', }}
                            />
                        </MuiPickersUtilsProvider>
                        : <div>
                            <Hidden smUp>
                                <Button
                                    endIcon={<ArrowDropDownIcon />}
                                    onClick={() => { setPickerIsOpen(true) }}
                                    style={{ color: "#616161" }}
                                >
                                    {date}
                                </Button>
                            </Hidden>
                            <Hidden xsDown>
                                <Button
                                    onClick={() => { setPickerIsOpen(true) }}
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

export default Picker
