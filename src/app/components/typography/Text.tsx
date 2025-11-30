import { clsx } from "clsx";
import { ReactNode, ElementType } from "react";

type TextVariant =
  | "badge"
  | "heading-large"
  | "heading-medium"
  | "heading-small"
  | "body-large"
  | "body-base"
  | "body-small"
  | "caption"
  | "label";

type TextColor =
  | "primary"
  | "secondary"
  | "black"
  | "white"
  | "gray"
  | "black-muted"
  | "white-muted";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  as?: ElementType;
  italic?: boolean;
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  uppercase?: boolean;
  trackingWide?: boolean;
  lineClamp?: number;
  textBalance?: boolean;
}

export function Text({
  children,
  variant = "body-base",
  color = "primary",
  className,
  as,
  italic = false,
  bold = false,
  semibold = false,
  medium = false,
  uppercase = false,
  trackingWide = false,
  lineClamp,
  textBalance = false,
  ...props
}: TextProps) {
  // Determine the HTML element to render
  const getDefaultElement = (variant: TextVariant): ElementType => {
    switch (variant) {
      case "heading-large":
        return "h2";
      case "heading-medium":
        return "h3";
      case "heading-small":
        return "h4";
      case "badge":
      case "caption":
      case "label":
        return "span";
      default:
        return "p";
    }
  };

  const Component = as || getDefaultElement(variant);

  // Base variant styles
  const variantStyles = {
    badge: "text-xs py-1 px-2 rounded-lg",
    "heading-large": "text-3xl font-bold leading-tight sm:text-2xl lg:text-3xl",
    "heading-medium": "text-2xl font-medium lg:text-2xl",
    "heading-small": "text-xl font-bold leading-tight sm:text-xl lg:text-2xl",
    "body-large": "text-base leading-relaxed lg:text-lg",
    "body-base": "text-sm leading-relaxed sm:text-base lg:text-lg",
    "body-small": "text-sm leading-relaxed",
    caption: "text-xs",
    label: "text-xs font-medium",
  };

  // Color styles
  const colorStyles = {
    primary: "text-primary",
    secondary: "text-secondary",
    black: "text-black",
    white: "text-white",
    gray: "text-gray-700",
    "black-muted": "text-black/80",
    "white-muted": "text-white/80",
  };

  // Font weight styles
  const getFontWeight = () => {
    if (bold) return "font-bold";
    if (semibold) return "font-semibold";
    if (medium) return "font-medium";
    return "";
  };

  // Line clamp styles
  const getLineClamp = () => {
    if (!lineClamp) return "";
    return `line-clamp-${lineClamp}`;
  };

  const classes = clsx(
    variantStyles[variant],
    colorStyles[color],
    getFontWeight(),
    {
      italic,
      uppercase,
      "tracking-widest": trackingWide,
      "text-balance": textBalance,
    },
    getLineClamp(),
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

// Convenience components for common use cases
export const Badge = ({ children, ...props }: Omit<TextProps, "variant">) => (
  <Text variant="badge" {...props}>
    {children}
  </Text>
);

export const Heading = ({
  children,
  level = "large",
  ...props
}: Omit<TextProps, "variant"> & { level?: "large" | "medium" | "small" }) => (
  <Text variant={`heading-${level}` as TextVariant} {...props}>
    {children}
  </Text>
);

export const Body = ({
  children,
  size = "base",
  ...props
}: Omit<TextProps, "variant"> & { size?: "large" | "base" | "small" }) => (
  <Text variant={`body-${size}` as TextVariant} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, ...props }: Omit<TextProps, "variant">) => (
  <Text variant="caption" {...props}>
    {children}
  </Text>
);

export const Label = ({ children, ...props }: Omit<TextProps, "variant">) => (
  <Text variant="label" {...props}>
    {children}
  </Text>
);
