"use client";

import { useState } from "react";
import { DeleteOutlineRounded } from "@mui/icons-material";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import dayjs from "dayjs";
import "dayjs/locale/pl";

type Schedule = Record<
  string,
  { title: string; time: string; id: string; day: string }[]
>;

type ScheduleProps = {
  scheduledDays: Schedule;
};

const APILink = "/api/admin/schedule";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const newEventSchema = z.object({
  title: z.string().min(1, { message: "Tytuł nie może być pusty" }),
  time: z.string().min(1, { message: "Godzina nie może być pusta" }),
});

const days = [
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

function Schedule(props: ScheduleProps) {
  const [clientSchedule, setClientSchedule] = useState(props.scheduledDays);

  const handleAdd = async (
    e: React.FormEvent<HTMLFormElement>,
    day: string
  ) => {
    // e.preventDefault();
    // const form = e.currentTarget;
    // const data = new FormData(form);
    // const title = data.get("title") as string;
    // const time = data.get("time") as string;
    // if (!title || !time) {
    //   return;
    // }
    // setClientSchedule((prev) => {
    //   const newSchedule = { ...prev };
    //   if (!newSchedule[day]) {
    //     newSchedule[day] = [];
    //   }
    //   newSchedule[day] = [
    //     ...newSchedule[day],
    //     { title, time, id: Math.random().toString(), day },
    //   ].sort((a, b) => a.time.localeCompare(b.time));
    //   return newSchedule;
    // });
    // const res = await fetch(APILink, {
    //   method: "POST",
    //   body: JSON.stringify({ title, time, day }),
    // });
    // if (res.ok) {
    //   addToast({ type: "success", message: "Pomyśnie dodano wydarzenie" });
    // } else {
    //   try {
    //     const data = await res.json();
    //     if (data.error) addToast({ type: "error", message: data.error });
    //     else addToast({ type: "error", message: "Wystąpił nieznany błąd" });
    //   } catch {
    //     addToast({ type: "error", message: "Wystąpił nieznany błąd" });
    //   }
    // }
    // form.reset();
    // getNewSchedule();
  };

  const getNewSchedule = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
      day: string;
      title: string;
      time: string;
      id: string;
    }[];
    const newSchedule = data.reduce((acc, { day, title, time, id }) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({ title, time, id, day });
      acc[day] = acc[day].sort((a, b) => a.time.localeCompare(b.time));
      return acc;
    }, {} as Record<string, { title: string; time: string; id: string; day: string }[]>);
    setClientSchedule(newSchedule);
  };

  return (
    <div className="px-4 w-full mt-4">
      <h2 className="text-4xl text-center">Plan tygodnia</h2>
      <div className="mx-auto w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 items-stretch justify-items-center mt-8 gap-8 pb-6">
        {days &&
          days.map((day) => (
            <ScheduleDay
              key={day}
              day={day}
              schedule={clientSchedule}
              getNewSchedule={getNewSchedule}
            />
          ))}
      </div>
    </div>
  );
}

function ScheduleDay({
  day,
  schedule,
  getNewSchedule,
}: {
  day: string;
  schedule: Schedule;
  getNewSchedule: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof newEventSchema>>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      title: "",
      time: "12:00",
    },
  });

  const getDate = (day: string) => {
    const today = dayjs();
    let dayIndex = days.indexOf(day);
    // Convert to 0-6 index where 0 is Sunday and 6 is Saturday
    if (dayIndex === 6) dayIndex = 0;
    else dayIndex += 1;

    const todayIndex = today.day();
    const diff = dayIndex - todayIndex;

    return today.add(diff, "day");
  };

  const add = async (data: z.infer<typeof newEventSchema>) => {
    setLoading(true);

    try {
      const response = await fetch(APILink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, day }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      toast.success("Pomyśnie dodano wydarzenie");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      getNewSchedule();
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-96 flex flex-col">
      <CardHeader className="py-4">
        <CardTitle className="capitalize flex items-center gap-2">
          {day}
          <span className="text-sm font-normal">
            {getDate(day).locale("pl").format("DD MMMM YYYY")}
          </span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-3 p-3 flex flex-col gap-3 flex-grow">
        {schedule[day] &&
          schedule[day].map(({ title, time, id }) => (
            <ScheduleItem
              key={id}
              title={title}
              time={time}
              id={id}
              getNewSchedule={getNewSchedule}
            />
          ))}
      </CardContent>
      <Separator />
      <CardFooter className="mt-2 flex justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(add)}>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-base !mt-0.5"
                        placeholder="Tytuł"
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        step="900"
                        placeholder="Tytuł"
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.time?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="!mt-2 w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              ) : (
                <PlusCircledIcon className="w-4 h-4" />
              )}
              Dodaj
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}

type ScheduleItemProps = {
  title: string;
  time: string;
  id: string;
  getNewSchedule: () => void;
};

function ScheduleItem(props: ScheduleItemProps) {
  const [loading, setLoading] = useState(false);
  const { title, time, id, getNewSchedule } = props;

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${APILink}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      toast.success("Pomyśnie usunięto wydarzenie");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      getNewSchedule();
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex justify-between !p-3">
        <div className="flex flex-col">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{time}</CardDescription>
        </div>
        <Button size="icon" disabled={loading} onClick={() => handleRemove(id)}>
          {loading ? (
            <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
          ) : (
            <DeleteOutlineRounded />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Schedule;
