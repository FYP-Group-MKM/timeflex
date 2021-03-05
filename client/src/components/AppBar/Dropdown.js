import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {useSelector,useDispatch} from 'react-redux'
import {changeView} from '../../redux/actions/index'

const Dropdown = () => {
    const [anchorEl,setanchorEl] = useState(null)
    const currentView = useSelector(state => state.view.view)
    const dispatch = useDispatch()
    const handleClick = (event) => {
        setanchorEl(event.currentTarget)
    }
    const handleClose = (event) => {
        setanchorEl(null)
        if(event.currentTarget.title){
            dispatch(changeView(event.currentTarget.title))
        }
    }
 

    return (
        <div>
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowDropDownIcon />}
                >
                    {currentView}
                </Button >
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem title="Day" onClick={handleClose}>Day</MenuItem>
                    <MenuItem title="Week" onClick={handleClose}>Week</MenuItem>
                    <MenuItem title="Month" onClick={handleClose}>Month</MenuItem>
                </Menu>
            </div>
    )
}

export default Dropdown
