import { Typography, Box } from "@mui/material";
import YenOrGoldButton from "./YenOrGoldButton";
import { useApp } from "../ThemedApp";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { getCurrencyFormatter } from "../ThemedApp";

const api = import.meta.env.VITE_YENZAY_API;

function CalculatedResult({ yItem, yData }) {
    if (yData.yenOrGoldToggle === 'gold') {
        // Gold dealer options with fixed handling charges based on weight
        // Tanaka Kikinzoku fees (from tt.tanaka.jp/guide/fee/):
        // - 500g/1kg: ¥0
        // - 100g/200g/300g: ¥16,500
        // - 50g: ¥8,800
        // - 5g/10g/20g: ¥4,400
        // Nihon Material fees (from www.material.co.jp/charge.php):
        // - 1kg/500g/300g/200g/100g: ¥0
        // - 50g: ¥1,540
        // - 20g<=: ¥2,420
        const getGoldHandlingFee = (dealer, weight) => {
            if (dealer === 'tanaka') {
                if (weight >= 500) return 0; // 500g/1kg: free
                if (weight >= 100) return 16500; // 100g/200g/300g: ¥16,500
                if (weight >= 50) return 8800; // 50g: ¥8,800
                return 4400; // 5g/10g/20g: ¥4,400
            } else if (dealer === 'nihon') {
                if (weight >= 100) return 0; // 100g+: free
                if (weight <= 20) return 2420; // 20g and below: ¥2,420
                return 1540; // 50g: ¥1,540
            }
            return 0;
        };

        // Calculate total gold price including handling charges
        const calculateGoldPrice = () => {
            if (!yItem || !yItem.GoldPriceYenPerGram || !yData.simulator.goldWeight) {
                return 0;
            }

            const basePrice = yItem.GoldPriceYenPerGram * yData.simulator.goldWeight;

            // Add handling charges if enabled
            if (yData.simulator.goldHandlingFeeCheck && yData.simulator.goldDealer) {
                const handlingFee = getGoldHandlingFee(yData.simulator.goldDealer, yData.simulator.goldWeight);
                return basePrice + handlingFee;
            }

            return basePrice;
        };

        // Show gold price - either per gram or total based on selected weight
        if (yData.simulator.goldWeight && yData.simulator.goldWeight > 1) {
            // Show total price for selected weight
            const totalPrice = calculateGoldPrice();
            const weightLabel = yData.simulator.goldWeight >= 1000 ?
                `${yData.simulator.goldWeight / 1000}kg` :
                `${yData.simulator.goldWeight}g`;

            return (
                <Box sx={styles.balance}>
                    <Typography sx={styles.text.label}>Gold Price</Typography>
                    <Typography sx={styles.text.amount}>{yItem ? `¥${getCurrencyFormatter(totalPrice)}` : ""}</Typography>
                    <Typography sx={styles.text.label}>/{weightLabel}</Typography>
                </Box>
            );
        } else {
            // Show per gram price
            return (
                <Box sx={styles.balance}>
                    <Typography sx={styles.text.label}>Gold Price</Typography>
                    <Typography sx={styles.text.amount}>{yItem ? `¥${getCurrencyFormatter(yItem.GoldPriceYenPerGram)}` : ""}</Typography>
                    <Typography sx={styles.text.label}>/g</Typography>
                </Box>
            );
        }
    }

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
        return '';
    }

    return (
        <Box sx={styles.banner}>
            <Box sx={styles.bannerContent}>
                <Typography sx={styles.text.label}>
                    {yData.yenOrGoldToggle === 'gold' ? 'Gold Price' : `Simulation Result ${handlingChargesLabel()}`}
                </Typography>

                <CalculatedResult yItem={yItem} yData={yData} />
                <Typography sx={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: "#f5dbdb",
                    fontSize: { xs: "0.8rem", md: "1rem" }
                }}>
                    {yData.yenOrGoldToggle === 'gold' 
                        ? yItem.GoldPriceDateTime 
                        : `${yItem.YearMonth}/${yItem.DayTime} (${yItem.MMKRatePerYen})`
                    }
                </Typography>
            </Box>
            <Box style={styles.yenOrGold}>
                <YenOrGoldButton />
            </Box>
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
