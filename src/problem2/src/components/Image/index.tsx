import clsx from "clsx";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  placeholder?: string;
}

export const Image = ({
  containerClassName,
  className,
  placeholder,
  ...props
}: ImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const fallback = img.nextSibling as HTMLElement;
    if (fallback) {
      img.style.display = "none";
      fallback.style.display = "flex";
    }
  };

  const handleImageSuccess = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const fallback = img.nextSibling as HTMLElement;
    if (fallback) {
      img.style.display = "block";
      fallback.style.display = "none";
    }
  };

  return (
    <div className={containerClassName}>
      <img
        {...props}
        className={clsx(
          "w-6 h-6 rounded-full block bg-white/10 select-none",
          className
        )}
        onError={handleImageError}
        onLoad={handleImageSuccess}
      />
      <div className="hidden items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-xs font-semibold uppercase">
        {placeholder}
      </div>
    </div>
  );
};
