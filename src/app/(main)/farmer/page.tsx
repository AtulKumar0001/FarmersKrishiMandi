import FarmerRegistration from "@/components/Forms/FarmersData";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const Page = async () => {
    // check if the farmer has already filled the form, if yes the forward to the main
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  return <FarmerRegistration />;
};

export default Page;
