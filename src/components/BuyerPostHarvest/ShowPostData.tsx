import { createClient } from "@/utils/supabase/server";
import CropCards from "./CropCards";

const ShowPostCrops = async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("post_harvest_crops")
    .select("*");


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Available Crops</h2>
      <CropCards initialCrops={data || []} />
    </div>
  );
};

export default ShowPostCrops;