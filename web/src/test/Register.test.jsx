import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../services/authService", () => ({ registerUser: vi.fn() }));

import Register from "../pages/register/Register";
import { registerUser } from "../services/authService";

beforeEach(() => vi.clearAllMocks());

function renderRegister() {
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<div>Login público</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function completeFields(user) {
  await user.type(screen.getByLabelText("common.fullName"), " María José ");
  await user.type(screen.getByLabelText("common.email"), " maria_jose@outlook.com ");
  await user.type(screen.getByLabelText("common.password"), "Strong123");
  await user.type(screen.getByLabelText("common.confirmPassword"), "Strong123");
}

it("requires accepting terms before registration", async () => {
  const user = userEvent.setup();
  renderRegister();
  await completeFields(user);

  await user.click(screen.getByRole("button", { name: "auth.createAccount" }));

  expect(registerUser).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("auth.acceptTerms");
});

it("submits a valid form and returns to login", async () => {
  const user = userEvent.setup();
  registerUser.mockResolvedValue({});
  renderRegister();
  await completeFields(user);
  await user.click(screen.getByRole("checkbox"));

  await user.click(screen.getByRole("button", { name: "auth.createAccount" }));

  await waitFor(() => expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
    name: "María José",
    email: "maria_jose@outlook.com",
    password: "Strong123",
    acceptedTerms: true,
  })));
  await user.click(screen.getByRole("button", { name: "auth.goLogin" }));
  expect(screen.getByText("Login público")).toBeInTheDocument();
});

it("blocks names and emails with an invalid format", async () => {
  const user = userEvent.setup();
  renderRegister();
  await user.type(screen.getByLabelText("common.fullName"), "Johan123");
  await user.type(screen.getByLabelText("common.email"), "johan..acero@gmail");
  await user.type(screen.getByLabelText("common.password"), "Strong123");
  await user.type(screen.getByLabelText("common.confirmPassword"), "Strong123");
  await user.click(screen.getByRole("checkbox"));

  await user.click(screen.getByRole("button", { name: "auth.createAccount" }));

  expect(registerUser).not.toHaveBeenCalled();
  expect(screen.getByText("auth.nameInvalid")).toBeInTheDocument();
  expect(screen.getByText("auth.emailInvalid")).toBeInTheDocument();
});

it("blocks a known provider typo", async () => {
  const user = userEvent.setup();
  renderRegister();
  await user.type(screen.getByLabelText("common.fullName"), "Johan Alexander");
  await user.type(screen.getByLabelText("common.email"), "Prueba12345@gail.com");
  await user.type(screen.getByLabelText("common.password"), "Strong123");
  await user.type(screen.getByLabelText("common.confirmPassword"), "Strong123");
  await user.click(screen.getByRole("checkbox"));

  await user.click(screen.getByRole("button", { name: "auth.createAccount" }));

  expect(registerUser).not.toHaveBeenCalled();
  expect(screen.getByText("auth.emailInvalid")).toBeInTheDocument();
});
