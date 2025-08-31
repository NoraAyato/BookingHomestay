import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <div className="bg-gray-50 py-4 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <li className="flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                )}
                <li
                  className={
                    index === items.length - 1
                      ? "text-gray-700 font-medium truncate max-w-[200px]"
                      : ""
                  }
                >
                  {item.link ? (
                    <Link to={item.link} className="hover:text-rose-600">
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
