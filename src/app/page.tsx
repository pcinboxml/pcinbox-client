import dynamic from "next/dynamic";

const IndexContent = dynamic(() => import("./index/IndexComponent"), {
  ssr: false,
});

export default function Home() {
  return <IndexContent />;
}
