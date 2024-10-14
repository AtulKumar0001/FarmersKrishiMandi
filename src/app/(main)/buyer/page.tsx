import BuyerRegistration from "@/components/Forms/BuyersData";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const Page = async () => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/login"); // Adjust this path to your login page route
  }

  // Check if the farmer has already filled the form
  const { data: farmerData, error } = await supabase
    .from("buyer_registrations")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle(); // Change .single() to .maybeSingle()

  if (error && error.code !== "PGRST116") {
    console.error("Error checking buyer registration:", error);
    // Handle the error appropriately
    // You might want to redirect to an error page or show an error message
    return; // or redirect to an error page
  }

  // If the farmer has already registered, redirect to the main page or their dashboard
  if (farmerData) {
    redirect(`/buyer/${user.id}`); // Adjust this path to your main dashboard route
  } 
    
    return <BuyerRegistration userId={user.id} />;
};

export default Page;
