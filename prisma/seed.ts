import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a random date between two dates
function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

// Function to generate random integer counts within a given range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log(`Start seeding ...`);

  // Clear the existing data in npn_usage table
  await prisma.npn_usage.deleteMany();

  // Fetch the 'phenology_observation_portal' tool
  const pop_tool = await prisma.tools.findFirst({
    where: { name: 'phenology_observation_portal' }
  });

  if (!pop_tool) {
    throw new Error("Tool 'phenology_observation_portal' not found.");
  }

  // Define metrics with their IDs
  const metrics = [
    { id: 1, name: 'tool_visited' },
    { id: 2, name: 'status_and_intensity_download' },
    { id: 3, name: 'individual_phenometrics_download' },
    { id: 4, name: 'site_phenometrics_download' },
    { id: 5, name: 'magnitude_phenometrics_download' }
  ];

  // Define the date range
  const startDate = new Date('2022-05-01T00:00:00.000Z');
  const endDate = new Date('2024-12-31T23:59:59.999Z');

  // Generate events for each metric independently
  for (const metric of metrics) {
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      // Generate 10 events per month
      for (let i = 0; i < 10; i++) {
        const eventDate = getRandomDate(currentDate, nextMonth);

        await prisma.npn_usage.create({
          data: {
            date_time: eventDate,
            tool_id: pop_tool.id,
            metric_id: metric.id
          }
        });

        console.log(
          `Created npn_usage event for date: ${eventDate} (metric: ${metric.name})`
        );
      }

      currentDate = nextMonth; // Move to the next month
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
