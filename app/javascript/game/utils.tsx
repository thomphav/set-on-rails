import React from "react";

export const setCsrfToken = () => {
  const metaTag = document.querySelector("meta[name=csrf-token]");
  if (metaTag instanceof HTMLMetaElement) {
    return metaTag ? metaTag.content : "no-csrf-token"
  }
  return "no-csrf-token"
};