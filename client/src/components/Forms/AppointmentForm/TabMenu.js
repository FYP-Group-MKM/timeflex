import React, { useState } from 'react';
import setMinutes from 'date-fns/setMinutes';
import addHours from 'date-fns/addHours';
import addWeeks from 'date-fns/addWeeks';
import setHours from 'date-fns/setHours';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

const TabMenu = (props) => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [tempAppointment, setTempAppointment] = useState(null);

    const handleChange = (event, newValue) => {
        if (props.appointment)
            setTempAppointment(props.appointment);

        if (newValue === 0) {
            props.setSimple(true);
            props.setAppointment(tempAppointment ? tempAppointment : {
                title: "",
                startDate: setMinutes(addHours(new Date(), 1), 0),
                endDate: setMinutes(addHours(new Date(), 2), 0),
                allDay: false,
                rRule: "",
                description: "",
            });
        }

        if (newValue === 1) {
            props.setSimple(false);
            props.setAppointment(tempAppointment ? tempAppointment : {
                title: props.appointment.title,
                deadline: addWeeks(setMinutes(setHours(new Date(), 23), 59), 1),
                exDuration: null,
                minSession: 1,
                maxSession: null,
                divisible: true,
                description: "",
            });
        }

        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const TabPanelItems = [...props.children];
    const TabPanels = TabPanelItems.map((item, index) => {
        return (
            <TabPanel key={index} value={index} index={index} dir={theme.direction}>
                {item}
            </TabPanel>
        );
    });


    return (
        <div >
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Simple Event" />
                <Tab label="Smart Planning" />
                {/* <Tab label="Class (coming soon)" disabled /> */}
            </Tabs>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {TabPanels}
            </SwipeableViews>
        </div>
    );
}

export default TabMenu;