import { Typography, Box } from "@mui/material";
import YenOrGoldButton from "./YenOrGoldButton";
import { useApp } from "../ThemedApp";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { getCurrencyFormatter } from "../ThemedApp";

const api = import.meta.env.VITE_YENZAY_API;

function CalculatedResult({ yItem, yData }) {
    let handlingFee = 0;
    if (yData.simulator.atmFeeCheck) {
        handlingFee += yData.simulator.sbiPricingObj[yData.simulator.atmType] ? Number(yData.simulator.sbiPricingObj[yData.simulator.atmType]) : 0;
    }

    if (yData.simulator.remitFeeCheck) {
        handlingFee += yData.simulator.sbiPricingObj.remit ? Number(yData.simulator.sbiPricingObj.remit) : 0;
    }

    if (yData.simulator.preferMethod === "y2k") {
        return (
            <Box sx={styles.balance}>
                <Typography sx={styles.text.label}>K</Typography>
                <Typography sx={styles.text.amount}>{yItem ? getCurrencyFormatter(Math.floor((Number(yData.simulator.y2k.value - handlingFee) * Number(yItem.MMKRatePerYen)))) : ""}</Typography>
                <Typography sx={styles.text.label}>/&nbsp;&nbsp;¥{yItem ? getCurrencyFormatter(yData.simulator.y2k.value) : ""}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={styles.balance}>
            <Typography sx={styles.text.label}>¥</Typography>
            <Typography sx={styles.text.amount}>{yItem ? getCurrencyFormatter(Math.ceil((Number(yData.simulator.k2y.value) / Number(yItem.MMKRatePerYen))) + handlingFee) : ""}</Typography>
            <Typography sx={styles.text.label}>/&nbsp;&nbsp;K{yItem ? getCurrencyFormatter(yData.simulator.k2y.value) : ""}</Typography>
        </Box>
    );
}

export default function SimulationResult() {
    const { yItem, setYItem, yData } = useApp();
    let apiUrl = `${api}/day/today.json`;
    const { isLoading, isError, error, data } = useQuery("yenzay", async () => {
        const res = await fetch(apiUrl);
        return res.json();
    }, {
        retry: 1,
    });

    useEffect(() => {
        if (data && data.Items) {
            setYItem(data.Items.slice().reverse()[0]);
        }
    }, [data]);

    const handlingChargesLabel = () => {
        if (yData.simulator.atmFeeCheck && yData.simulator.remitFeeCheck) {
            return `(Incl. ATM, Remit fees)`;
        } else if (yData.simulator.atmFeeCheck) {
            return `(Incl. ATM fee)`;
        } else if (yData.simulator.remitFeeCheck) {
            return `(Incl. Remit fee)`;
        }
    }

    return (
        <Box sx={styles.banner}>
            <Box sx={styles.bannerContent}>
                <Typography sx={styles.text.label}>Simulation Result {handlingChargesLabel()}</Typography>

                <CalculatedResult yItem={yItem} yData={yData} />
                <Typography sx={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: "#f5dbdb",
                    fontSize: { xs: "0.8rem", md: "1rem" }
                }}>{yItem.YearMonth}/{yItem.DayTime} ({yItem.MMKRatePerYen})</Typography>
            </Box>
            {/* <Box style={styles.yenOrGold}>
                <YenOrGoldButton />
            </Box> */}
        </Box>
    );
}

const styles = {
    banner: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: { xs: 2, md: 4 },
        borderBottomLeftRadius: { xs: 25, md: 50 },
        borderBottomRightRadius: { xs: 25, md: 50 },
        backgroundColor: "#374151", // Professional dark gray that complements the slate theme
        position: "sticky",
        top: -1,
        zIndex: 10,
    },
    bannerContent: {
        textAlign: "center",
    },
    balance: {
        marginTop: 2,
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
    },
    yenOrGold: {
        alignItems: "flex-end",
    },
    text: {
        label: {
            fontWeight: "bold",
            color: "#f5dbdb",
            fontSize: { xs: "1rem", md: "1.2rem" },
        },
        amount: {
            fontWeight: "bold",
            fontSize: { xs: 28, md: 40 },
            color: "#fff",
        },
        growth: {
            color: "#6f6",
        },
    },
};
