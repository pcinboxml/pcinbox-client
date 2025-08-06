import { useTheContext } from "./services/globalContext";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bgActive } = useTheContext();

  return (
    <section style={{ background: bgActive, height: "100%" }}>
      {children}
    </section>
  );
}
