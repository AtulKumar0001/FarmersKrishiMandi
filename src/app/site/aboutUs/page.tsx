import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./aboutUsComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
