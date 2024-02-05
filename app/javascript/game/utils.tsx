import React from "react";

export const setCsrfToken = () => {
  const metaTag = document.querySelector("meta[name=csrf-token]");
  if (metaTag instanceof HTMLMetaElement) {
    return metaTag ? metaTag.content : "no-csrf-token"
  }
  return "no-csrf-token"
};

export const formatTimeFromCentiseconds = (centiseconds: number) => {
  const totalSeconds = Math.floor(centiseconds / 100);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [minutes, seconds].map(v => v.toString().padStart(2, '0')).join(":");
};