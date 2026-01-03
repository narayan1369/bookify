import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useTokenStore from "@/store";
import { getBooks, addToWishlist } from "@/http/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  CirclePlus,
  MoreHorizontal,
  Eye,
  ExternalLink,
  Heart,
  Star,
  Download,
  Headphones,
} from "lucide-react";

/* ================= TYPES ================= */
interface Book {
  _id: string;
  title?: string;
  genre?: string;
  coverImage: string;
  file?: string;        // PDF
  audioFile?: string;  // AUDIO
  duration?: string;
  bookType?: "pdf" | "audio";
  authorName?: string;
  averageRating?: number;
  ratingsCount?: number;
  isPaid?: boolean;
  price?: number;
}

/* ================= CATEGORY NORMALIZER ================= */
const normalizeCategory = (value?: string) => {
  if (!value) return "Other";
  return value;
};

const BooksPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useTokenStore((state) => state.user);

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // ✅ FIX: define similarBooks properly
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);

  // ✅ FIX: define unlockedBooks + setter
  const [unlockedBooks, setUnlockedBooks] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("unlockedBooks") || "[]")
  );

  /* ================= FETCH BOOKS ================= */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const books: Book[] = data?.data ?? [];
  const selectedCategory = searchParams.get("category") || "All";

  /* ================= AUTO SEARCH ================= */
  useEffect(() => {
    const searchTerm = searchParams.get("search");
    if (searchTerm) setSearch(searchTerm);
  }, [searchParams]);

  /* ================= SIMILAR BOOKS ================= */
  useEffect(() => {
    if (!selectedBook) return;

    axios
      .get(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:7001"}/api/books/${selectedBook._id}/similar`
      )
      .then((res) => setSimilarBooks(res.data || []))
      .catch(() => setSimilarBooks([]));
  }, [selectedBook]);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre && set.add(normalizeCategory(b.genre)));
    return ["All", ...Array.from(set)];
  }, [books]);

  /* ================= FILTER ================= */
  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter((book) => {
      const matchSearch =
        (book.title || "").toLowerCase().includes(q) ||
        (book.authorName || "").toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === "All" ||
        normalizeCategory(book.genre) === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [books, search, selectedCategory]);

  /* ================= WISHLIST ================= */
  const wishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      alert("❤️ Added to wishlist");
    },
  });

  /* ================= UNLOCK CHECK ================= */
  const isUnlocked = (book: Book) =>
    !book.isPaid || unlockedBooks.includes(book._id);

  if (isLoading) return <p className="p-6">Loading books...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load books</p>;

  return (
    <div className="flex gap-6 p-4">
      {/* ================= VIEW / LISTEN MODAL ================= */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
          </DialogHeader>

          {selectedBook && isUnlocked(selectedBook) && (
            <>
              {selectedBook.bookType === "audio" ? (
                <>
                  <audio
                    controls
                    className="w-full mt-6"
                    src={selectedBook.audioFile}
                  />
                  {selectedBook.duration && (
                    <p className="mt-2 text-sm text-slate-500">
                      Duration: {selectedBook.duration}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <iframe
                    className="w-full h-[65vh] rounded border"
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      selectedBook.file || ""
                    )}&embedded=true`}
                  />
                  {selectedBook.file && (
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => window.open(selectedBook.file, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in new tab
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 shrink-0">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() =>
                  cat === "All"
                    ? setSearchParams({})
                    : setSearchParams({ category: cat })
                }
              >
                {cat}
              </Button>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/home">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Books</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {user?.role === "admin" && (
            <Link to="/admin/books/create">
              <Button>
                <CirclePlus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </Link>
          )}
        </div>

        <input
          className="w-full rounded border px-4 py-2"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Books</CardTitle>
            <CardDescription>
              Category: <b>{selectedCategory}</b>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell>
                      <img
                        src={book.coverImage}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </TableCell>

                    <TableCell>
                      {book.title}
                      {book.bookType === "audio" && (
                        <Badge className="ml-2">AUDIO</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {normalizeCategory(book.genre)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Star className="inline h-4 w-4 text-yellow-500 fill-yellow-500" />{" "}
                      {(book.averageRating ?? 0).toFixed(1)}
                    </TableCell>

                    <TableCell>{book.authorName}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedBook(book)}
                          >
                            {book.bookType === "audio" ? (
                              <>
                                <Headphones className="mr-2 h-4 w-4" />
                                Listen
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Read
                              </>
                            )}
                          </DropdownMenuItem>

                          {!book.isPaid && book.file && (
                            <DropdownMenuItem asChild>
                              <a href={book.file} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() =>
                              wishlistMutation.mutate(book._id)
                            }
                          >
                            <Heart className="mr-2 h-4 w-4 text-red-500" />
                            Wishlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          <CardFooter>
            Showing <b>{filteredBooks.length}</b> of{" "}
            <b>{books.length}</b> books
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BooksPage;
