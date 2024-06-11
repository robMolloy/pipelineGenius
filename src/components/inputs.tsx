import React, { FormEvent } from "react";

export const TextInput = (p: {
  value: string;
  onInput: (e: string) => void;
  label: string;
  placeholder: string;
}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{p.label}</span>
      </div>
      <input
        type="text"
        placeholder={p.placeholder}
        className="input input-bordered w-full bg-white text-slate-600"
        value={p.value}
        onInput={(e) => {
          const e2 = e as FormEvent<HTMLInputElement> & { target: { value: string } };
          p.onInput(e2.target.value);
        }}
      />
    </label>
  );
};

export const Textarea = (p: {
  value: string;
  onInput: (e: string) => void;
  label: string;
  placeholder: string;
}) => {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text">{p.label}</span>
      </div>
      <textarea
        className="textarea textarea-bordered h-48 bg-white text-slate-600"
        placeholder={p.placeholder}
        onInput={(e) => {
          const e2 = e as FormEvent<HTMLTextAreaElement> & { target: { value: string } };
          p.onInput(e2.target.value);
        }}
        value={p.value}
      />
    </label>
  );
};

export function RadioInput(p: {
  options: { label: string; value: string }[];
  value?: string;
  onSelect: (e: string) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <fieldset className="form-control">
      <div className="label">
        <span className="label-text">What is the script language?</span>
      </div>

      {p.options.map((x, j) => (
        <div key={x.value} className="form-control">
          <label
            className={`border-alert label cursor-pointer border-b ${j === 0 ? "border-t" : ""} border-neutral hover:bg-slate-700 hover:bg-opacity-35`}
          >
            <span className="label-text">{x.label}</span>
            <input
              type="radio"
              className="radio border border-white bg-white bg-opacity-20"
              checked={p.value === x.value}
              onChange={() => p.onSelect(x.value)}
            />
          </label>
        </div>
      ))}
    </fieldset>
  );
}
