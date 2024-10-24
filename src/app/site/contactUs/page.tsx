import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./contactUsComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
