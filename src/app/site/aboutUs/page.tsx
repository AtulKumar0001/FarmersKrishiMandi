import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../../../components/site/aboutUsComponent"),
  { ssr: false }
);

export default function Page() {
  return <DynamicComponent />;
}
