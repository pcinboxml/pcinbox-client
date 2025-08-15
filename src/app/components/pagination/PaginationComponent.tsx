"use client";
import { Pagination } from "@mui/material";

const PaginationComponent = ({
  count,
  onChange,
  page
}: {
  count: number;
  onChange: (event: React.ChangeEvent<any>, page: number) => void;
  page: number
}) => {
  return <Pagination count={count} onChange={onChange} page={page} />;
};

export default PaginationComponent;
