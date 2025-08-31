import React from "react";
const ReloadLink = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);
export default ReloadLink;
