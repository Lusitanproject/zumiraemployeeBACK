import { RefObject, useEffect } from "react";

type Handler = (event: MouseEvent) => void;

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown",
): void => {
  const event = (event: MouseEvent) => {
    const el = ref?.current;

    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  };

  useEffect(() => {
    window.addEventListener(mouseEvent, event);

    return () => window.removeEventListener(mouseEvent, event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useClickOutside;
