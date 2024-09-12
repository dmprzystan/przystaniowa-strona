"use client";

type LoadingButtonProps = {
  className?: string;
  loading: boolean;
  children: React.ReactNode;
  color?: string;
};

function LoadingButton(props: LoadingButtonProps) {
  const { loading, children } = props;
  return (
    <div className={`relative overflow-hidden ${props.className}`}>
      <div
        className={`${
          loading ? "opacity-70 blur-sm" : "opacity-100 blur-none"
        } transition-all`}
      >
        {children}
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 p-1.5">
          <div
            className={`inline-block h-full w-auto aspect-square animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] ${
              props.color || "text-primary"
            }`}
            role="status"
          ></div>
        </div>
      )}
    </div>
  );
}

export default LoadingButton;
