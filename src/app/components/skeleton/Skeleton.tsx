"use client";

import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton = () => {
  return <ContentLoader uniqueKey="static-key" />;
};

export default Skeleton;
