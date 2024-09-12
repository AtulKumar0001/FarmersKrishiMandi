import MainPage from "@/components/site/MainPage";
import SideBar from "@/components/site/SideBar";

export default function Home() {
  return (
    <div className='md:flex'>
      <SideBar />
      <MainPage/>
    </div>
  );
}
