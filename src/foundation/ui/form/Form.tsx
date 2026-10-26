import * as React from "react";

export type FormProps = React.ComponentPropsWithoutRef<"form">;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(function Form(
  props,
  ref
) {
  return <form ref={ref} {...props} />;
});
