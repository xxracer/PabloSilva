import { btnCss } from "./button";

/**
 * Inyecta estilos de primitives (Button, etc.) una sola vez en el root layout.
 * Se renderiza como <style> vacío para tener un mount point.
 */
export function GlobalStyles() {
  return (
    <style id="primitive-styles" dangerouslySetInnerHTML={{ __html: btnCss }} />
  );
}
