import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { cache } from "react";

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
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
    thumbnail: true;
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

export type Album = Prisma.AlbumGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    date: true;
    photos: {
      select: {
        id: true;
        url: true;
        size: true;
        albumId: true;
        thumbnailForAlbumId: true;
        createdAt: true;
      };
    };
    thumbnail: {
      select: {
        id: true;
        url: true;
        size: true;
        albumId: true;
        createdAt: true;
        thumbnailForAlbumId: true;
      };
    };
  };
}>;

export type AlbumPhoto = Prisma.AlbumPhotoGetPayload<{
  select: {
    id: true;
    url: true;
    size: true;
    albumId: true;
    thumbnailForAlbumId: true;
  };
}>;

export type ConfirmationLink = Prisma.ConfirmationLinkGetPayload<{
  select: {
    id: true;
    title: true;
    url: true;
  };
}>;

export type AlbumPhotoSize = "NORMAL" | "WIDE" | "TALL" | "BIG";

export const getConfig = cache(async (key: string) => {
  const config = await prisma.config.findUnique({
    where: { key },
  });

  if (!config) {
    throw new Error("Config not found");
  }

  return config;
});

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

export const getTrips: () => Promise<Trip[]> = cache(async () => {
  const trips = await prisma.trip.findMany({
    select: {
      id: true,
      title: true,
      dateStart: true,
      dateEnd: true,
      description: true,
      thumbnail: true,
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
    orderBy: {
      dateStart: "desc",
    },
  });

  return trips;
});

export const getTrip: (id: string) => Promise<Trip> = cache(
  async (id: string) => {
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        dateStart: true,
        dateEnd: true,
        description: true,
        thumbnail: true,
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

    if (!trip) {
      throw new Error("Trip not found");
    }

    return trip;
  }
);

export const getGallery: () => Promise<Album[]> = cache(async () => {
  const albums = await prisma.album.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      photos: {
        select: {
          id: true,
          url: true,
          size: true,
          albumId: true,
          createdAt: true,
          thumbnailForAlbumId: true,
        },
        take: 1,
      },
      thumbnail: {
        select: {
          id: true,
          url: true,
          size: true,
          albumId: true,
          createdAt: true,
          thumbnailForAlbumId: true,
        },
      },
    },
  });

  albums.sort((a, b) => b.date.valueOf() - a.date.valueOf());

  return albums;
});

export const getAlbum: (id: string) => Promise<Album> = cache(
  async (id: string) => {
    const album = await prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        photos: {
          select: {
            id: true,
            url: true,
            size: true,
            albumId: true,
            createdAt: true,
            thumbnailForAlbumId: true,
          },
        },
        thumbnail: {
          select: {
            id: true,
            url: true,
            size: true,
            albumId: true,
            createdAt: true,
            thumbnailForAlbumId: true,
          },
        },
      },
    });

    if (!album) {
      throw new Error("Album not found");
    }

    return album;
  }
);

export const getConfirmationLinks = cache(async () => {
  const links = await prisma.confirmationLink.findMany();
  return links;
});

export default prisma;
