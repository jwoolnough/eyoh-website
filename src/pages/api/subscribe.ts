import type { APIRoute } from "astro";
import client, {
  type ErrorResponse,
} from "@mailchimp/mailchimp_marketing";

client.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY,
  server: import.meta.env.MAILCHIMP_SERVER_PREFIX,
});

const isErrorResponse = (
  error: ErrorResponse | unknown,
): error is ErrorResponse => {
  return (error as ErrorResponse).title !== undefined;
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email");

  if (!email || typeof email !== "string") {
    return new Response(
      JSON.stringify({
        message: "Missing email address",
      }),
      {
        status: 400,
      },
    );
  }

  try {
    await client.lists.addListMember(import.meta.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: "pending",
    });

    return new Response(
      JSON.stringify({
        message: `Subscribed successfully with ${email}!`,
        success: true,
      }),
    );
  } catch (e) {
    // TODO: Fix bad TS here
    if (isErrorResponse((e as any)?.response.body)) {
      const errorResponse = (e as any).response.body as ErrorResponse;
      console.log(errorResponse);

      return new Response(
        JSON.stringify({
          message:
            errorResponse.title === "Member Exists"
              ? "You are already subscribed! Please try a different email"
              : errorResponse.detail,
          success: false,
        }),
        {
          status: errorResponse.status,
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Something went wrong, please try again",
        success: false,
      }),
      {
        status: 500,
      },
    );
  }
};
