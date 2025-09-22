import { Card, ListItem, ListItemText, IconButton, Slide, Box, ListItemIcon } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { ArrowCircleUp as ArrowCircleUpIcon } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { useApp } from "../ThemedApp";
import { getCurrencyFormatter } from "../ThemedApp";

export default function Item({ item, prevItem, yData }) {
	const { setYItem, setGlobalMsg, yItem } = useApp();

	const CustomButton = styled(IconButton)({
		"&:hover": {
			color: "rgb(255, 0, 157)",
		},
	});

	return (
		<Slide direction="up" in={true} mountOnEnter unmountOnExit>

			<Card sx={{ mb: 2 }}>

				<ListItem secondaryAction={
					(yData.yenOrGoldToggle === 'yen' && yItem.MMKRatePerYen !== item.MMKRatePerYen) ||
					(yData.yenOrGoldToggle === 'gold' && yItem.GoldPriceYenPerGram !== item.GoldPriceYenPerGram) ?
					<CustomButton onClick={(e) => {
						setYItem(item);
						setGlobalMsg(yData.yenOrGoldToggle === 'gold' ? "Gold Price updated" : "Simulation Result updated")
					}}>
						<ArrowCircleUpIcon />
					</CustomButton> : <Box />
				}>
					<ListItemText style={(prevItem && (
						(yData.yenOrGoldToggle === 'yen' && prevItem.MMKRatePerYen !== item.MMKRatePerYen) ||
						(yData.yenOrGoldToggle === 'gold' && prevItem.GoldPriceYenPerGram !== item.GoldPriceYenPerGram)
					)) ? styles.changedStyle : null}
						primary={yData.yenOrGoldToggle === 'gold'
							? `Gold Price: ¥${getCurrencyFormatter(item.GoldPriceYenPerGram)} /g`
							: `K${item.MMKRatePerYen} /¥   (or)   ¥${getCurrencyFormatter(100000 / item.MMKRatePerYen)} /1lakh`
						}
						secondary={yData.yenOrGoldToggle === 'gold'
							? item.GoldPriceDateTime
							: `${item.YearMonth.split("/")[1]}/${item.DayTime}`
						}
					/>
				</ListItem>
			</Card>
		</Slide>
	);
}

const styles = {
    changedStyle: {
		fontWeight: "bold",
		color: "rgb(249, 19, 161)",
	}
}
