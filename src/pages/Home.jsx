import { Box, Container } from "@mui/material";

import SimulationResult from "../components/SimulationResult";
import ActionButton from "../components/ActionButton";
import Calendar from "../components/Calendar";
import Simulator from "../components/Simulator";
import Chart from "../components/Chart";
import FxRate from "../components/FxRate";
import { useApp } from "../ThemedApp";

function SelectedItem() {
	const { btnType } = useApp();
	if (btnType == "simulator") {
		return <Simulator />;
	} else if (btnType == "chart") {
		return <Chart />;
	} else if (btnType == "fxRate") {
		return <FxRate />;
	}
	return <Calendar />
}

export default function Home() {
	return (
		<Box sx={styles.container}>
			{/* Scattered Currency Symbols */}
			<Box sx={styles.currencySymbol1}>¥</Box>
			<Box sx={styles.currencySymbol2}>$</Box>
			<Box sx={styles.currencySymbol3}>¥</Box>
			<Box sx={styles.currencySymbol4}>$</Box>
			<Box sx={styles.currencySymbol5}>¥</Box>
			<Box sx={styles.currencySymbol6}>$</Box>
			<Box sx={styles.currencySymbol7}>¥</Box>
			<Box sx={styles.currencySymbol8}>$</Box>
			<Box sx={styles.currencySymbol9}>¥</Box>
			<Box sx={styles.currencySymbol10}>$</Box>
			<Box sx={styles.currencySymbol11}>¥</Box>
			<Box sx={styles.currencySymbol12}>$</Box>
			<Box sx={styles.currencySymbol13}>£</Box>
			<Box sx={styles.currencySymbol14}>€</Box>
			<Box sx={styles.currencySymbol15}>£</Box>
			<Box sx={styles.currencySymbol16}>€</Box>
			<Box sx={styles.currencySymbol17}>£</Box>
			<Box sx={styles.currencySymbol18}>€</Box>
			<Box sx={styles.currencySymbol19}>¥</Box>
			<Box sx={styles.currencySymbol20}>$</Box>
			<Box sx={styles.currencySymbol21}>£</Box>
			<Box sx={styles.currencySymbol22}>€</Box>
			<Box sx={styles.currencySymbol23}>¥</Box>
			<Box sx={styles.currencySymbol24}>$</Box>
			<Box sx={styles.currencySymbol25}>£</Box>
			<Box sx={styles.currencySymbol26}>€</Box>
			<Box sx={styles.currencySymbol27}>¥</Box>
			<Box sx={styles.currencySymbol28}>$</Box>
			<Box sx={styles.currencySymbol29}>£</Box>
			<Box sx={styles.currencySymbol30}>€</Box>

			<Box sx={styles.background} />
			<Container maxWidth="lg" sx={styles.contentWrapper}>
				<SimulationResult />
				<Box sx={styles.actionWrapper}>
					<ActionButton />
				</Box>
				<Box sx={styles.transactions}>
					<SelectedItem />
				</Box>
			</Container>
		</Box>
	);
}

const styles = {
	container: {
		backgroundColor: "#1e293b", // Professional dark slate blue
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		position: "relative",
	},
	background: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: { xs: 200, md: 300 },
		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))`,
		zIndex: 1,
	},
	contentWrapper: {
		position: "relative",
		zIndex: 2,
		flex: 1,
		display: "flex",
		flexDirection: "column",
		paddingTop: { xs: 2, md: 4 },
		paddingBottom: { xs: 2, md: 4 },
	},
	actionWrapper: {
		marginTop: 2,
		marginBottom: 2,
	},
	transactions: {
		flex: 1,
		padding: { xs: 2, md: 4 },
		borderTopLeftRadius: { xs: 25, md: 50 },
		borderTopRightRadius: { xs: 25, md: 50 },
		backgroundColor: "#f1f1f1",
		display: "flex",
		flexDirection: "column",
		minHeight: { xs: "auto", md: "60vh" },
	},
	// Scattered currency symbols
	currencySymbol1: {
		position: "absolute",
		top: "15%",
		left: "8%",
		fontSize: "80px",
		color: "rgba(255, 215, 0, 0.1)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-15deg)",
	},
	currencySymbol2: {
		position: "absolute",
		top: "25%",
		right: "12%",
		fontSize: "60px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(25deg)",
	},
	currencySymbol3: {
		position: "absolute",
		top: "45%",
		left: "15%",
		fontSize: "70px",
		color: "rgba(255, 215, 0, 0.12)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-30deg)",
	},
	currencySymbol4: {
		position: "absolute",
		top: "35%",
		right: "25%",
		fontSize: "50px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(45deg)",
	},
	currencySymbol5: {
		position: "absolute",
		top: "60%",
		left: "5%",
		fontSize: "65px",
		color: "rgba(255, 215, 0, 0.11)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(10deg)",
	},
	currencySymbol6: {
		position: "absolute",
		top: "75%",
		right: "8%",
		fontSize: "55px",
		color: "rgba(255, 215, 0, 0.07)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-20deg)",
	},
	currencySymbol7: {
		position: "absolute",
		top: "55%",
		left: "70%",
		fontSize: "45px",
		color: "rgba(255, 215, 0, 0.1)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(35deg)",
	},
	currencySymbol8: {
		position: "absolute",
		top: "20%",
		left: "60%",
		fontSize: "75px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-40deg)",
	},
	currencySymbol9: {
		position: "absolute",
		top: "80%",
		left: "40%",
		fontSize: "40px",
		color: "rgba(255, 215, 0, 0.06)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(50deg)",
	},
	currencySymbol10: {
		position: "absolute",
		top: "5%",
		right: "40%",
		fontSize: "85px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-5deg)",
	},
	currencySymbol11: {
		position: "absolute",
		top: "65%",
		right: "50%",
		fontSize: "52px",
		color: "rgba(255, 215, 0, 0.11)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(15deg)",
	},
	currencySymbol12: {
		position: "absolute",
		top: "40%",
		left: "35%",
		fontSize: "58px",
		color: "rgba(255, 215, 0, 0.07)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-25deg)",
	},
	currencySymbol13: {
		position: "absolute",
		top: "30%",
		left: "45%",
		fontSize: "62px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(20deg)",
	},
	currencySymbol14: {
		position: "absolute",
		top: "50%",
		right: "35%",
		fontSize: "48px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-35deg)",
	},
	currencySymbol15: {
		position: "absolute",
		top: "10%",
		right: "60%",
		fontSize: "72px",
		color: "rgba(255, 215, 0, 0.1)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(40deg)",
	},
	currencySymbol16: {
		position: "absolute",
		top: "70%",
		left: "25%",
		fontSize: "56px",
		color: "rgba(255, 215, 0, 0.07)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-10deg)",
	},
	currencySymbol17: {
		position: "absolute",
		top: "85%",
		right: "20%",
		fontSize: "44px",
		color: "rgba(255, 215, 0, 0.06)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(30deg)",
	},
	currencySymbol18: {
		position: "absolute",
		top: "22%",
		left: "75%",
		fontSize: "68px",
		color: "rgba(255, 215, 0, 0.11)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-45deg)",
	},
	currencySymbol19: {
		position: "absolute",
		top: "12%",
		left: "30%",
		fontSize: "32px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(15deg)",
	},
	currencySymbol20: {
		position: "absolute",
		top: "68%",
		right: "45%",
		fontSize: "28px",
		color: "rgba(255, 215, 0, 0.07)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-25deg)",
	},
	currencySymbol21: {
		position: "absolute",
		top: "35%",
		left: "55%",
		fontSize: "35px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(35deg)",
	},
	currencySymbol22: {
		position: "absolute",
		top: "78%",
		left: "65%",
		fontSize: "30px",
		color: "rgba(255, 215, 0, 0.06)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-15deg)",
	},
	currencySymbol23: {
		position: "absolute",
		top: "8%",
		right: "25%",
		fontSize: "38px",
		color: "rgba(255, 215, 0, 0.1)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(45deg)",
	},
	currencySymbol24: {
		position: "absolute",
		top: "55%",
		left: "18%",
		fontSize: "26px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-35deg)",
	},
	currencySymbol25: {
		position: "absolute",
		top: "28%",
		right: "55%",
		fontSize: "33px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(25deg)",
	},
	currencySymbol26: {
		position: "absolute",
		top: "72%",
		left: "48%",
		fontSize: "29px",
		color: "rgba(255, 215, 0, 0.07)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-45deg)",
	},
	currencySymbol27: {
		position: "absolute",
		top: "42%",
		right: "15%",
		fontSize: "31px",
		color: "rgba(255, 215, 0, 0.08)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(10deg)",
	},
	currencySymbol28: {
		position: "absolute",
		top: "18%",
		left: "82%",
		fontSize: "34px",
		color: "rgba(255, 215, 0, 0.09)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-20deg)",
	},
	currencySymbol29: {
		position: "absolute",
		top: "85%",
		right: "35%",
		fontSize: "27px",
		color: "rgba(255, 215, 0, 0.06)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(40deg)",
	},
	currencySymbol30: {
		position: "absolute",
		top: "48%",
		left: "8%",
		fontSize: "36px",
		color: "rgba(255, 215, 0, 0.1)",
		fontWeight: "bold",
		fontFamily: "Arial, sans-serif",
		zIndex: 0,
		pointerEvents: "none",
		transform: "rotate(-30deg)",
	},
};
