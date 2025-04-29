"use client"

import { PopupWidget } from "react-calendly"

export default function CalendlyWidget() {
  return (
    <div>
      <PopupWidget
        url="https://calendly.com/fabiana-borges-zumira/demostracao-zumira"
        rootElement={document.body}
        text="Agendar demonstração"
        color="#36ad71"
        textColor="#ffffff"
      />
    </div>
  )
}