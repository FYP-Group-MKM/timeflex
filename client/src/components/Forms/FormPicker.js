import format from 'date-fns/format';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker, DatePicker } from '@material-ui/pickers';

export default class FormPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            currentDate: new Date(this.props.currentDate),
            allDay: this.props.allDay,
        };
    }

    setPicker = open => {
        if (new Date(this.state.currentDate) > new Date())
            this.setState({ open });
    }

    handleDateChange = currentDate => {
        this.setState({ currentDate });
        this.props.handleFormChange(currentDate);
    }

    renderPicker = () => {
        if (this.state.allDay) {
            return (
                <DatePicker
                    variant="dialog"
                    value={new Date(this.state.currentDate)}
                    onChange={this.handleDateChange}
                    open={this.state.open}
                    onOpen={() => { this.setPicker(true) }}
                    onClose={() => { this.setPicker(false) }}
                    disablePast
                    showTodayButton
                />
            );
        } else {
            return (
                <DateTimePicker
                    variant="dialog"
                    value={new Date(this.state.currentDate)}
                    onChange={this.handleDateChange}
                    open={this.state.open}
                    onOpen={() => { this.setPicker(true) }}
                    onClose={() => { this.setPicker(false) }}
                    disablePast
                    showTodayButton
                />
            );
        }
    }

    render() {
        if (this.state.open) {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    {this.renderPicker()}
                </MuiPickersUtilsProvider>
            );
        } else {
            return (
                <Button onClick={() => { this.setPicker(true) }} style={{ color: "#424242" }}>
                    {this.state.allDay
                        ? format(this.state.currentDate, 'E, dd MMM u')
                        : format(this.state.currentDate, 'E, dd MMM u ． p')
                    }
                </Button>
            );
        }
    }
}
