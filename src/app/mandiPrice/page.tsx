import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./mandiPriceComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
