import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import Dialog from "@/components/ui/dialog";
import Drawer from "@/components/ui/drawer";
import Popover from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import { pl } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { toast } from "sonner";

dayjs.locale("pl");

const NewAlbumSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

function NewAlbum({ refresh }: { refresh: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isTouch = useMediaQuery("(hover: none)");

  const Component = isDesktop ? Dialog : Drawer;
  const CalendarComponent = isDesktop && !isTouch ? Popover : Dialog;

  const form = useForm<z.infer<typeof NewAlbumSchema>>({
    resolver: zodResolver(NewAlbumSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      description: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  async function handleSubmit(data: z.infer<typeof NewAlbumSchema>) {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      await refresh();
      setOpen(false);
      toast.success("Album został dodany");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      form.reset();
      setLoading(false);
    }
  }

  return (
    <Component repositionInputs={false} open={open} onOpenChange={setOpen}>
      <Component.Trigger asChild>
        <Button
          className="absolute right-2 md:static md:right-auto"
          size="icon"
        >
          <PlusIcon />
        </Button>
      </Component.Trigger>
      <Component.Content>
        <Component.Header className="sm:text-center">
          <Component.Title>Nowy album</Component.Title>
          <Component.Description>
            Dodaj nowy album do galerii
          </Component.Description>
        </Component.Header>
        <Form {...form}>
          <form
            className="flex gap-4 flex-col px-4 mt-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Tytuł</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <CalendarComponent>
                        <CalendarComponent.Trigger asChild>
                          <Button variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dayjs(form.getValues("date")).format(
                              "DD MMMM YYYY"
                            )}
                          </Button>
                        </CalendarComponent.Trigger>
                        <CalendarComponent.Content
                          className={`w-auto rounded-xl pt-10 ${
                            isDesktop && isTouch ? "sm:pt-10" : "sm:pt-0"
                          }`}
                        >
                          <Calendar
                            locale={pl}
                            mode="single"
                            selected={form.getValues("date")}
                            onSelect={(date) =>
                              form.setValue("date", date ?? new Date())
                            }
                            initialFocus
                          />
                        </CalendarComponent.Content>
                      </CalendarComponent>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.date?.message}
                    </FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="resize-none"
                      {...field}
                    ></Textarea>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <Component.Footer className="flex !justify-between gap-4">
              <Component.Close asChild>
                <Button type="button" variant="secondary">
                  Anuluj
                </Button>
              </Component.Close>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                )}
                Dodaj
              </Button>
            </Component.Footer>
          </form>
        </Form>
      </Component.Content>
    </Component>
  );
}

export default NewAlbum;
