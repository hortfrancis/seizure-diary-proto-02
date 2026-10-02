// For now the Worker only serves the front end (handled by the assets config
// in wrangler.jsonc). API routes will be added here in later steps.
export default {
  async fetch(): Promise<Response> {
    return new Response("Not found", { status: 404 })
  },
}
