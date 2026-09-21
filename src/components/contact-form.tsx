"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  message: z.string().trim().min(20, "Please share at least 20 characters."),
  companyWebsite: z.string().max(0),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [started, setStarted] = useState(0);
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "", companyWebsite: "" },
  });
  const submit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus(
      "Form validated. Please use the EmailJS contact form on the portfolio page.",
    );
  };
  return (
    <form
      className="contact-form"
      noValidate
      onFocusCapture={() => !started && setStarted(1)}
      onSubmit={handleSubmit(submit)}
    >
      <div className="form-top">
        <strong>New message</strong>
        <span className="mono">Secure draft / 01</span>
      </div>
      <label>
        Name
        <input
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
          {...register("name")}
        />
      </label>
      <p className="field-error" id="name-error">
        {errors.name?.message}
      </p>
      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          {...register("email")}
        />
      </label>
      <p className="field-error" id="email-error">
        {errors.email?.message}
      </p>
      <label>
        Role, product, or requirement
        <textarea
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby="message-error"
          {...register("message")}
        />
      </label>
      <p className="field-error" id="message-error">
        {errors.message?.message}
      </p>
      <label className="honeypot" aria-hidden="true">
        Company website
        <input
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </label>
      <button className="button primary" disabled={isSubmitting}>
        {isSubmitting ? (
          "Validating..."
        ) : (
          <>
            Validate message <Send size={16} />
          </>
        )}
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
