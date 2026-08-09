/** Shared native control classes for Broad marketing forms. */
export const labelClass = "text-foreground mb-1.5 block text-sm font-medium";

export const inputClass =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";

export const selectClass = inputClass;

export const textareaClass =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 flex min-h-28 w-full rounded-md border px-3 py-2 text-sm shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";

export const submitClass =
  "bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-semibold tracking-wide disabled:pointer-events-none disabled:opacity-50";

export const checkboxClass =
  "border-input text-primary focus-visible:ring-ring/40 mt-0.5 size-4 shrink-0 rounded border shadow-none focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const fieldStackClass = "flex flex-col gap-4";

export const formShellClass = "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14";
