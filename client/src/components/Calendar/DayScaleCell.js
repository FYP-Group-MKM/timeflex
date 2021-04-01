import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';

const useStyles = makeStyles(theme => ({
    todayCell: {
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
    },
    today: {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
}));


const DayScaleCell = (props) => {
    const classes = useStyles();
    const { startDate, today } = props;

    if (today) {
        return <WeekView.DayScaleCell {...props} className={classes.today} />;
    } if (startDate.getDate() < new Date().getDate()) {
        return <WeekView.DayScaleCell {...props} className={classes.past} />;
    } return <WeekView.DayScaleCell {...props} />;
};

export default DayScaleCell;
