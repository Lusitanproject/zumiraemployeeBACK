"use client"
import { PopupButton } from "react-calendly"

export default function CalendlyButton() {
  return (
    <PopupButton
      url="https://calendly.com/fabiana-borges-zumira/demostracao-zumira"
      rootElement={document.body}
      text="Agendar demonstração"
      className="h-12 rounded-[1.5rem] gap-x-2 px-6 whitespace-nowrap text-base font-bold transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-zumira-green text-white hover:bg-primary-700 focus:shadow-focus-ring disabled:bg-primary-200"
    />
  )
}