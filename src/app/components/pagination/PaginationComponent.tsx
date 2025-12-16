"use client";
import { Pagination } from "@mui/material";
import React from "react";

const PaginationComponent = ({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    onChange(event, value);
  };

  return <Pagination count={count} page={page} onChange={handleChange} />;
};

export default PaginationComponent;
