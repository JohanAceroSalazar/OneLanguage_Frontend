import { useEffect } from "react";

const fontSizeOptions = {
    small: 0.92,
    medium: 1,
    large: 1.08,
};

function ThemeBootstrap() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedFontSize = localStorage.getItem("fontSize") || "medium";
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.style.colorScheme = savedTheme;
        document.body.style.zoom = String(fontSizeOptions[savedFontSize] || 1);
    }, []);

    return null;
}

export default ThemeBootstrap;
