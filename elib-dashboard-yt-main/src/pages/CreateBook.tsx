import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { createBook } from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

/* ================= CONSTANTS ================= */
const GENRES = ["BCA", "BA", "BBA", "Other"];

/* ================= ZOD SCHEMA ================= */
const formSchema = z.object({
  title: z.string().min(2),
  authorName: z.string().min(2),
  genre: z.string().min(1),
  customGenre: z.string().optional(),
  description: z.string().min(2),

  bookType: z.enum(["pdf", "audio"]),

  coverImage: z.instanceof(FileList),

  file: z.instanceof(FileList).optional(),
  audioFile: z.instanceof(FileList).optional(),
  duration: z.string().optional(),

  price: z.string().optional(),
});

const CreateBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCustomGenre, setShowCustomGenre] = useState(false);
  const [bookType, setBookType] = useState<"pdf" | "audio">("pdf");
  const [isPaid, setIsPaid] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authorName: "",
      genre: "",
      customGenre: "",
      description: "",
      bookType: "pdf",
      price: "",
      duration: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/dashboard/books");
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const finalGenre =
      values.genre === "Other"
        ? values.customGenre?.trim()
        : values.genre;

    if (!finalGenre) {
      alert("Please enter custom category");
      return;
    }

    if (bookType === "pdf" && !values.file?.length) {
      alert("PDF file is required");
      return;
    }

    if (bookType === "audio" && !values.audioFile?.length) {
      alert("Audio file is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("authorName", values.authorName);
    formData.append("genre", finalGenre);
    formData.append("description", values.description);
    formData.append("bookType", bookType);
    formData.append("coverImage", values.coverImage[0]);

    if (bookType === "pdf") {
      formData.append("file", values.file![0]);
    }

    if (bookType === "audio") {
      formData.append("audioFile", values.audioFile![0]);
      formData.append("duration", values.duration || "");
    }

    formData.append("isPaid", String(isPaid));
    if (isPaid) {
      formData.append("price", values.price || "0");
    }

    mutation.mutate(formData as any);
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/books">
                    Books
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-3">
              <Link to="/dashboard/books">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </div>

          {/* FORM */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create a new book</CardTitle>
              <CardDescription>Add PDF or Audio books</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AUTHOR */}
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BOOK TYPE */}
              <FormItem>
                <FormLabel>Book Type</FormLabel>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={bookType}
                  onChange={(e) => {
                    const v = e.target.value as "pdf" | "audio";
                    setBookType(v);
                    form.setValue("bookType", v);
                  }}
                >
                  <option value="pdf">📘 PDF Book</option>
                  <option value="audio">🎧 Audio Book</option>
                </select>
              </FormItem>

              {/* CATEGORY */}
              <FormItem>
                <FormLabel>Category</FormLabel>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  {...form.register("genre")}
                  onChange={(e) => {
                    form.setValue("genre", e.target.value);
                    setShowCustomGenre(e.target.value === "Other");
                  }}
                >
                  <option value="">Select category</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>

              {/* CUSTOM CATEGORY */}
              {showCustomGenre && (
                <FormField
                  control={form.control}
                  name="customGenre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COVER */}
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PAID TOGGLE */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                />
                <span>Paid Book (Pro Library)</span>
              </div>

              {isPaid && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* PDF */}
              {bookType === "pdf" && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book PDF</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* AUDIO */}
              {bookType === "audio" && (
                <>
                  <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audio File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="audio/*"
                            onChange={(e) =>
                              field.onChange(e.target.files)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default CreateBook;
