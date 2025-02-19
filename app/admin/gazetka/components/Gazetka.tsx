"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "@/app/lib/prisma";
import GazetkaItem from "./GazetkaItem";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import Drawer from "@/components/ui/drawer";
import Dialog from "@/components/ui/dialog";
import Popover from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import { pl } from "date-fns/locale";

import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl");

import { toast } from "sonner";

type GazetkaProps = {
  newspapers: Newspaper[];
};

const APILink = "/api/admin/newspaper";

function Gazetka(props: GazetkaProps) {
  const [clientNewspapers, setClientNewspapers] = useState(props.newspapers);

  const handleDelete = async (id: string) => {
    setClientNewspapers((prev) => prev.filter((item) => item.id !== id));

    await fetch(`${APILink}/${id}`, {
      method: "DELETE",
    });

    getNewspapers();
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    setClientNewspapers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: data.get("title") as string,
            date: new Date(data.get("date") as string),
          };
        }
        return item;
      })
    );

    await fetch(`${APILink}/${id}`, {
      method: "PUT",
      body: data,
    });

    getNewspapers();
  };

  const getNewspapers = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
      id: string;
      title: string;
      date: string;
      url: string;
    }[];

    const parsedData = data
      .map((item) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.date),
        url: item.url,
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());

    setClientNewspapers(parsedData);
  };

  const update = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
      id: string;
      title: string;
      date: string;
      url: string;
    }[];

    const parsedData = data
      .map((item) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.date),
        url: item.url,
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());

    setClientNewspapers(parsedData);
  };

  return (
    <>
      
    </>
  );
}



export default Gazetka;
