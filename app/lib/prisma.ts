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
    description: true;
    price: true;
    dateStart: true;
    dateEnd: true;
    coverUrl: true;
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
  const trips = await prisma.trip.findMany();
  return trips;
});

export default prisma;
