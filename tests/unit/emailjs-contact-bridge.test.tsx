import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import emailjs from "@emailjs/browser";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailJsContactBridge } from "@/components/emailjs-contact-bridge";

vi.mock("@emailjs/browser", () => ({
  default: { send: vi.fn() },
}));

const sendMock = vi.mocked(emailjs.send);

function mountForm() {
  document.body.innerHTML = `
    <form id="conversationForm" novalidate>
      <label>Name<input name="name" required></label>
      <label>Email<input name="email" type="email" required></label>
      <label>Message<textarea name="message" required></textarea></label>
      <button type="submit">Send message <span>↗</span></button>
      <p id="formStatus" role="status" aria-live="polite"></p>
    </form>
  `;
  render(<EmailJsContactBridge />);
  const form = document.querySelector<HTMLFormElement>("#conversationForm")!;
  const name = screen.getByLabelText("Name");
  const email = screen.getByLabelText("Email");
  const message = screen.getByLabelText("Message");
  fireEvent.focus(name);
  fireEvent.change(name, { target: { value: "  Akshay Visitor  " } });
  fireEvent.change(email, { target: { value: "  visitor@example.com  " } });
  fireEvent.change(message, { target: { value: "  A useful message  " } });
  vi.mocked(performance.now).mockReturnValue(3_000);
  return { form, name, email, message };
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "test-service";
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "test-template";
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "test-public-key";
  vi.spyOn(performance, "now").mockReturnValue(1_000);
  sendMock.mockReset();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("EmailJS contact bridge", () => {
  it("keeps the honeypot in an assistive-hidden, unfocusable wrapper", () => {
    const { form } = mountForm();
    const wrapper = form.querySelector(".honeypot-field");
    const honeypot = form.elements.namedItem(
      "companyWebsite",
    ) as HTMLInputElement;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(honeypot).toBeInTheDocument();
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot).not.toHaveAttribute("hidden");
  });

  it("sends the exact trimmed template parameters and resets on success", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });
    const { form, name, email, message } = mountForm();

    await act(async () => fireEvent.submit(form));

    expect(sendMock).toHaveBeenCalledTimes(1);
    const [serviceId, templateId, parameters, options] = sendMock.mock.calls[0];
    expect(serviceId).toBe("test-service");
    expect(templateId).toBe("test-template");
    expect(options).toEqual({ publicKey: "test-public-key" });
    expect(parameters).toMatchObject({
      from_name: "Akshay Visitor",
      reply_to: "visitor@example.com",
      source_page: window.location.href,
      message: "A useful message",
    });
    expect(new Date(String(parameters!.submitted_at)).toISOString()).toBe(
      parameters!.submitted_at,
    );
    expect(name).toHaveValue("");
    expect(email).toHaveValue("");
    expect(message).toHaveValue("");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Message sent successfully. I will get back to you soon.",
    );
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveClass("is-open"));
    expect(screen.getByRole("dialog")).toHaveTextContent("Message sent");
  });

  it("disables duplicate submission and announces the pending state", async () => {
    let resolveSend!: (value: { status: number; text: string }) => void;
    sendMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve;
      }),
    );
    const { form } = mountForm();

    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /sending/i })).toHaveTextContent("Sending...");
    expect(screen.getByRole("status")).toHaveTextContent("Sending...");

    await act(async () => resolveSend({ status: 200, text: "OK" }));
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /send message/i })).toHaveTextContent("Send message");
  });

  it("preserves values and announces a failed request", async () => {
    sendMock.mockRejectedValue({ status: 500, text: "Provider error" });
    const { form, name, email, message } = mountForm();

    await act(async () => fireEvent.submit(form));

    expect(name).toHaveValue("  Akshay Visitor  ");
    expect(email).toHaveValue("visitor@example.com");
    expect(message).toHaveValue("  A useful message  ");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Message could not be sent. Please use email or WhatsApp for now.",
    );
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("shows field validation messages before sending", async () => {
    document.body.innerHTML = `
      <form id="conversationForm" novalidate>
        <label>Name<input name="name" required></label>
        <label>Email<input name="email" type="email" required></label>
        <label>Message<textarea name="message" required></textarea></label>
        <button type="submit">Send message</button>
        <p id="formStatus" role="status" aria-live="polite"></p>
      </form>
    `;
    render(<EmailJsContactBridge />);
    const form = document.querySelector<HTMLFormElement>("#conversationForm")!;

    await act(async () => fireEvent.submit(form));

    expect(sendMock).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Please fix the highlighted fields.",
    );
    expect(screen.getByText("Enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(
      screen.getByText("Write at least 10 characters about the role or project."),
    ).toBeInTheDocument();
  });

  it("does not send when configuration is missing", async () => {
    delete process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const { form } = mountForm();

    await act(async () => fireEvent.submit(form));

    expect(sendMock).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Email service is not configured yet. Please contact me through email or WhatsApp.",
    );
  });

  it("does not send when the honeypot is populated", async () => {
    const { form } = mountForm();
    const honeypot = form.elements.namedItem(
      "companyWebsite",
    ) as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "https://spam.invalid" } });

    await act(async () => fireEvent.submit(form));

    expect(sendMock).not.toHaveBeenCalled();
  });
});
