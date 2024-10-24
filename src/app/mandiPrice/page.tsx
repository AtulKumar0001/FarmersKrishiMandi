import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../../components/MandiPrice/mandiPriceComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
