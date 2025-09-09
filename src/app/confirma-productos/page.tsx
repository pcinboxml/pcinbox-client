"use client";

import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";

const ConfirmaProducts = () => {
  return (
    <section className="w-[80%] mx-auto my-5">
      <TimelineComponent activeStep={1} />
      <div className="container-tabla border w-[90%] mx-auto my-3">
        <div
          className="header-container-tabla w-[100%] p-2 bg-[#666666]"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <img
            src="/logo_blanco_pcinbox.png"
            width={70}
            height={70}
            style={{ objectFit: "contain", marginLeft: "10px" }}
          />
        </div>
        <div className="content-tabla-confirma-productos">
          <Table
            rowsDataGrid={[
              {
                id: 1,
                img: "valor 1",
              },
            ]}
            columnsDataGrid={[
              {
                field: "img",
                headerName: "Imagen",
                renderCell: (params: any) => {
                  if (params.value) {
                    return (
                      <div className="pb-2 h-[80px]">
                        <span>valor 1</span>
                      </div>
                    );
                  } else {
                    return <span>{params.value}</span>;
                  }
                },
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default ConfirmaProducts;
