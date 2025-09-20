"use client";
import { Pagination } from "@mui/material";

const PaginationComponent = ({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}) => {
  return <Pagination count={count} onChange={onChange} page={page} />;
};

export default PaginationComponent;
