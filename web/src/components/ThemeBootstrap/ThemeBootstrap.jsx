import { useEffect } from "react";
import { getValidToken } from "../../services/authSession";
import { applyAccessibilitySettings, getAccessibilitySettings, readStoredAccessibility } from "../../services/accessibilityService";

const fontSizeOptions = {
    small: 0.92,
    medium: 1,
    large: 1.08,
};

function ThemeBootstrap() {
    useEffect(() => {
        const localSettings = readStoredAccessibility();
        const savedTheme = localSettings.theme;
        const savedFontSize = localSettings.textSize;
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.style.colorScheme = savedTheme;
        document.body.style.zoom = String(fontSizeOptions[savedFontSize] || 1);
        document.documentElement.dataset.textSize = savedFontSize;

        if (getValidToken()) {
            getAccessibilitySettings()
                .then(applyAccessibilitySettings)
                .catch(() => applyAccessibilitySettings(readStoredAccessibility()));
        }
    }, []);

    return null;
}

export default ThemeBootstrap;
