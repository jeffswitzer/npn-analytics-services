import { PrismaClient, Prisma } from '@prisma/client';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';  // Correct plugin for Fastify v4

const prisma = new PrismaClient();
const app = fastify({ logger: true });

// Register CORS middleware for Fastify 4.x
app.register(fastifyCors, {
  origin: '*'  // Allow all origins
});

// GET Endpoint to fetch all npn_usage records
app.get<{
  Querystring: IFeedQueryString;
}>('/pop-usage', async (req, res) => {
  console.log('Received request to /pop-usage');

  const { searchString, skip, take, orderBy } = req.query || {};

  const order = orderBy ? orderBy : 'asc';

  try {
    const popUsage = await prisma.npn_usage.findMany({
      orderBy: {
        date_time: order as Prisma.SortOrder,
      },
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });

    console.log('Fetched popUsage data:', popUsage);
    res.status(200).send(popUsage);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// POST Endpoint to insert new npn_usage records
app.post<{
  Body: INpnUsageBody;
}>('/pop-usage', async (req, res) => {
  const { date_time, tool_id, metric_id } = req.body;

  // Validate incoming request body
  if (!date_time || !tool_id || !metric_id) {
    res.status(400).send({ error: 'Invalid data. All fields (date_time, tool_id, metric_id) are required.' });
    return;
  }

  try {
    // Insert new npn_usage record
    const newUsage = await prisma.npn_usage.create({
      data: {
        date_time: new Date(date_time),  // Ensure it's stored as a Date
        tool_id: tool_id,
        metric_id: metric_id,
      },
    });

    res.status(201).send(newUsage);  // Send back the newly created record
  } catch (error) {
    console.error('Error inserting new record:', error);
    res.status(500).send({ error: 'Error inserting new record into npn_usage table' });
  }
});

// Define interfaces
interface IFeedQueryString {
  searchString?: string | null;
  skip?: number | null;
  take?: number | null;
  orderBy?: Prisma.SortOrder | null;
}

interface INpnUsageBody {
  date_time: string;  // Date in ISO format
  tool_id: number;    // Foreign key to the tools table
  metric_id: number;  // Foreign key to the metrics table
}

// Start the Fastify server
app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`
  🚀 Server ready at: http://localhost:3000
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-fastify#3-using-the-rest-api`);
});
