import React from "react";
import classNames from "classnames";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;