import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const phrases = [
  "✨ Sua história está ganhando forma… cada detalhe conta para uma análise única.",
  "🧠 A IA da Zumira está conectando pontos que revelam o seu verdadeiro potencial.",
  "⏳ Estamos analisando suas respostas com todo cuidado para garantir precisão e profundidade.",
  "🌱 Cada segundo investido aqui é um passo para compreender melhor você mesmo(a).",
  "🔍 Estamos transformando dados em insights valiosos para o seu bem-estar.",
  "💡 Quase lá! Sua bioanálise personalizada está quase pronta para te surpreender.",
];

export function LoadingText() {
  const timeout = useRef<NodeJS.Timeout>(null);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    function step() {
      const delay = (Math.random() * 1.5 + 3.5) * 1000;
      console.log(delay);

      timeout.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        step();
      }, delay);
    }

    step();

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return (
    <motion.span
      key={phrases[index]}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {phrases[index]}
    </motion.span>
  );
}
