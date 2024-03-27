import React, { useState, useContext } from "react";
import { DateTimeFormatContext } from "../../index.js";
import styled from "@emotion/styled";
import { Settings } from 'react-feather';
import { Tooltip, Menu, MenuItem, IconButton as MuiIconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Grid } from "@mui/material";
//import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { FormControl, InputLabel, Select} from '@mui/material';

import { useTranslation } from 'react-i18next';

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarConfigurationDropdown() {
    const [anchorMenu, setAnchorMenu] = useState(null);
    const dateTimeContext = useContext(DateTimeFormatContext);
    const selectedDateFormat = dateTimeContext.dateFormat;
    const selectedTimeFormat = dateTimeContext.timeFormat;
    const selectedTimeZoneFormat = dateTimeContext.timeZoneFormat;

    const toggleMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorMenu(null);
    };

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {       
      setAnchorMenu();
      setOpen(true);
  };
    const handleClose = () => {
        setOpen(false);
  };

    const handleDateFormatChange= (event) => {
      dateTimeContext.setDateFormat(event.target.value);
    };
    const handleTimeFormatChange= (event) => {
      dateTimeContext.setTimeFormat(event.target.value);
    };
    const handleTimeZoneFormatChange= (event) => {
      dateTimeContext.setTimeZoneFormat(event.target.value);
    };
    const { t } = useTranslation();

    const dateFormats = [
       { value: 'MM/dd/yyyy', label: '07/26/2023' },
       { value: 'dd/MM/yyyy', label: '26/07/2023' },
       { value: 'MMMM d, yyyy', label: t('July 26, 2023')},
       { value: 'd MMMM yyyy', label: t('26 July 2023') },
       { value: 'EEEE, MMMM d, yyyy', label: t('Wednesday, July 26, 2023') },
       //{ value: 'MMM d, yyyy', label: 'Jul 26, 2023' },
       //{ value: 'yyyy-MM-dd', label: '2023-07-26' },
       //{ value: 'dd/MM/yyyy HH:mm', label: '26/07/2023 12:34' },
    ];
    const timeFormats = [
      { value: 'h:mm a', label: '1:00 PM' },
      { value: 'HH:mm', label: '13:00' },
      { value: 'h:mm:ss a', label: '1:00:00 PM' },
      { value: 'HH:mm:ss', label: '13:00:00' },      
    ];
    const timeZoneFormats = [
      { value: 'Etc/GMT-6', label: 'GMT-6' },
      { value: 'Etc/GMT-5', label: 'GMT-5' },
      { value: 'Etc/GMT-4', label: 'GMT-4' },
      { value: 'Etc/GMT-3', label: 'GMT-3' },
      { value: 'Etc/GMT-2', label: 'GMT-2' },
      { value: 'Etc/GMT-1', label: 'GMT-1' },
      { value: 'Etc/GMT+0', label: 'GMT+0' },
      { value: 'Etc/GMT+1', label: 'GMT+1' },
      { value: 'Etc/GMT+2', label: 'GMT+2' },
      { value: 'Etc/GMT+3', label: 'GMT+3' },
      { value: 'Etc/GMT+4', label: 'GMT+4' },
      { value: 'Etc/GMT+5', label: 'GMT+5' },
      { value: 'Etc/GMT+6', label: 'GMT+6' },
    ];
   
    return (
        <React.Fragment>
            <Tooltip title={t('Settings')}>
                <IconButton
                    aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                    color="inherit"
                    size="large"
                >
                    <Settings />
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                open={Boolean(anchorMenu)}
                onClose={closeMenu}
            >
                <MenuItem onClick={() => handleClickOpen()}>{t('Date/Time formatting')}</MenuItem>
            </Menu>
                <Dialog open={open} onClose={handleClose}>
                      <DialogTitle></DialogTitle>
                      <DialogContent>
                        <DialogContentText></DialogContentText>
                          <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} style={{ marginTop: '10px' }}>       
                              <p><b>{t('Date/Time formatting')}</b></p>
                              <p>{t('Select how you want dates and times to be formatted')}</p>
                            </Grid>
                            <Grid item xs={6} sm={6} style={{ marginTop: '10px' }} >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="dates-select-label">{t('Dates')}</InputLabel>
                                    <Select labelId="dates-select-label" id="dates-select" label="Dates" style={{ margin: '10px' }}
                                      value={selectedDateFormat}  onChange={handleDateFormatChange}>
                                      {dateFormats.map((format) => (
                                        <MenuItem key={format.value} value={format.value}>{format.label}</MenuItem>
                                      ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="times-select-label">{t('Times')}</InputLabel>
                                    <Select labelId="times-select-label" id="times-select" label="Times" style={{ margin: '10px' }} 
                                      value={selectedTimeFormat}  onChange={handleTimeFormatChange}>
                                      {timeFormats.map((format) => (
                                        <MenuItem key={format.value} value={format.value}>{format.label}</MenuItem>
                                      ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="timez-select-label">{t('Time Zones')}</InputLabel>
                                    <Select labelId="timez-select-label" id="timez-select" label="Time Zones" style={{ margin: '10px' }}
                                      value={selectedTimeZoneFormat}  onChange={handleTimeZoneFormatChange}>
                                      {timeZoneFormats .map((format) => (
                                        <MenuItem key={format.value} value={format.value}>{format.label}</MenuItem>
                                      ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                          </Grid>
                            <br/>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>                              
                              <Button variant="outlined" onClick={handleClose} style={{ width: '45%', marginLeft: '10px' }}>{t('Close')}</Button>
                            </div>
                      </DialogContent>
 
                    </Dialog>

        </React.Fragment>
    );

}

export default NavbarConfigurationDropdown;
