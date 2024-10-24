import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./loginComponent'), { ssr: false });

export default function Page() {
  return <DynamicComponent />;
}
