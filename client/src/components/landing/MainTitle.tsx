import React from "react";
import classNames from "classnames";

interface MainTitleProps {
title: string;
subtitle?: string;
align?: "left" | "center" | "right";
className?: string;
}

export const MainTitle: React.FC<MainTitleProps> = ({
title,
subtitle,
align = "center",
className = "",
}) => {
return (
    <div className={classNames("mb-8", `text-${align}`, className)}>
    <h2 className="text-3xl font-bold">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
);
};
