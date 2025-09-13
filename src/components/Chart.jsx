import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { getCurrencyFormatter, useApp } from "../ThemedApp";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { useState } from "react";

const api = import.meta.env.VITE_YENZAY_API;

export default function Chart() {
    const { calendarValue } = useApp();
    const [period, setPeriod] = useState('thisMonth');

    // Generate year options from current year to 2020
    const currentYear = dayjs().year();
    const yearOptions = [];
    for (let year = currentYear; year >= 2020; year--) {
        yearOptions.push({
            value: `year_${year}`,
            label: `${year} Year`,
            year: year
        });
    }

    const { isLoading, isError, error, data } = useQuery(["yenzay_chart", period], async ({ queryKey }) => {
        const [_, selectedPeriod] = queryKey;
        let apiUrl = `${api}/day/today.json`;

        if (selectedPeriod === 'thisMonth') {
            // For Previous 30 Days, we may need to fetch current and previous month
            const thirtyDaysAgo = dayjs().subtract(30, 'day');
            const currentMonth = dayjs().format('YYYYMM');
            const prevMonth = dayjs().subtract(1, 'month').format('YYYYMM');

            const results = [];

            // Always fetch current month
            const currentRes = await fetch(`${api}/month/${currentMonth}.json`);
            const currentData = await currentRes.json();
            results.push(currentData);

            // If 30 days ago is in previous month, fetch previous month too
            if (thirtyDaysAgo.format('YYYYMM') !== currentMonth) {
                const prevRes = await fetch(`${api}/month/${prevMonth}.json`);
                const prevData = await prevRes.json();
                results.push(prevData);
            }

            // Combine the results
            if (results.length === 1) {
                return results[0];
            } else {
                // Merge Items from both months, ensuring all data is included
                const combinedItems = {};

                // Process results in reverse order to prioritize current month data
                results.reverse().forEach(result => {
                    if (result && result.Items) {
                        // Merge each month's items
                        Object.keys(result.Items).forEach(key => {
                            combinedItems[key] = result.Items[key];
                        });
                    }
                });

                return { Items: combinedItems };
            }
        } else if (selectedPeriod === 'thisYear') {
            apiUrl = `${api}/year/${dayjs().format('YYYY')}.json`;
        } else if (selectedPeriod === 'prevYear') {
            apiUrl = `${api}/year/${dayjs().subtract(1, 'year').format('YYYY')}.json`;
        } else if (selectedPeriod.startsWith('year_')) {
            const year = selectedPeriod.split('_')[1];
            apiUrl = `${api}/year/${year}.json`;
        }
        // For 'today', use default apiUrl

        const res = await fetch(apiUrl);
        return res.json();
    }, {
        retry: 1,
    });

    const dataPoints = [];
    const thirtyDaysAgo = dayjs().subtract(30, 'day');

    if (data) {
        if (data['Items']) {
            // Month/Day API format: {Items: [...]}
            for (var key2 in data['Items']) {
                const data2 = data['Items'][key2];
                if (typeof data2 === 'object' && data2['YearMonth']) {
                    let dateStr = data2['YearMonth'];
                    if (data2['DayTime']) {
                        dateStr += '/' + data2['DayTime'];
                    }
                    const rate = parseFloat(data2['MMKRatePerYen']);
                    const parsedDate = dayjs(dateStr);
                    if (parsedDate.isValid()) {
                        // For "Previous 30 Days", only include data from the last 30 days
                        if (period === 'thisMonth' && parsedDate.isBefore(thirtyDaysAgo)) {
                            continue;
                        }
                        dataPoints.push({
                            date: parsedDate,
                            rate: getCurrencyFormatter(rate, 2)
                        });
                    }
                }
            }
        } else {
            // Year API format: {"YYYYMM": {"Items": [...]}, ...}
            for (var monthKey in data) {
                const monthData = data[monthKey];
                if (monthData && monthData['Items'] && monthData['Items'].length > 0) {
                    const data2 = monthData['Items'][0]; // Take first item (monthly data)
                    if (typeof data2 === 'object' && data2['YearMonth']) {
                        let dateStr = data2['YearMonth'];
                        if (data2['DayTime']) {
                            dateStr += '/' + data2['DayTime'];
                        }
                        const rate = parseFloat(data2['MMKRatePerYen']);
                        const parsedDate = dayjs(dateStr);
                        if (parsedDate.isValid()) {
                            dataPoints.push({
                                date: parsedDate,
                                rate: getCurrencyFormatter(rate, 2)
                            });
                        }
                    }
                }
            }
        }
    }

    // Sort data points chronologically
    dataPoints.sort((a, b) => a.date.valueOf() - b.date.valueOf());

    const xAxis = dataPoints.map(point => point.date);
    const yAxis = dataPoints.map(point => point.rate);

    if (isLoading) {
        return <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>;
    }

    if (isError) {
        return <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data</Box>;
    }

    return (
        <Box
            sx={{
                height: 400,
            }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                    value={period}
                    label="Time Period"
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="thisMonth">Previous 30 Days</MenuItem>
                    {yearOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <LineChart
                grid={{ vertical: true, horizontal: true }}
                xAxis={[{
                    // data: [1, 2, 3, 5, 8, 10],
                    data: xAxis,
                    valueFormatter: (v) => {
                        if (period === 'thisYear' || period === 'prevYear' || period.startsWith('year_')) {
                            return dayjs(v).format("YYYY/MM");
                        } else if (period === 'thisMonth') {
                            return dayjs(v).format("MM/DD");
                        } else {
                            return dayjs(v).format("HH:mm");
                        }
                    },
                }]}
                series={[
                    {
                        // data: [2, 5.5, 2, 8.5, 1.5, 5],
                        data: yAxis,
                    },
                ]}
                height={300}
            />
        </Box>
    );
}
