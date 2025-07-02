"use client";

import { useEffect, useState } from "react";

import { resendCode } from "../actions";

export function ResendButton() {
  // Esperar 30 segundos pra enviar novamente
  const DELAY_SECONDS = 30;
  const [counter, setCounter] = useState<number>(DELAY_SECONDS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleClick() {
    setLoading(true);
    await resendCode();
    setCounter(DELAY_SECONDS);
    setLoading(false);
  }

  return (
    <div>
      <button
        className={`flex w-full justify-center mt-5 bg-none  ${
          loading ? "text-primary-700 pointer-events-none" : "text-primary-600 cursor-pointer hover:text-primary-700"
        } disabled:text-text-400 disabled:cursor-not-allowed`}
        disabled={counter > 0}
        onClick={handleClick}
      >
        Enviar outro código{counter > 0 && ` (${counter}s)`}
      </button>
    </div>
  );
}
