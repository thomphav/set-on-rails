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

export const formatTimeFromMilliseconds = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(":");
};

export const timeSince = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes === 0) {
    return 'Just now';
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours === 1) {
      return '1 hour ago';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days === 1) {
        return '1 day ago';
      } else {
        return `${days} days ago`;
      }
    }
  }
}