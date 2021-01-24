import format from 'date-fns/format';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker, DatePicker } from '@material-ui/pickers';

export default class FormPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: this.props.currentDate,
            currentViewName: "Day",
            pickerIsOpen: false,
            allDay: this.props.allDay,
        };
    }

    setPicker = (pickerIsOpen) => {
        if (new Date(this.state.currentDate) > new Date())
            this.setState({ pickerIsOpen });
    }

    handleDateChange = (currentDate) => {
        this.setState({ currentDate });
        this.props.handleFormChange(currentDate);
    }

    render() {
        return (
            <div>
                {
                    this.state.pickerIsOpen
                        ?
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            {
                                this.state.allDay
                                    ? <DatePicker
                                        name={this.props.name}
                                        variant="dialog"
                                        value={new Date(this.state.currentDate)}
                                        readOnly={this.readOnly}
                                        onChange={this.handleDateChange}
                                        open={this.state.pickerIsOpen}
                                        onOpen={() => { this.setPicker(true) }}
                                        onClose={() => { this.setPicker(false) }}
                                        KeyboardButtonProps={{ 'aria-label': 'change date', }}
                                        disablePast
                                        showTodayButton
                                    />
                                    : <DateTimePicker
                                        name={this.props.name}
                                        variant="dialog"
                                        value={new Date(this.state.currentDate)}
                                        readOnly={true}
                                        onChange={this.handleDateChange}
                                        open={this.state.pickerIsOpen}
                                        onOpen={() => { this.setPicker(true) }}
                                        onClose={() => { this.setPicker(false) }}
                                        KeyboardButtonProps={{ 'aria-label': 'change date', }}
                                        disablePast
                                        showTodayButton
                                    />
                            }

                        </MuiPickersUtilsProvider>
                        : <Button
                            onClick={() => { this.setPicker(true) }}
                            style={{ color: "#424242" }}
                        >
                            {this.state.allDay ? format(this.state.currentDate, 'P') : format(this.state.currentDate, 'Pp')}
                        </Button>
                }
            </div>
        )
    }
}
