import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';

const useStyles = makeStyles(theme => ({
    pastCell: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
    },
}));

const TimeTableCell = (props) => {
    const classes = useStyles();
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
    } if (date < new Date()) {
        return <WeekView.TimeTableCell {...props} className={classes.pastCell} />;
    } return <WeekView.TimeTableCell {...props} />;
};

export default TimeTableCell;