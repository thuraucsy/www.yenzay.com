import { Box, Container, Snackbar, Fab, useScrollTrigger, Zoom } from "@mui/material";

import { KeyboardArrowUp } from "@mui/icons-material";

import { Outlet } from "react-router-dom";

import { useApp } from "./ThemedApp";
import Sidebar from "./components/Sidebar";

function ScrollTop(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor",
        );

        if (anchor) {
            anchor.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    };

    return (
        <Zoom in={trigger}>
            <Box
                role="presentation"
                sx={{ position: "fixed", bottom: 32, right: 16, zIndex: "9999 !important" }}
            >
                {children}
            </Box>
        </Zoom>
    );
}

export default function Template() {
    const { globalMsg, setGlobalMsg } = useApp();

    return (
        <>
            <Sidebar />
            <Box>
                <div id="back-to-top-anchor" />
                <Outlet />

                <Snackbar
                    anchorOrigin={{
                        horizontal: "center",
                        vertical: "bottom",
                    }}
                    open={Boolean(globalMsg)}
                    autoHideDuration={3000}
                    onClose={() => setGlobalMsg(null)}
                    message={globalMsg}
                />
            </Box>

            <ScrollTop>
                <Fab
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                    sx={{ zIndex: 9999 }}
                    onClick={(event) => {
                        const anchor = (event.target.ownerDocument || document).querySelector(
                            "#back-to-top-anchor",
                        );

                        if (anchor) {
                            anchor.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                        }
                    }}
                >
                    <KeyboardArrowUp />
                </Fab>
            </ScrollTop>
        </>
    );
}
