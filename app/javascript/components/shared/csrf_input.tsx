import React from "react";

/** Renders a hidden input containing the global CSRF token. Useful when writing an old-fashioned HTML form. */
export function CsrfInput() {
  const csrfParamEl = document.querySelector("meta[name='csrf-param']");
  if (!(csrfParamEl instanceof HTMLMetaElement)) throw new Error("CSRF param name not found in meta");
  const csrfParam = csrfParamEl.content;

  const csrfTokenEl = document.querySelector("meta[name='csrf-token']");
  if (!(csrfTokenEl instanceof HTMLMetaElement)) throw new Error("CSRF token not found in meta");
  const csrfToken = csrfTokenEl.content;

  return <input type="hidden" name={csrfParam} value={csrfToken}/>;
}
