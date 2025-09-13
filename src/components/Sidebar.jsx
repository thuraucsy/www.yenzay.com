import { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Link } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";

const drawerWidth = 280;

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const drawer = (
        <Box sx={{ width: drawerWidth, p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: "bold", marginLeft: "45px" }}>
                    Other Projects
                </Typography>
                <IconButton onClick={toggleDrawer} sx={{ color: "#1e293b" }}>
                    <Close />
                </IconButton>
            </Box>

            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="https://jlpt-bunpou.yenzay.com/" target="_blank" rel="noopener" sx={styles.link}>
                        <ListItemText
                            primary="JLPT Bunpou"
                            secondary="Japanese Language Learning"
                            sx={styles.listItemText}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="https://mm-epub.yenzay.com/" target="_blank" rel="noopener" sx={styles.link}>
                        <ListItemText
                            primary="MM ePub"
                            secondary="Myanmar eBook Platform"
                            sx={styles.listItemText}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="https://copy.yenzay.com/" target="_blank" rel="noopener" sx={styles.link}>
                        <ListItemText
                            primary="File Transfer Service"
                            secondary="Small File Transfer Using P2P Within the Same Local Network"
                            sx={styles.listItemText}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    position: "fixed",
                    top: 16,
                    left: 16,
                    zIndex: 1300,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#1e293b",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                }}
            >
                <Menu />
            </IconButton>

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                sx={{
                    "& .MuiDrawer-paper": {
                        backgroundColor: "#f8f9fa",
                        borderRight: "1px solid #e0e0e0",
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

const styles = {
    link: {
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
        },
    },
    listItemText: {
        "& .MuiListItemText-primary": {
            fontWeight: 500,
            color: "#1e293b",
        },
        "& .MuiListItemText-secondary": {
            color: "#666",
            fontSize: "0.875rem",
        },
    },
};
