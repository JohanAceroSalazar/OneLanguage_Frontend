import { useEffect } from "react";
import { applyAccessibilitySettings, getAccessibilitySettings, readStoredAccessibility } from "../../services/accessibilityService";
import { hasValidSession } from "../../services/authSession";

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

        if (!hasValidSession()) return;
        getAccessibilitySettings().then(applyAccessibilitySettings).catch(() => undefined);
    }, []);

    return null;
}

export default ThemeBootstrap;
