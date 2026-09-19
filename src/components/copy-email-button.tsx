"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const portfolioEmail = "nitin.k.chavan1001@gmail.com";

export function fallbackCopyEmail(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Fallback copy failed");
}

export function CopyEmailButton() {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(portfolioEmail);
      } else {
        fallbackCopyEmail(portfolioEmail);
      }
      setCopied(true);
      setStatus("Email copied to clipboard");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setCopied(false);
        setStatus("");
      }, 2000);
    } catch {
      setCopied(false);
      setStatus(`Could not copy email. Please use ${portfolioEmail}`);
    }
  };

  return (
    <div className="copy-email-action">
      <button className="button" type="button" onClick={copyEmail}>
        {copied ? "Copied" : "Copy email"}
        {copied ? <Check size={17} /> : <Copy size={17} />}
      </button>
      <span className="copy-status" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
