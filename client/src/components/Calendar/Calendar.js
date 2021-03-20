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
import { fetchAppointments, deleteAppointment, deleteAppointmentLocally } from '../../actions';

const toolbarHeight = 65;

const Calendar = props => {
    const [isEditing, setEditing] = useState(false);
    const [editDataId, setEditDataId] = useState("");
    const [tooltipIsOpen, setTooltip] = useState(false);
    const [height, setHeight] = useState(window.innerHeight - toolbarHeight);
    const currentView = props.currentView;
    const currentDate = props.currentDate;
    const appointments = props.appointments;

    useEffect(() => {
        setHeight(window.innerHeight - toolbarHeight);
        props.fetchAppointments();

        return () => window.removeEventListener("resize", setHeight);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAppointmentDelete = (event, appointmentId) => {
        event.preventDefault();
        // fetch('/api/appointments/' + appointmentId, {
        //     method: 'DELETE',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        // });
        // props.deleteAppointment(appointmentId);
        props.deleteAppointmentLocally(appointmentId);
        // props.fetchAppointments();
    };

    const handleTooltipOpen = editDataId => {
        setEditDataId(editDataId);
        setEditing(true);
    };

    const handleTooltipClose = () => {
        setEditing(false);
        setEditDataId("");
    };

    const AppointmentTooltipLayout = props => {
        return (
            <AppointmentTooltip.Layout
                {...props}
                visible={tooltipIsOpen}
                onDeleteButtonClick={(event) => handleAppointmentDelete(event, props.appointmentMeta.data.id)}
                onOpenButtonClick={() => handleTooltipOpen(props.appointmentMeta.data.id)}
            />
        );
    };

    const renderEditEventForm = () => {
        if (editDataId)
            return (
                <EditEventForm
                    key={isEditing}
                    open={isEditing}
                    onClose={handleTooltipClose}
                    editDataId={editDataId}
                />
            );
    };

    return (
        <div>
            <Scheduler data={appointments} firstDayOfWeek={1} height={height}>
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
    );
};

const mapStateToProps = state => ({
    currentDate: state.calendar.currentDate,
    currentView: state.calendar.currentView,
    appointments: state.data.appointments
});

const mapDispatchToProps = dispatch => ({
    fetchAppointments: () => dispatch(fetchAppointments()),
    deleteAppointment: (appointmentId) => dispatch(deleteAppointment(appointmentId)),
    deleteAppointmentLocally: (appointmentId) => dispatch(deleteAppointmentLocally(appointmentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);



