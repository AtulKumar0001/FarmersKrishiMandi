import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../../components/loginComponent/loginComponent"),
  { ssr: false }
);

export default function Page() {
  return <DynamicComponent />;
}
