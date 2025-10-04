import { action } from "./provider";

export const subscribeEmail = async (email: string) =>
  action({
    url: `/service/subscribe?email=${email}`,
    method: "POST",
  });


