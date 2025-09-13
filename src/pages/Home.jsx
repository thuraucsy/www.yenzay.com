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
};
