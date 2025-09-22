import { Box, Typography, Alert } from "@mui/material";
import Item from "./YItem";
import { useApp } from "../ThemedApp";
import { useQuery } from "react-query";

const api = import.meta.env.VITE_YENZAY_API;

export default function Calendar() {

    const { calendarValue, yData } = useApp();
    let apiUrl = `${api}/day/today.json`;

    const { isLoading, isError, error, data } = useQuery(["yenzay", calendarValue], async ({ queryKey }) => {
        const [_, calendarValue] = queryKey;

        /** calendarValue change && not today date */
        if (calendarValue && calendarValue.format("YYYY/MM/DD") !== new Date().toLocaleDateString("ja-JP", {
            year: "numeric", month: "2-digit",
            day: "2-digit"
        })) {
            apiUrl = `${api}/month/${calendarValue.format("YYYYMM")}.json`;
        }
        const res = await fetch(apiUrl);
        return res.json();
    }, {
        retry: 1,
    });

    if (data && calendarValue) {
        data.Items = data.Items.filter(x => x.DayTime.indexOf(`${calendarValue.format("DD ")}`) > -1);
    }

    let dataItems = [];
    if (data && data.Items) {
        dataItems = data.Items.slice().reverse();
    }

    if (isLoading) {
        return <Box style={styles.error}>Loading...</Box>
    }

    if (isError || !data || data.Items.length === 0) {
        return (
            <Box style={styles.error}>
                <Alert severity="warning">No Data</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography style={styles.text.label}>{dataItems[0].YearMonth}/{dataItems[0].DayTime.split(` `)[0]}</Typography>

            {
                dataItems.map((item, i, array) => {
                    return (
                        <Item
                            key={item.YearMonth + item.DayTime}
                            item={item}
                            prevItem={array[i - 1]}
                            yData={yData}
                        />
                    );
                })
            }
        </Box>
    );

}

const styles = {
    text: {
        label: {
            fontWeight: "bold",
            color: "#000",
            paddingBottom: 6,
            position: "sticky",
            top: 118,
            zIndex: 20,
            textAlign: "right",
        },
    },
    error: {
        height: 10000,
        textAlign: "center",
    }
}
