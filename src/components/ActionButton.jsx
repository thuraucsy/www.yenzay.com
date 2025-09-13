import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { EventTwoTone, CalculateTwoTone, TimelineTwoTone, CurrencyExchangeTwoTone } from "@mui/icons-material";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useApp, setLocalStorageYData } from "../ThemedApp";

function ButtonField(props) {
    const { btnType, setBtnType, yData, setYData } = useApp();
    const {
        setOpen,
        label,
        id,
        disabled,
        InputProps: { ref } = {},
        inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    return (
        <Tooltip title={btnType === "calendar" ? "Tap again to select previous dates" : "Tap to view yenzay"} enterTouchDelay={0}>
            <IconButton sx={{ ...styles.actionButton, ...(btnType === "calendar" ? { border: "2px solid #fff" } : {}) }}
                variant="outlined"
                id={id}
                disabled={disabled}
                ref={ref}
                aria-label={ariaLabel}
                onClick={() => {
                    /** only set the calendar type if not */
                    if (btnType != "calendar") {
                        setBtnType("calendar");
                        setLocalStorageYData(yData, setYData, "btnType", "calendar");
                    } else {
                        setOpen?.((prev) => !prev)
                    }
                }}
            >
                <EventTwoTone sx={styles.svgButton} />
            </IconButton>
        </Tooltip>
    );
}

function ButtonDatePicker() {
    const { open, setOpen, calendarValue, setCalendarValue } = useApp();
    const minDate = dayjs('2020/02/15').add(1, 'day');

    return (
        <DatePicker
            displayWeekNumber
            minDate={minDate}
            slots={{ field: ButtonField }}
            slotProps={{ field: { setOpen }, actionBar: {
                actions: ['cancel', 'today', 'accept'],
              }, }}
            label={calendarValue == null ? null : calendarValue.format('YYYY/MM/DD')}
            value={calendarValue}
            onAccept={(newValue) => {
                setCalendarValue(newValue);
            }}
            views={['year', 'month', 'day']}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        />
    );
}

export default function ActionButton({ color, icon, label, path }) {
    const { calendarValue, setBtnType, yData, setYData } = useApp();

    return (
        <Box sx={styles.actions}>
            <Box sx={styles.actionButtonGroup}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ButtonDatePicker />
                </LocalizationProvider>
                <Typography sx={styles.text.actionText}>
                    {calendarValue == null ? "Calendar" : calendarValue.format('MM/DD')}
                </Typography>
            </Box>

            <Box sx={styles.actionButtonGroup}>
                <IconButton sx={{ ...styles.actionButton, ...styles.actionButton.color.scan }} onClick={() => {
                    setBtnType("simulator");
                    setLocalStorageYData(yData, setYData, "btnType", "simulator");
                }}>
                    <CalculateTwoTone sx={styles.svgButton} />
                </IconButton>
                <Typography sx={styles.text.actionText}>
                    Simulator
                </Typography>
            </Box>
            <Box sx={styles.actionButtonGroup}>
                <IconButton sx={{ ...styles.actionButton, ...styles.actionButton.color.rate }} onClick={() => {
                    setBtnType("chart");
                    setLocalStorageYData(yData, setYData, "btnType", "chart");
                }}>
                    <TimelineTwoTone sx={styles.svgButton} />
                </IconButton>
                <Typography sx={styles.text.actionText}>
                    Chart
                </Typography>
            </Box>
            <Box sx={styles.actionButtonGroup}>
                <IconButton sx={styles.actionButton} onClick={() => {
                    setBtnType("fxRate");
                    setLocalStorageYData(yData, setYData, "btnType", "fxRate");
                }}>
                    <CurrencyExchangeTwoTone sx={styles.svgButton} />
                </IconButton>
                <Typography sx={styles.text.actionText}>
                    Fx Rate
                </Typography>
            </Box>
        </Box>
    );
}

const styles = {
    actions: {
        display: "flex",
        padding: { xs: 2, md: 4 },
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
    },
    action: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    actionButtonGroup: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
    },
    actionButton: {
        width: { xs: 60, md: 80 },
        height: { xs: 60, md: 80 },
        borderRadius: { xs: 60, md: 80 },
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#475569", // Professional slate gray
        color: {
            scan: {
                backgroundColor: "#64748b", // Lighter slate
            },
            rate: {
                backgroundColor: "#374151", // Matching the banner color
            }
        },
        "&:hover": {
            opacity: 0.8,
        },
    },
    svgButton: {
        color: "white",
        fontSize: { xs: "1.5rem", md: "2rem" },
    },
    text: {
        actionText: {
            color: "#fff",
            textAlign: "center",
            paddingTop: 1,
            fontSize: { xs: "0.8rem", md: "1rem" },
        },
    },
};
