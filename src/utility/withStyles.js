import React from "react";

export const withStyles = styles => WrappedComponent => props => (
  <WrappedComponent {...props} styles={styles} />
);
