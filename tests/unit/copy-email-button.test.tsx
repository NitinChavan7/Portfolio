import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  CopyEmailButton,
  fallbackCopyEmail,
  portfolioEmail,
} from "@/components/copy-email-button";

describe("Copy email action", () => {
  beforeEach(() => {
    vi.mocked(navigator.clipboard.writeText).mockReset();
  });

  it("copies the exact portfolio email and announces success", async () => {
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue();
    render(<CopyEmailButton />);
    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        portfolioEmail,
      ),
    );
    expect(portfolioEmail).toBe("nitin.k.chavan1001@gmail.com");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Email copied to clipboard",
    );
  });

  it("uses the hidden-textarea fallback when Clipboard API is unavailable", () => {
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      value: execCommand,
      configurable: true,
    });

    fallbackCopyEmail(portfolioEmail);

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).not.toBeInTheDocument();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      configurable: true,
    });
  });
});
