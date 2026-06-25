import { useEffect } from "react";

const fontSizeOptions = {
    Pequeño: 0.92,
    Mediano: 1,
    Grande: 1.08,
};

function ThemeBootstrap() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedFontSize = localStorage.getItem("fontSize") || "Mediano";
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.style.colorScheme = savedTheme;
        document.body.style.zoom = String(fontSizeOptions[savedFontSize] || 1);
    }, []);

    return null;
}

export default ThemeBootstrap;
