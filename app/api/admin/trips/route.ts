import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as oci from "oci-sdk";
import { ObjectStorageClient, getNamespace } from "@/app/lib/oci";

export async function GET(_req: NextRequest) {
  const trips = await prisma.trip.findMany({
    orderBy: {
      dateStart: "desc",
    },
    include: {
      TripPhoto: true,
      TripLink: true,
      TripAttachment: true,
    },
  });

  return NextResponse.json(trips);
}

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const title = data.get("title") as string;
  const dateStart = data.get("dateStart") as string;
  const dateEnd = data.get("dateEnd") as string;
  const description = data.get("description") as string;

  if (!title || !dateStart || !dateEnd || !description) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDateStart = new Date(dateStart);
  const parsedDateEnd = new Date(dateEnd);

  if (isNaN(parsedDateStart.getTime()) || isNaN(parsedDateEnd.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  if (parsedDateStart > parsedDateEnd) {
    return NextResponse.json(
      { message: "Invalid date range" },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      dateStart: parsedDateStart,
      dateEnd: parsedDateEnd,
      description,
    },
  });

  const image = data.get("image") as File | undefined;

  if (image) {
    const namespaceName = await getNamespace();
    const extension = image.name.split(".").pop();
    const name = `trip-${trip.id}.${extension}`;

    const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: name,
      putObjectBody: image.stream(),
    };

    await ObjectStorageClient.putObject(putObjectRequest);

    await prisma.tripPhoto.create({
      data: {
        url: name,
        tripId: trip.id,
      },
    });
  }

  const attachments = data.getAll("attachments") as File[];

  for (const attachment of attachments) {
    const namespaceName = await getNamespace();
    const name = `trip-${trip.id}-${attachment.name}`;

    const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: name,
      putObjectBody: attachment.stream(),
    };

    await ObjectStorageClient.putObject(putObjectRequest);

    await prisma.tripAttachment.create({
      data: {
        url: name,
        tripId: trip.id,
        name: attachment.name,
      },
    });
  }

  const links = data.getAll("links") as string[];
  for (const link of links) {
    const parsedLink = JSON.parse(link) as { url: string; name: string };

    await prisma.tripLink.create({
      data: {
        url: parsedLink.url,
        name: parsedLink.name,
        tripId: trip.id,
      },
    });
  }

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ok" });
}

export async function PUT(req: NextRequest) {
  const data = await req.formData();

  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const dateStart = data.get("dateStart") as string;
  const dateEnd = data.get("dateEnd") as string;
  const description = data.get("description") as string;

  if (!id || !title || !dateStart || !dateEnd || !description) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDateStart = new Date(dateStart);
  const parsedDateEnd = new Date(dateEnd);

  if (isNaN(parsedDateStart.getTime()) || isNaN(parsedDateEnd.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  if (parsedDateStart > parsedDateEnd) {
    return NextResponse.json(
      { message: "Invalid date range" },
      { status: 400 }
    );
  }

  const oldTrip = await prisma.trip.findUnique({
    where: {
      id: id,
    },
    include: {
      TripPhoto: true,
      TripLink: true,
      TripAttachment: true,
    },
  });

  if (!oldTrip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }

  await prisma.tripAttachment.deleteMany({
    where: {
      tripId: id,
    },
  });
  await prisma.tripLink.deleteMany({
    where: {
      tripId: id,
    },
  });
  await prisma.tripPhoto.deleteMany({
    where: {
      tripId: id,
    },
  });

  const oldPhoto = oldTrip.TripPhoto[0];
  if (oldPhoto) {
    const namespaceName = await getNamespace();
    const name = oldPhoto.url;

    const deleteObjectRequest: oci.objectstorage.requests.DeleteObjectRequest =
      {
        bucketName: "przystaniowa-strona",
        namespaceName,
        objectName: name,
      };

    await ObjectStorageClient.deleteObject(deleteObjectRequest);
  }

  const oldAttachments = oldTrip.TripAttachment;
  for (const attachment of oldAttachments) {
    const namespaceName = await getNamespace();
    const name = attachment.url;

    const deleteObjectRequest: oci.objectstorage.requests.DeleteObjectRequest =
      {
        bucketName: "przystaniowa-strona",
        namespaceName,
        objectName: name,
      };

    await ObjectStorageClient.deleteObject(deleteObjectRequest);
  }

  const trip = await prisma.trip.update({
    where: {
      id: id,
    },
    data: {
      title,
      dateStart: parsedDateStart,
      dateEnd: parsedDateEnd,
      description,
    },
  });

  const image = data.get("image") as File | undefined;

  if (image) {
    const namespaceName = await getNamespace();
    const extension = image.name.split(".").pop();
    const name = `trip-${trip.id}.${extension}`;

    const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: name,
      putObjectBody: image.stream(),
    };

    await ObjectStorageClient.putObject(putObjectRequest);

    await prisma.tripPhoto.create({
      data: {
        url: name,
        tripId: trip.id,
      },
    });
  }

  const attachments = data.getAll("attachments") as File[];
  if (attachments.length > 0) {
    for (const attachment of attachments) {
      const namespaceName = await getNamespace();
      const name = `trip-${trip.id}-${attachment.name}`;

      const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
        bucketName: "przystaniowa-strona",
        namespaceName,
        objectName: name,
        putObjectBody: attachment.stream(),
      };

      await ObjectStorageClient.putObject(putObjectRequest);

      await prisma.tripAttachment.create({
        data: {
          url: name,
          tripId: trip.id,
          name: attachment.name,
        },
      });
    }
  }

  const links = data.getAll("links") as string[];
  for (const link of links) {
    const parsedLink = JSON.parse(link) as { url: string; name: string };

    await prisma.tripLink.create({
      data: {
        url: parsedLink.url,
        name: parsedLink.name,
        tripId: trip.id,
      },
    });
  }

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ok" });
}
