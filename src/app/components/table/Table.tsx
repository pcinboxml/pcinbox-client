"use client";

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

const Table = ({
  rowsDataGrid,
  columnsDataGrid,
}: {
  rowsDataGrid: GridRowsProp;
  columnsDataGrid: GridColDef[];
}) => {
  return (
    <DataGrid
      rows={rowsDataGrid}
      columns={columnsDataGrid}
      localeText={{
        noRowsLabel: "Sin datos para mostrar",
        paginationRowsPerPage: "Número de pagina",
      }}
      pageSizeOptions={[
        {
          label: "25",
          value: 25,
        },
      ]}
      rowHeight={80}
      sx={{
        "& .MuiDataGrid-cell": {
          borderRight: "1px solid #e5e7eb",
        },
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "1px solid #e5e7eb",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: "18px",
          fontWeight: "500",
          color: "#808080",
          display: "block",
          margin: "auto",
        },
      }}
    />
  );
};

export default Table;
