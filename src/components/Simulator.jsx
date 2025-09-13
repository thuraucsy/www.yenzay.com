import CurrencyField from "../components/CurrencyField";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, FormGroup, Checkbox, Link, Alert } from '@mui/material';
import { setLocalStorageYData, useApp, getCurrencyFormatter } from "../ThemedApp";

export default function Simulator() {
    const { yData, setYData, yItem } = useApp();

    const sbiPricing = {
        "10000": {
            "lawson": 300,
            "yucho": 330,
            "remit": 460
        },
        "50000": {
            "lawson": 300,
            "yucho": 330,
            "remit": 880
        },
        "250000": {
            "lawson": 300,
            "yucho": 500,
            "remit": 1480
        },
        "99999999": {
            "lawson": 300,
            "yucho": 500,
            "remit": 1980
        }
    };

    const calculateHandingCharges = (amount) => {
        // console.log("amount", amount);
        if (!amount) {
            return {
                "lawson": "",
                "yucho": "",
                "remit": "",
            }
        }
        const foundPricingAmt = Object.keys(sbiPricing).filter(x => Number(x) >= Number(amount))[0];
        return sbiPricing[foundPricingAmt];
    };

    const handlingChargesLabel = (label) => {
        if (!yData.simulator.sbiPricingObj || !yData.simulator.sbiPricingObj.lawson || !yData.simulator.sbiPricingObj.yucho || !yData.simulator.sbiPricingObj.remit) {
            return "";
        }

        if (label == "remit") {
            return `(¥${getCurrencyFormatter(yData.simulator.sbiPricingObj.remit)})`;
        }

        return `(¥${yData.simulator.atmType === "lawson" ? getCurrencyFormatter(yData.simulator.sbiPricingObj.lawson) : getCurrencyFormatter(yData.simulator.sbiPricingObj.yucho)})`;
    }

    const preferMethodChange = (event) => {
        setLocalStorageYData(yData, setYData, "simulator.preferMethod", event.target.value);
        updateY2KorK2Ychanges(event.target.value);
    };

    const updateY2KorK2Ychanges = (value) => {
        if (value == "y2k") {
            y2kChange(yData.simulator.y2k);
        } else {
            k2yChange(yData.simulator.k2y);
        }
    }

    const y2kChange = (values) => {
        setLocalStorageYData(yData, setYData, "simulator.y2k", values);
        setLocalStorageYData(yData, setYData, "simulator.sbiPricingObj", calculateHandingCharges(values.value));
    };

    const k2yChange = (values) => {
        setLocalStorageYData(yData, setYData, "simulator.k2y", values);
        const yenAmt = Math.floor(values.value / yItem.MMKRatePerYen);
        let sbiPricingObj = calculateHandingCharges(yenAmt);

        if (sbiPricingObj.lawson) {
            let atmFee = sbiPricingObj.yucho;
            if (yData.simulator.atmType === "lawson") {
                atmFee = sbiPricingObj.lawson;
            }
            const handlingCharges = sbiPricingObj.remit + atmFee;
            sbiPricingObj = calculateHandingCharges(yenAmt + handlingCharges);

            setLocalStorageYData(yData, setYData, "simulator.sbiPricingObj", sbiPricingObj);
        }
    };

    return (
        <Box sx={{
            minHeight: { xs: "auto", md: "400px" },
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
        }}>
            <FormControl sx={{
                border: "1px dotted",
                padding: { xs: 2, md: 3 },
                borderRadius: 5,
                maxWidth: "600px",
                width: "100%"
            }}>
                <FormLabel sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}>Preferred Method</FormLabel>
                <RadioGroup
                    row
                    sx={{ justifyContent: "center" }}
                >
                    <FormControlLabel value="y2k" checked={yData.simulator.preferMethod === "y2k"} onChange={preferMethodChange} control={<Radio />} label="¥ ➡︎ K" />
                    <FormControlLabel value="k2y" checked={yData.simulator.preferMethod === "k2y"} onChange={preferMethodChange} control={<Radio />} label="K ➡︎ ¥" />
                </RadioGroup>

                <FormGroup sx={{
                    paddingTop: 2,
                }}>
                    <CurrencyField props={{
                        isAllowed: (values) => {
                            const { floatValue } = values;
                            return !floatValue || floatValue >= 0 && floatValue <= 99999999;
                        },
                        label: "¥ ➡︎ K", prefix: "¥", disabled: yData.simulator.preferMethod != "y2k", value: yData.simulator.y2k.value,
                        onValueChange: y2kChange,
                    }} propsDelIcon={{
                        disabled: yData.simulator.preferMethod != "y2k",
                        onClick: () => {
                            yData.simulator.y2k.value = "";
                            setLocalStorageYData(yData, setYData, "simulator.y2k", yData.simulator.y2k);
                        }
                    }} />
                    <CurrencyField props={{
                        isAllowed: (values) => {
                            const { floatValue } = values;
                            return !floatValue || floatValue >= 0 && floatValue <= 999999999;
                        },
                        label: "K ➡︎ ¥", prefix: "K", disabled: yData.simulator.preferMethod != "k2y", value: yData.simulator.k2y.value,
                        onValueChange: k2yChange
                    }} propsDelIcon={{
                        disabled: yData.simulator.preferMethod != "k2y",
                        onClick: () => {
                            yData.simulator.k2y.value = "";
                            setLocalStorageYData(yData, setYData, "simulator.k2y", yData.simulator.k2y);
                        }
                    }} />

                    <FormLabel sx={{ pt: 3, fontSize: { xs: "1rem", md: "1.2rem" } }}>Handling Charges</FormLabel>
                    <FormControlLabel control={<Checkbox checked={yData.simulator.atmFeeCheck ? true : false} />} label={`ATM fee ${handlingChargesLabel("atm")}`} onChange={
                        (event) => {
                            setLocalStorageYData(yData, setYData, "simulator.atmFeeCheck", event.target.checked);
                            updateY2KorK2Ychanges(yData.simulator.preferMethod);
                        }
                    } />

                    <RadioGroup row sx={{ pl: 3, justifyContent: "center" }} value={yData.simulator.atmType ? yData.simulator.atmType : "lawson"} onChange={
                        (event) => {
                            setLocalStorageYData(yData, setYData, "simulator.atmType", event.target.value);
                            updateY2KorK2Ychanges(yData.simulator.preferMethod);
                        }
                    }>
                        <FormControlLabel value="lawson" control={<Radio />} label="Lawson ATM" disabled={yData.simulator.atmFeeCheck ? false : true} />
                        <FormControlLabel value="yucho" control={<Radio />} label="Yūcho ATM" disabled={yData.simulator.atmFeeCheck ? false : true} />
                    </RadioGroup>

                    <FormControlLabel control={<Checkbox checked={yData.simulator.remitFeeCheck ? true : false} />} label={`SBI Remit fee ${handlingChargesLabel("remit")}`} onChange={
                        (event) => {
                            setLocalStorageYData(yData, setYData, "simulator.remitFeeCheck", event.target.checked);
                            updateY2KorK2Ychanges(yData.simulator.preferMethod);
                        }
                    } />

                    <Alert severity="warning" sx={{ mt: 2 }}>Min. transfer amount must be from ¥2,000 <Link href="/sbi_pricing2.jpg" target="_blank">Check SBI Pricing Detail</Link>
                    </Alert>
                </FormGroup>
            </FormControl>
        </Box>
    );
}
