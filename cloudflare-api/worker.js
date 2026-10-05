import { neon } from "@neondatabase/serverless";

export default {
  async fetch(request, env) {
    try {
      const sql = neon(env.DATABASE_URL);

      const result = await sql`
        SELECT current_database() AS database,
               current_schema() AS schema,
               NOW() AS server_time
      `;

      return Response.json({
        success: true,
        message: "EduPortal API connected to Neon successfully!",
        database: result[0].database,
        schema: result[0].schema,
        server_time: result[0].server_time
      });

    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "Neon connection failed",
          error: error.message
        },
        { status: 500 }
      );
    }
  }
};