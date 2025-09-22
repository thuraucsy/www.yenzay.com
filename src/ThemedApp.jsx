import { useState, createContext, useContext, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { deepOrange, grey } from "@mui/material/colors";

import { QueryClientProvider, QueryClient } from "react-query";

import Template from "./Template";
import Home from "./pages/Home";
import { numericFormatter } from "react-number-format";

const AppContext = createContext();

export const queryClient = new QueryClient();

export function useApp() {
	return useContext(AppContext);
}

export function getCurrencyFormatter(currencyNum, decimalScale = 0) {
	if (!currencyNum) { return ""; }
	currencyNum = currencyNum.toString(); /** numericFormatter only accept string */
	return numericFormatter(currencyNum, { thousandSeparator: true, decimalScale });
}

export function setLocalStorageYData(yData, setYData, field, value) {
	const yData_ = { ...yData };
	if (field.indexOf(".") > -1) {
		const fieldArr = field.split(".");
		yData_[fieldArr[0]][fieldArr[1]] = value;
	} else {
		yData_[field] = value;
	}
	setYData(yData_);
	localStorage.setItem("yData", JSON.stringify(yData_));
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Template />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
		],
	},
]);

export default function ThemedApp() {
	const localYData = localStorage.getItem("yData") ? JSON.parse(localStorage.getItem("yData")) : {
		version: 1,
		yenOrGoldToggle: "yen",
		btnType: "calendar",
		simulator: {
			preferMethod: "y2k", /** y2k or k2y */
			y2k: {
				formattedValue: "¥10,000",
				value: "10000",
				floatValue: 10000
			},
			k2y: {
				formattedValue: "¥100,000",
				value: "100000",
				floatValue: 100000
			},
			atmFeeCheck: false,
			remitFeeCheck: false,
			atmType: "lawson",
			goldWeight: 5, /** selected gold weight in grams */
			goldDealer: 'tanaka', /** selected gold dealer */
			goldHandlingFeeCheck: false, /** whether to include gold handling fees */
			sbiPricingObj: {
				"lawson": "",
				"yucho": "",
				"remit": "",
			}

		},
		fxRate: {
			selectedCountry: null,
			amt: "",
			fav: [],
		}
	};

	const [showDrawer, setShowDrawer] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [globalMsg, setGlobalMsg] = useState(null);
	const [auth, setAuth] = useState(null);
	const [mode, setMode] = useState("light");
	const [calendarValue, setCalendarValue] = useState(null);
	const [open, setOpen] = useState(false);
	const [btnType, setBtnType] = useState(localYData.btnType);
	const [yData, setYData] = useState(localYData);
	const [yItem, setYItem] = useState({});

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
				primary: deepOrange,
				banner: mode === "dark" ? grey[800] : grey[200],
				text: {
					fade: grey[500],
				},
			},
		});
	}, [mode]);

	window.addEventListener("error", (event) => {
		console.log("window err", event.message);
		if (event.message) {
			localStorage.clear();
			location.reload();
		}
	});

	window.addEventListener("unhandledrejection", (event) => {
		console.log("unhandledrejection err", event.message);
	});

	return (
		<ThemeProvider theme={theme}>
			<AppContext.Provider
				value={{
					showDrawer,
					setShowDrawer,
					showForm,
					setShowForm,
					globalMsg,
					setGlobalMsg,
					auth,
					setAuth,
					mode,
					setMode,
					calendarValue,
					setCalendarValue,
					open,
					setOpen,
					btnType,
					setBtnType,
					yData,
					setYData,
					yItem,
					setYItem,
				}}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
				<CssBaseline />
			</AppContext.Provider>
		</ThemeProvider>
	);
}
