import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { cache } from "react";

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient;
}

export type Schedule = Prisma.ScheduleGetPayload<{
  select: {
    id: true;
    day: true;
    title: true;
    time: true;
  };
}>;

export type Newspaper = Prisma.NewspaperGetPayload<{
  select: {
    id: true;
    title: true;
    date: true;
    url: true;
  };
}>;

export type Trip = Prisma.TripGetPayload<{
  select: {
    id: true;
    title: true;
    dateStart: true;
    dateEnd: true;
    description: true;
    TripPhoto: {
      select: {
        url: true;
      };
    };
    TripLink: {
      select: {
        url: true;
        name: true;
      };
    };
    TripAttachment: {
      select: {
        url: true;
        name: true;
      };
    };
  };
}>;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const getSchedule = cache(async () => {
  const schedule = await prisma.schedule.findMany();
  return schedule;
});

export const getNewspapers = cache(async () => {
  const newspapers = (await prisma.newspaper.findMany()).sort(
    (a, b) => b.date.valueOf() - a.date.valueOf()
  );
  return newspapers;
});

export const getTrips = cache(async () => {
  const trips = await prisma.trip.findMany({
    select: {
      id: true,
      title: true,
      dateStart: true,
      dateEnd: true,
      description: true,
      TripPhoto: {
        select: {
          url: true,
        },
      },
      TripLink: {
        select: {
          url: true,
          name: true,
        },
      },
      TripAttachment: {
        select: {
          url: true,
          name: true,
        },
      },
    },
  });

  trips.sort((a, b) => b.dateStart.valueOf() - a.dateStart.valueOf());

  return trips;
});

export default prisma;
