import React from "react";
import { createPortal } from "react-dom";

const AppModal = ({ children, onClose, overlayClassName = "" }) => {
  return createPortal(
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm ${overlayClassName}`}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div onMouseDown={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
};

export default AppModal;
