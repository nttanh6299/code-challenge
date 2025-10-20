import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={clsx(
        "flex-1 bg-transparent border-0 text-white outline-none p-0 placeholder:text-white/30",
        className
      )}
    />
  );
};
