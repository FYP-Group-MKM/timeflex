import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

const TabMenu = (props) => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
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
                <Tab label="Class" />
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