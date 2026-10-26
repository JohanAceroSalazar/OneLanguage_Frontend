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
});

test("public language does not change the account language", () => {
    const accountLanguage = i18n.language;
    render(<PublicLanguageLayout><Probe /></PublicLanguageLayout>);

    fireEvent.change(screen.getByLabelText("Idioma"), { target: { value: "en" } });

    expect(screen.getByText("Log in")).toBeTruthy();
    expect(localStorage.getItem("publicLanguage")).toBe("en");
    expect(i18n.language).toBe(accountLanguage);
});
