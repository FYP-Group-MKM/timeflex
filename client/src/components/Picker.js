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
    const [pickerIsOpen, setPickerIsOpen] = useState(false)

    const handleSelcetedDate = () => {
        dispatch(changeCurrentDate(currentDate))
    }



    let pickerFormat = "MMMM yyyy"
    if(currentDate === "Day"){
        pickerFormat = "d MMMM yyyy"
    }
    let date = format(currentDate,pickerFormat)
    
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
                                onChange={handleSelcetedDate}
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
