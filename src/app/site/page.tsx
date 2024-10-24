import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./mainSiteComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
