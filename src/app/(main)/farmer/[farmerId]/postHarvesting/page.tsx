import PostHarvestLanding from "@/components/FarmerPostHarvest/PostHarvestLanding";
// import { createClient } from "@/utils/supabase/server";

const PostHarvestPage = async ({
  params,
}: {
  params: { farmerId: string };
}) => {
  // const supabase = createClient();

  // // Check if the farmer has already filled the form
  // const {  error } = await supabase
  //   .from("post_harvest_crops")
  //   .select("id")
  //   .eq("farmer_id", params.farmerId)
  //   .maybeSingle(); // maybeSingle ensures no error if no data exists

  // if (error) {
  //   console.error("Error checking farmer registration:", error);
  //   return; 
  // }

  // If the farmer has already submitted the form, show PostRequest
  // if (farmerData) {
    return <PostHarvestLanding farmerId={params.farmerId} />;
  // }

  // If no record exists, show the form to post harvest details
  // return <PostHarvestForm farmerId={params.farmerId} />;
};

export default PostHarvestPage;
