// app/index/page.tsx
"use client";

import IndexComponent from "./PrincipalComponent";

export const dynamic = "force-dynamic";

const IndexPage = () => {
  return <IndexComponent />;
};

export default IndexPage;
