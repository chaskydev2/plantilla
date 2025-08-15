import { motion } from "framer-motion";
import classNames from "classnames";
import React from "react";

interface CardAnimateProps {
  // Contenido
  title?: string;
  subtitle?: string;
  image?: string;
  date?: string;
  children?: React.ReactNode;

  // Variantes
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  fullWidth?: boolean;

  // Layout
  align?: "left" | "center" | "right";
  imagePosition?: "top" | "bottom" | "left" | "right";
  imageRatio?: string;

  // Interacción
  hoverEffect?: boolean;
  onClick?: () => void;

  // Iconos
  icon?: React.ReactNode;
  iconPosition?: "before-title" | "after-title";

  // Acciones
  actions?: React.ReactNode[];

  // Accesibilidad
  ariaLabel?: string;
  role?: string;

  // Estilos
  className?: string;
  contentClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;

  // Control
  showTitle?: boolean;
  showSubtitle?: boolean;
  showDivider?: boolean;
}

export const CardAnimate: React.FC<CardAnimateProps> = ({
  // Contenido
  title,
  subtitle,
  image,
  date,
  children,

  // Variantes
  rounded = false,
  shadow = "md",
  fullWidth = false,

  // Layout
  align = "left",
  imagePosition = "top",
  imageRatio = "16/9",

  // Interacción
  hoverEffect = false,
  onClick,

  // Iconos
  icon,
  iconPosition = "before-title",

  // Acciones
  actions = [],

  // Accesibilidad
  ariaLabel,
  role = "article",

  // Estilos
  className = "",
  contentClassName = "",
  imageClassName = "",
  style,

  // Control
  showTitle = true,
  showSubtitle = true,
  showDivider = false,
}) => {
  const cardClasses = classNames(
    "transition duration-300 bg-white overflow-hidden",
    shadow === "sm" && "shadow-sm",
    shadow === "md" && "shadow-md",
    shadow === "lg" && "shadow-lg",
    rounded && "rounded-2xl",
    fullWidth ? "w-full" : "max-w-md",
    `text-${align}`,
    className
  );

  const hoverClasses = hoverEffect ? "hover:scale-105 hover:shadow-xl" : "";

  const renderImage = image && (
    <div className={classNames("overflow-hidden", imageClassName)}>
      <img
        src={image}
        alt={title || "Card Image"}
        className={`w-full object-cover aspect-[${imageRatio}]`}
      />
    </div>
  );

  const renderTitle = showTitle && title && (
    <h3 className="text-xl font-semibold flex items-center gap-2">
      {icon && iconPosition === "before-title" && icon}
      {title}
      {icon && iconPosition === "after-title" && icon}
    </h3>
  );

  const renderSubtitle = showSubtitle && subtitle && (
    <p className="text-gray-500">{subtitle}</p>
  );

  const renderActions = actions.length > 0 && (
    <div className="mt-4 flex gap-2">
      {actions.map((action, index) => (
        <span key={index}>{action}</span>
      ))}
    </div>
  );

  return (
    <motion.article
      onClick={onClick}
      className={`${cardClasses} ${hoverClasses}`}
      aria-label={ariaLabel}
      role={role}
      style={style}
      whileHover={hoverEffect ? { scale: 1.02 } : {}}
    >
      {(imagePosition === "top" || imagePosition === "left") && renderImage}

      <div className={classNames("p-4", contentClassName)}>
        {date && <p className="text-xs text-gray-400">{date}</p>}
        {renderTitle}
        {renderSubtitle}
        {showDivider && <hr className="my-2" />}
        {children}
        {renderActions}
      </div>

      {(imagePosition === "bottom" || imagePosition === "right") && renderImage}
    </motion.article>
  );
};
