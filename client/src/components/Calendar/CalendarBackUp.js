import React, { Component } from 'react';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    AllDayPanel,
    DayView,
    WeekView,
    MonthView,
    Appointments,
    AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import DayScaleCell from './DayScaleCell';
import TimeTableCell from './TimeTableCell';
import EditEventForm from '../Forms/EditEventForm';

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            editing: false,
            editDataId: "",
            appointments: [],
            editingAppointment: undefined,
            currentDate: this.props.currentDate,
            currentViewName: this.props.currentViewName,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        fetch('/api/appointments')
            .then(res => res.json())
            .then(appointments => this.setState({ appointments }));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ height: window.innerHeight });
    }

    handleDelete = deleteAppointmentId => {
        fetch('/api/appointments/' + deleteAppointmentId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        this.props.refresh();
    };

    handleTooltipOpen = editDataId => {
        this.setState({ editDataId, editing: true });
    }

    handleTooltipClose = () => {
        this.setState({ editing: false });
    }

    AppointmentTooltipLayout = props => {
        return (
            <AppointmentTooltip.Layout
                {...props}
                onDeleteButtonClick={() => { this.handleDelete(props.appointmentMeta.data.id) }}
                onOpenButtonClick={() => { this.handleTooltipOpen(props.appointmentMeta.data.id) }}
            />
        );
    }

    render() {
        return (
            <div>
                <Scheduler
                    data={this.state.appointments}
                    height={window.innerHeight - 70}
                    firstDayOfWeek={1}
                >
                    <ViewState
                        currentDate={this.state.currentDate}
                        currentViewName={this.state.currentViewName}
                    />
                    <DayView
                        startDayHour={0}
                        endDayHour={24}
                        cellDuration={60}
                    />
                    <WeekView
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={DayScaleCell}
                        startDayHour={0}
                        endDayHour={24}
                        cellDuration={60}
                    />
                    <MonthView />
                    <AllDayPanel />
                    <Appointments />
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                        showDeleteButton
                        layoutComponent={this.AppointmentTooltipLayout}
                    >
                    </AppointmentTooltip>
                </Scheduler >
                {
                    (this.state.editDataId !== "" && this.state.editDataId !== null)
                        ? <EditEventForm
                            key={this.state.editing}
                            open={this.state.editing}
                            onClose={this.handleTooltipClose}
                            editDataId={this.state.editDataId}
                            refresh={this.props.refresh}
                        />
                        : null
                }
            </div>
        );
    }
}
