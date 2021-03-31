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
import { fetchAppointments, deleteAppointment } from '../../actions';

const toolbarHeight = 66;

const Calendar = props => {
    const [isEditing, setEditing] = useState(false);
    const [editDataId, setEditDataId] = useState("");
    const [height, setHeight] = useState(window.innerHeight - toolbarHeight);
    const currentView = props.currentView;
    const currentDate = props.currentDate;
    const appointments = props.appointments;
    const deleteAppointment = appointmentId => props.deleteAppointment(appointmentId);
    const fetchAppointments = () => props.fetchAppointments();

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight - toolbarHeight);
        setHeight(window.innerHeight - toolbarHeight);
        window.addEventListener("resize", handleResize);
        props.fetchAppointments();

        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTooltipOpen = editDataId => {
        setEditDataId(editDataId);
        setEditing(true);
    };

    const handleTooltipClose = () => {
        setEditing(false);
        setEditDataId("");
    };

    const AppointmentTooltipLayout = props => {
        const handleAppointmentDelete = (event, appointmentId) => {
            event.preventDefault();
            deleteAppointment(appointmentId);
            setTimeout(fetchAppointments, 50);
            props.onHide();
        };

        return (
            <AppointmentTooltip.Layout
                {...props}
                onDeleteButtonClick={(event) => handleAppointmentDelete(event, props.appointmentMeta.data.id)}
                onOpenButtonClick={() => handleTooltipOpen(props.appointmentMeta.data.id)}
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
            {
                isEditing ? <EditEventForm open={isEditing} onClose={handleTooltipClose} editDataId={editDataId} /> : null
            }

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
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);



