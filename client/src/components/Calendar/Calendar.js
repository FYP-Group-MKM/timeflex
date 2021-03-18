import React, { useState, useEffect } from 'react';
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
import { connect } from 'react-redux';
import { fetchAppointments } from '../../actions';

const Calendar = props => {
    const [isEditing, setEditing] = useState(false);
    const [editDataId, setEditDataId] = useState("");
    const currentView = props.currentView;
    const currentDate = props.currentDate;
    const appointments = props.appointments;
    const fetchAppointments = () => props.fetchAppointments();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAppointmentDelete = deleteAppointmentId => {
        fetch('/api/appointments/' + deleteAppointmentId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        refresh();
    }

    const handleTooltipOpen = editDataId => {
        setEditDataId(editDataId);
        setEditing(true);
    }

    const handleTooltipClose = () => {
        setEditing(false);
        setEditDataId("");
    }

    const refresh = () => {

    }

    const AppointmentTooltipLayout = props => {
        return (
            <AppointmentTooltip.Layout
                {...props}
                onDeleteButtonClick={() => handleAppointmentDelete(props.appointmentMeta.data.id)}
                onOpenButtonClick={() => handleTooltipOpen(props.appointmentMeta.data.id)}
            />
        );
    }

    const renderEditEventForm = () => {
        if (editDataId)
            return (
                <EditEventForm
                    key={isEditing}
                    open={isEditing}
                    onClose={handleTooltipClose}
                    editDataId={editDataId}
                    refresh={refresh}
                />
            );
    };

    return (
        <div>
            <Scheduler data={appointments} firstDayOfWeek={1}>
                <ViewState currentDate={currentDate} currentViewName={currentView} />
                <DayView startDayHour={0} endDayHour={24} cellDuration={60} />
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
                    layoutComponent={AppointmentTooltipLayout}
                />
            </Scheduler >
            {renderEditEventForm()}
        </div >
    )
};

const mapStateToProps = state => ({
    currentDate: state.calendar.currentDate,
    currentView: state.calendar.currentView,
    appointments: state.data.appointments
});

const mapDispatchToProps = dispatch => ({
    fetchAppointments: () => dispatch(fetchAppointments())
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);



