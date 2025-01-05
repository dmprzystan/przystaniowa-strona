import { useEffect, useState } from "react";

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

const NewNewspaperSchema = z.object({
  number: z.coerce.number(),
  date: z.coerce.date(),
  file: z.instanceof(File).refine((file) => file.name.endsWith(".pdf")),
});

type NewNewspaperProps = {
  lastNumber: number;
  update: () => Promise<void>;
};

export default function NewNewspaper({
  lastNumber,
  update,
}: NewNewspaperProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Component = isDesktop ? Dialog : Drawer;
  const CalendarComponent = isDesktop ? Popover : Dialog;

  const form = useForm<z.infer<typeof NewNewspaperSchema>>({
    resolver: zodResolver(NewNewspaperSchema),
    defaultValues: {
      number: lastNumber ? lastNumber + 1 : 1,
      date: new Date(),
      // @ts-ignore
      file: null,
    },
  });

  useEffect(() => {
    if (open) {
      form.setValue("number", lastNumber ? lastNumber + 1 : 1);
    } else {
      form.reset();
    }
  }, [open]);

  async function handleSubmit(data: z.infer<typeof NewNewspaperSchema>) {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/newspaper", {
        method: "POST",
        body: JSON.stringify({
          title: data.number,
          date: data.date,
        }),
      });

      if (!res.ok) {
        throw new Error("Błąd podczas dodawania gazetki");
      }

      const { par, id } = await res.json();

      const uploadRes = await fetch(par, {
        method: "PUT",
        body: data.file,
      });

      if (!uploadRes.ok) {
        await fetch(`/api/admin/newspaper/${id}`, {
          method: "DELETE",
        });

        throw new Error("Błąd podczas dodawania pliku, cofnięto dodawanie");
      }

      setOpen(false);
      toast.success("Pomyślnie dodano gazetkę");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      await update();
      form.reset();
      setLoading(false);
    }
  }

  return (
    <Component open={open} onOpenChange={setOpen} repositionInputs={false}>
      <Component.Trigger asChild>
        <Button
          size="icon"
          className="absolute right-2 md:relative md:right-auto"
        >
          <UploadIcon />
        </Button>
      </Component.Trigger>
      <Component.Content className="w-auto">
        <Component.Header className="sm:text-center">
          <Component.Title>Dodaj gazetkę</Component.Title>
          <Component.Description>
            Dodaj nową gazetkę do listy
          </Component.Description>
        </Component.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col items-stretch gap-4 px-4 w-auto mx-auto mt-8 md:mt-4"
          >
            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Numer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Numer"
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.number?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
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
                        <CalendarComponent.Content className="w-auto rounded-xl pt-10 sm:p-0">
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
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Plik</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.file?.message?.toString()}
                  </FormMessage>
                </FormItem>
              )}
            />
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
