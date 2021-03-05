import format from 'date-fns/format';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FormPicker from './FormPicker';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SmartPlanningForm from './SmartPlanningForm';
import {changeCurrentDate,switch_Drawer,createFrom} from './redux/actions/index'
import {useSelector,useDispatch} from 'react-redux'
const SimpleEventForm = () => {
    return (
        <Dialog
                aria-labelledby="form-dialog-title"
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth maxWidth="xs"
            >
                {formLayout}
            </Dialog>
        );
    )
}

export default SimpleEventForm
