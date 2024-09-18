import MainPage from "@/components/site/MainPage";
import SideBar from "@/components/site/SideBar";

export default function Home() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='md:w-1/4'>
        <SideBar />
      </div>
      <div className='md:w-3/4'>
        <MainPage />
      </div>
    </div>
  );
}
