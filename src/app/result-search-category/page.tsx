import { Suspense } from "react";
import SearchCategoryContent from "./SearchCategoryContent";

const LoadingSpinner = () => {
  return <div>Cargando resultados...</div>;
};

const ResultSearchCategoryPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchCategoryContent />
    </Suspense>
  );
};

export default ResultSearchCategoryPage;
