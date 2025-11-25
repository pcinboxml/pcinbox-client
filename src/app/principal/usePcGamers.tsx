import { useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

interface UseProductsParams {
    tipo: string;
    itemsPerPage?: number;
}

const usePcGamers = ({ tipo, itemsPerPage = 8 }: UseProductsParams) => {
    const { dataProducts } = useTheContext();
    const [page, setPage] = useState(1);

    const filteredProducts = useMemo(() => {
        if (!dataProducts || dataProducts.length === 0) return [];

        return dataProducts.filter((item) => {
            try {
                if (!item.caracteristicas) return false;
                const caracteristicas =
                    typeof item.caracteristicas === "string"
                        ? JSON.parse(item.caracteristicas)
                        : item.caracteristicas;

                const tipoProp = caracteristicas.find((c: any) => c.prop === "tipo");
                return tipoProp?.value === tipo;
            } catch (error) {
                console.error("Error parseando caracteristicas:", error);
                return false;
            }
        });
    }, [dataProducts, tipo]);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return {
        page,
        totalPages,
        handlePageChange,
        currentPageProducts,
    };
};

export default usePcGamers;
