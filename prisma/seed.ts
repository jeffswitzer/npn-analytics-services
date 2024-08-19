import { PrismaClient, Prisma } from '@prisma/client'

//run the following to repull schema: npx prisma db pull
// run the following to regen the prisma client: npx prisma generate

const prisma = new PrismaClient()

// const userData: Prisma.UserCreateInput[] = [
//   {
//     name: 'Alice',
//     email: 'alice@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Join the Prisma Discord',
//           content: 'https://pris.ly/discord',
//           published: true,
//         },
//       ],
//     },
//   },
//   {
//     name: 'Nilu',
//     email: 'nilu@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Follow Prisma on Twitter',
//           content: 'https://www.twitter.com/prisma',
//           published: true,
//         },
//       ],
//     },
//   },
//   {
//     name: 'Mahmoud',
//     email: 'mahmoud@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Ask a question about Prisma on GitHub',
//           content: 'https://www.github.com/prisma/prisma/discussions',
//           published: true,
//         },
//         {
//           title: 'Prisma on YouTube',
//           content: 'https://pris.ly/youtube',
//         },
//       ],
//     },
//   },
// ]

function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

async function main() {
  console.log(`Start seeding ...`)
  
  await prisma.npn_usage.deleteMany();

  const pop_tool = await prisma.tools.findFirst({
    where: {
      name: 'phenology_observation_portal'
    }
  })
  const download_metric = await prisma.metrics.findFirst({
    where: {
      name: 'download'
    }
  })
  for (let i = 0; i < 10; i++) {
    const npn_usage = await prisma.npn_usage.create({
      data: {
        date_time: getRandomDate(new Date('2024-07-01T01:57:45.271Z'), new Date('2024-08-01T01:57:45.271Z')),
        tool_id: pop_tool?.id,
        metric_id: download_metric?.id
      }
    })
   
    console.log(`Created npn_usage with id: ${npn_usage.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
