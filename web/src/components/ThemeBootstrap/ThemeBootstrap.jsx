import { useEffect } from "react";
import { getValidToken } from "../../services/authSession";
import { applyAccessibilitySettings, getAccessibilitySettings } from "../../services/accessibilityService";

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

        if (getValidToken()) {
            getAccessibilitySettings()
                .then(applyAccessibilitySettings)
                .catch(() => undefined);
        }
    }, []);

    return null;
}

export default ThemeBootstrap;
