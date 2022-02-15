import { Reveal as ReactReveal } from "react-text-reveal";

export const Reveal = ({ children, restrictReveal, ...props }) => {
  return restrictReveal ? <>{children}</> : <ReactReveal {...props}>{children}</ReactReveal>;
};
