"use client"

import { PopupWidget } from "react-calendly"

export default function CalendlyWidget() {
  return (
    <div>
      <PopupWidget
        color="#36ad71"
        rootElement={document.body}
        text="Agendar demonstração"
        textColor="#ffffff"
        url="https://calendly.com/fabiana-borges-zumira/demostracao-zumira"
      />
    </div>
  )
}