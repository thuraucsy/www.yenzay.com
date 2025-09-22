import CurrencyField from "../components/CurrencyField";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, FormGroup, Checkbox, Link, Alert, Select, MenuItem, InputLabel, Typography } from '@mui/material';
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

    // Gold dealer options with fixed handling charges based on weight
    // Tanaka Kikinzoku fees (from tt.tanaka.jp/guide/fee/):
    // - 500g/1kg: ¥0
    // - 100g/200g/300g: ¥16,500
    // - 50g: ¥8,800
    // - 5g/10g/20g: ¥4,400
    // Nihon Material fees (from www.material.co.jp/charge.php):
    // - 1kg/500g/300g/200g/100g: ¥0
    // - 50g: ¥1,540
    // - 20g: ¥2,420
    // - 10g/5g: (not specified, using higher fee assumption)
    const goldDealerOptions = [
        { value: 'tanaka', label: 'Tanaka Kikinzoku' },
        { value: 'nihon', label: 'Nihon Material' }
    ];

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

    // Gold weight options in grams
    const goldWeightOptions = [
        { value: 5, label: '5g' },
        { value: 10, label: '10g' },
        { value: 20, label: '20g' },
        { value: 50, label: '50g' },
        { value: 100, label: '100g' },
        { value: 200, label: '200g' },
        { value: 300, label: '300g' },
        { value: 500, label: '500g' },
        { value: 1000, label: '1kg' },
        { value: 12500, label: '12.5kg' }
    ];

    const handleGoldWeightChange = (event) => {
        setLocalStorageYData(yData, setYData, "simulator.goldWeight", event.target.value);
    };

    const handleGoldDealerChange = (event) => {
        setLocalStorageYData(yData, setYData, "simulator.goldDealer", event.target.value);
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

    const goldHandlingChargesLabel = () => {
        if (!yData.simulator.goldHandlingFeeCheck || !yData.simulator.goldDealer) {
            return "";
        }
        const handlingFee = getGoldHandlingFee(yData.simulator.goldDealer, yData.simulator.goldWeight || 1);
        return handlingFee === 0 ? "(free)" : `(¥${getCurrencyFormatter(handlingFee)})`;
    };

    if (yData.yenOrGoldToggle === 'gold') {
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
                    <FormLabel sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, mb: 2 }}>Gold Purchase Calculator</FormLabel>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Gold Dealer</InputLabel>
                        <Select
                            value={yData.simulator.goldDealer || 'tanaka'}
                            label="Select Gold Dealer"
                            onChange={handleGoldDealerChange}
                        >
                            {goldDealerOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Select Gold Weight</InputLabel>
                        <Select
                            value={yData.simulator.goldWeight || ''}
                            label="Select Gold Weight"
                            onChange={handleGoldWeightChange}
                        >
                            {goldWeightOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormLabel sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, mb: 1 }}>Handling Charges</FormLabel>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={yData.simulator.goldHandlingFeeCheck || false}
                                onChange={(event) => {
                                    setLocalStorageYData(yData, setYData, "simulator.goldHandlingFeeCheck", event.target.checked);
                                }}
                            />
                        }
                        label={`Dealer premium ${goldHandlingChargesLabel()}`}
                        disabled={!yData.simulator.goldDealer}
                    />

                    {yData.simulator.goldWeight && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Base Gold Price: ¥{getCurrencyFormatter(yItem?.GoldPriceYenPerGram || 0)} /g
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                Total Price: ¥{getCurrencyFormatter(calculateGoldPrice())}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                Weight: {goldWeightOptions.find(opt => opt.value === yData.simulator.goldWeight)?.label}
                                {yData.simulator.goldDealer && (
                                    <> • Dealer: {goldDealerOptions.find(opt => opt.value === yData.simulator.goldDealer)?.label}</>
                                )}
                            </Typography>
                        </Box>
                    )}

                    <Alert severity="info" sx={{ mt: 2 }}>
                        Premium rates are estimates. Please check with dealers for current rates.
                    </Alert>
                </FormControl>
            </Box>
        );
    }

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
