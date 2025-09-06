import { ButtonHTMLAttributes } from "react";

export default function IconButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-gray-50 " +
        (props.className ?? "")
      }
    />
  );
}
