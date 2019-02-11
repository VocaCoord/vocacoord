import React from "react";

export const withStyles = styles => Component => (
  /* eslint-disable react/no-this-in-sfc */
  <Component {...this.props} styles={styles} />
);
