import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("../services/authSession", () => ({ hasValidSession: vi.fn() }));

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { hasValidSession } from "../services/authSession";

beforeEach(() => vi.clearAllMocks());

function renderProtectedPage() {
  render(
    <MemoryRouter initialEntries={["/home"]}>
      <Routes>
        <Route path="/login" element={<div>Login público</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<div>Inicio privado</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

it("redirects an anonymous visitor to login", () => {
  hasValidSession.mockReturnValue(false);
  renderProtectedPage();
  expect(screen.getByText("Login público")).toBeInTheDocument();
  expect(screen.queryByText("Inicio privado")).not.toBeInTheDocument();
});

it("renders the protected page for an authenticated visitor", () => {
  hasValidSession.mockReturnValue(true);
  renderProtectedPage();
  expect(screen.getByText("Inicio privado")).toBeInTheDocument();
});
