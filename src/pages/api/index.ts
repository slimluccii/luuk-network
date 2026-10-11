import type { APIRoute } from "astro";

export const prerender = false;

// export const GET = (({ params, request }) => {
//   return new Response(
//     JSON.stringify({
//       message: "This was a GET!",
//     }),
//   );
// }) satisfies APIRoute;
//
// export const POST = (({ request }) => {
//   return new Response(
//     JSON.stringify({
//       message: "This was a POST!",
//     }),
//   );
// }) satisfies APIRoute;
//
// export const DELETE = (({ request }) => {
//   return new Response(
//     JSON.stringify({
//       message: "This was a DELETE!",
//     }),
//   );
// }) satisfies APIRoute;

export const ALL = (({ request }) => {
  return new Response(
    JSON.stringify({
      message: `This was a ${request.method}!`,
    }),
  );
}) satisfies APIRoute;
