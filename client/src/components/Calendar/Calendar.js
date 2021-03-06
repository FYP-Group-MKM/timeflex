import React,{useState,useEffect} from 'react'
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
import {changeCurrentDate} from '../../redux/actions/index'
import {useSelector,useDispatch} from 'react-redux'

const Calendar = () => {
    const dispatch = useDispatch()
    const [height,setHeight] = useState(window.innerHeight)
    const [editing,setEditing] = useState(false)
    const [editDataId,setEditDataId] = useState("")
    const [appointments,setAppointments] = useState([])
    const [editingAppointment,setEditingAppointments] = useState(undefined)
    const currentView = useSelector(state => state.view.view)
    const currentDate = useSelector(state => state.currentDate.date)
    
    const refresh = (date) => {
        currentDate ? dispatch(changeCurrentDate(date)): dispatch(changeCurrentDate(new Date()))
        
    }
    const updateWindowDimensions = () => {
        setHeight(window.innerHeight)
    }
    const handleDelete = deleteAppointmentId => {
        fetch('/api/appointments/' + deleteAppointmentId,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        refresh();
    }
    const handleTooltipOPen = editDataId => {
        setEditDataId(editDataId)
        setEditing(true)
        
    }
    const handleTooltipClose = () => {
        setEditing(false)
    }

    const AppointmentTooltipLayout = props => {
        return(
            <AppointmentTooltip.Layout
            {...props}
            onDeleteButtonClick={() => handleDelete(props.appointmentMeta.data.id)}
            onOpenButtonClick={() => handleTooltipOPen(props.appointmentMeta.data.id)}
            />
        )
    }

    useEffect(() => {
        updateWindowDimensions();
        window.addEventListener('resize',updateWindowDimensions());
        fetch('/api/appointments')
            .then(res => res.json())
            .then(appointments => setAppointments(appointments));
        return () => {
            window.removeEventListener('resize',updateWindowDimensions())
        }
    },[])

    return (
        <div>
                <Scheduler
                    data={appointments}
                    height={window.innerHeight - 70}
                    firstDayOfWeek={1}
                >
                    <ViewState
                        currentDate={currentDate}
                        currentViewName={currentView}
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
                        layoutComponent={AppointmentTooltipLayout}
                    >
                    </AppointmentTooltip>
                </Scheduler >
                {
                    (editDataId !== "" && editDataId !== null)
                        ? <EditEventForm
                            key={editing}
                            open={editing}
                            onClose={handleTooltipClose}
                            editDataId={editDataId}
                            refresh={refresh}
                        />
                        : null
                }
            </div>
    )
}

export default Calendar



