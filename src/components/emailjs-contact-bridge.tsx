"use client";

import emailjs from "@emailjs/browser";
import { useEffect } from "react";

const configurationMessage =
  "Email service is not configured yet. Please contact me through email or WhatsApp.";
const successMessage = "Message sent successfully. I will get back to you soon.";
const failureMessage =
  "Message could not be sent. Please use email or WhatsApp for now.";
const reconnectMessage =
  "EmailJS is connected, but Gmail needs to be reconnected in the EmailJS dashboard.";

function getEmailJsErrorText(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "text" in error &&
    typeof error.text === "string"
    ? error.text
    : undefined;
}

export function EmailJsContactBridge() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("#conversationForm");
    const status = document.querySelector<HTMLElement>("#formStatus");
    const submitButton = form?.querySelector<HTMLButtonElement>(
      "button[type='submit']",
    );
    if (!form || !status || !submitButton) return;

    const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
    const emailInput = form.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;
    const messageInput = form.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement | null;
    if (!nameInput || !emailInput || !messageInput) return;

    const honeypotField = document.createElement("div");
    honeypotField.className = "honeypot-field";
    honeypotField.setAttribute("aria-hidden", "true");
    const honeypotLabel = document.createElement("label");
    honeypotLabel.htmlFor = "companyWebsite";
    honeypotLabel.textContent = "Company website";
    const honeypot = document.createElement("input");
    honeypot.id = "companyWebsite";
    honeypot.type = "text";
    honeypot.name = "companyWebsite";
    honeypot.tabIndex = -1;
    honeypot.autocomplete = "off";
    honeypotField.append(honeypotLabel, honeypot);
    form.append(honeypotField);

    const successModal = document.createElement("div");
    successModal.className = "email-success-modal";
    successModal.setAttribute("role", "dialog");
    successModal.setAttribute("aria-modal", "true");
    successModal.setAttribute("aria-labelledby", "emailSuccessTitle");
    successModal.setAttribute("hidden", "");
    successModal.innerHTML = `
      <div class="email-success-card" role="document">
        <div class="email-success-mark" aria-hidden="true">✓</div>
        <h3 id="emailSuccessTitle">Message sent</h3>
        <p>I received your message. I will get back to you soon.</p>
        <button type="button" class="email-success-close">Close</button>
      </div>
    `;
    document.body.append(successModal);

    const originalButtonMarkup = submitButton.innerHTML;
    const fieldErrorIds = {
      name: "contact-name-error",
      email: "contact-email-error",
      message: "contact-message-error",
    };
    let startedAt = 0;
    let sending = false;

    const closeSuccessModal = () => {
      successModal.classList.remove("is-open");
      successModal.setAttribute("hidden", "");
    };

    const openSuccessModal = () => {
      successModal.removeAttribute("hidden");
      window.requestAnimationFrame(() => {
        successModal.classList.add("is-open");
        successModal
          .querySelector<HTMLButtonElement>(".email-success-close")
          ?.focus();
      });
    };

    const ensureError = (
      field: HTMLInputElement | HTMLTextAreaElement,
      id: string,
    ) => {
      let error = document.getElementById(id);
      if (!error) {
        error = document.createElement("small");
        error.id = id;
        error.className = "field-error";
        field.closest("label")?.append(error);
      }
      field.setAttribute("aria-describedby", id);
      return error;
    };

    const setFieldError = (
      field: HTMLInputElement | HTMLTextAreaElement,
      id: string,
      message: string,
    ) => {
      const error = ensureError(field, id);
      error.textContent = message;
      field.setAttribute("aria-invalid", "true");
      field.classList.add("field-invalid");
    };

    const clearFieldError = (
      field: HTMLInputElement | HTMLTextAreaElement,
      id: string,
    ) => {
      const error = document.getElementById(id);
      if (error) error.textContent = "";
      field.removeAttribute("aria-invalid");
      field.classList.remove("field-invalid");
    };

    const clearAllErrors = () => {
      clearFieldError(nameInput, fieldErrorIds.name);
      clearFieldError(emailInput, fieldErrorIds.email);
      clearFieldError(messageInput, fieldErrorIds.message);
    };

    const validateForm = () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let firstInvalid: HTMLInputElement | HTMLTextAreaElement | null = null;

      clearAllErrors();

      if (name.length < 2) {
        setFieldError(nameInput, fieldErrorIds.name, "Enter your full name.");
        firstInvalid ??= nameInput;
      }
      if (!emailPattern.test(email)) {
        setFieldError(
          emailInput,
          fieldErrorIds.email,
          "Enter a valid email address.",
        );
        firstInvalid ??= emailInput;
      }
      if (message.length < 10) {
        setFieldError(
          messageInput,
          fieldErrorIds.message,
          "Write at least 10 characters about the role or project.",
        );
        firstInvalid ??= messageInput;
      }

      if (firstInvalid) {
        status.textContent = "Please fix the highlighted fields.";
        firstInvalid.focus();
        return false;
      }
      return true;
    };

    const markStarted = () => {
      if (!startedAt) startedAt = performance.now();
    };

    const handleInput = () => {
      markStarted();
      clearAllErrors();
      status.textContent = "";
    };

    const handleModalClick = (event: MouseEvent) => {
      if (event.target === successModal) closeSuccessModal();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSuccessModal();
    };

    const submit = async (event: SubmitEvent) => {
      event.preventDefault();
      if (sending || honeypot.value) return;

      if (!validateForm()) return;
      if (!startedAt || performance.now() - startedAt < 1_800) {
        status.textContent = "Please take a moment to review your message.";
        return;
      }

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) {
        status.textContent = configurationMessage;
        return;
      }

      const values = new FormData(form);
      sending = true;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      form.setAttribute("aria-busy", "true");
      status.textContent = "Sending...";

      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: String(values.get("name") || "").trim(),
            reply_to: String(values.get("email") || "").trim(),
            submitted_at: new Date().toISOString(),
            source_page: window.location.href,
            message: String(values.get("message") || "").trim(),
          },
          {
            publicKey,
          },
        );
        form.reset();
        startedAt = 0;
        status.textContent = successMessage;
        openSuccessModal();
      } catch (error: unknown) {
        const responseText = getEmailJsErrorText(error);
        status.textContent = responseText?.includes("Invalid grant")
          ? reconnectMessage
          : failureMessage;
        if (process.env.NODE_ENV === "development") {
          const statusCode =
            typeof error === "object" &&
            error !== null &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : undefined;
          console.error("EmailJS request failed.", {
            status: statusCode,
            text: responseText ?? "EmailJS request failed",
          });
        }
      } finally {
        sending = false;
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonMarkup;
        form.removeAttribute("aria-busy");
      }
    };

    successModal
      .querySelector<HTMLButtonElement>(".email-success-close")
      ?.addEventListener("click", closeSuccessModal);
    successModal.addEventListener("click", handleModalClick);
    document.addEventListener("keydown", handleKeydown);
    form.addEventListener("focusin", markStarted);
    form.addEventListener("input", handleInput);
    form.addEventListener("submit", submit);

    return () => {
      form.removeEventListener("focusin", markStarted);
      form.removeEventListener("input", handleInput);
      form.removeEventListener("submit", submit);
      document.removeEventListener("keydown", handleKeydown);
      honeypotField.remove();
      successModal.remove();
    };
  }, []);

  return null;
}
