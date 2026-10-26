export function BrandLogo({ variant = "full", className = "", alt = "CoreCRM" }) {
  const src = variant === "dark" ? "/logo-dark.jpg" : "/logo.png";
  return (
    <img
      src={src}
      alt={alt}
      className={`brand-logo brand-logo--${variant}${className ? ` ${className}` : ""}`}
      draggable={false}
    />
  );
}

export function BrandMark({ className = "", size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt=""
      aria-hidden
      className={`brand-mark-img${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size, objectFit: "contain" }}
      draggable={false}
    />
  );
}
