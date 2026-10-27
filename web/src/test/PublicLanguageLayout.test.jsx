import { fireEvent, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import i18n from "../i18n";
import PublicLanguageLayout from "../components/PublicLanguageLayout";

function Probe() {
    const { t } = useTranslation();
    return <p>{t("auth.login")}</p>;
}

afterEach(() => {
    localStorage.removeItem("publicLanguage");
    localStorage.removeItem("publicTheme");
});

test("public theme stays separate from the authenticated preference", () => {
    document.documentElement.dataset.theme = "dark";
    render(<PublicLanguageLayout><Probe /></PublicLanguageLayout>);

    const toggle = screen.getByRole("button", { name: "Tema visual: Claro" });
    fireEvent.click(toggle);

    expect(localStorage.getItem("publicTheme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
});

test("public language does not change the account language", () => {
    const accountLanguage = i18n.language;
    render(<PublicLanguageLayout><Probe /></PublicLanguageLayout>);

    fireEvent.click(screen.getByLabelText("Idioma: Español"));
    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText("Log in")).toBeTruthy();
    expect(localStorage.getItem("publicLanguage")).toBe("en");
    expect(i18n.language).toBe(accountLanguage);
});
