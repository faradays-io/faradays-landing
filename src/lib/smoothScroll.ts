import type { MouseEvent } from "react";

export const scrollToSection = (target: string) => (e: MouseEvent) => {
  e.preventDefault();
  const id = target.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
