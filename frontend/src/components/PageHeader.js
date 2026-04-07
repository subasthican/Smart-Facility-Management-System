import React from "react";

const PageHeader = ({ breadcrumb, title, subtitle, actions }) => {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{breadcrumb}</p>}
        <h1 className="sf-title">{title}</h1>
        {subtitle && <p className="sf-subtitle mt-1">{subtitle}</p>}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;