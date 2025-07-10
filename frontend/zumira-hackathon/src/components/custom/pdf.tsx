"use client";

import { Font } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Borel",
  src: "/fonts/Borel-Regular.ttf",
});

export const PDFViewer = dynamic(async () => await import("@react-pdf/renderer").then((m) => m.PDFViewer), {
  ssr: false,
  loading: () => <>Loading...</>,
});

export const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink), {
  ssr: false,
  loading: () => (
    <div className="flex flex-row size-fit gap-2 text-text-25 px-4 py-1 bg-primary-500 rounded-full items-center opacity-50">
      <Download className="size-4.5" />
      <span className="font-semibold">Baixar</span>
    </div>
  ),
});
