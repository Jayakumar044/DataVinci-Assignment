import React, { useEffect, useRef } from "react";

export default function TriStateCheckbox({ state, onChange, id, label }) {
  const ref = useRef(null);
  const isChecked = state === "checked";
  const isIndeterminate = state === "indeterminate";

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className="me-1"
        id={id}
        checked={isChecked}
        onChange={onChange}
        aria-checked={isIndeterminate ? "mixed" : isChecked}
      />
      {label}
    </label>
  );
}
