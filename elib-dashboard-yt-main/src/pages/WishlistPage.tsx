import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, removeFromWishlist } from "@/http/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Trash, Eye, ExternalLink, Heart } from "lucide-react";

/* ================= TYPES ================= */
interface WishlistBook {
  _id: string;
  title?: string;
  description?: string;
  coverImage: string;
  file: string;
  genre?: string;
  authorName?: string;
}

const WishlistPage = () => {
  const queryClient = useQueryClient();

  const [selectedBook, setSelectedBook] =
    useState<WishlistBook | null>(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH WISHLIST ================= */
  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useQuery<WishlistBook[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await getWishlist();
      return res.data;
    },
  });

  /* ================= REMOVE FROM WISHLIST ================= */
  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  /* ================= STATES ================= */
  if (isLoading)
    return <p className="p-6">Loading wishlist...</p>;

  if (isError)
    return (
      <p className="p-6 text-red-500">
        Failed to load wishlist
      </p>
    );

  if (wishlist.length === 0)
    return (
      <div className="p-10 text-center">
        <Heart className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="text-xl font-semibold">
          Your wishlist is empty
        </h2>
        <p className="text-muted-foreground mt-1">
          Start adding books you love ❤️
        </p>
      </div>
    );

  /* ================= FILTER ================= */
  const filteredWishlist = wishlist.filter((book) => {
    const q = search.toLowerCase();
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.authorName || "").toLowerCase().includes(q) ||
      (book.genre || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= PDF VIEWER ================= */}
      <Dialog
        open={!!selectedBook}
        onOpenChange={(open) =>
          !open && setSelectedBook(null)
        }
      >
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedBook?.title || "Book Preview"}
            </DialogTitle>
            <DialogDescription>
              Preview the book before reading
            </DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <>
              <iframe
                className="w-full h-[75vh] rounded border"
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  selectedBook.file
                )}&embedded=true`}
              />
              <div className="flex justify-end mt-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(selectedBook.file, "_blank")
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in new tab
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          My Wishlist ❤️
        </h1>
        <p className="text-sm text-muted-foreground">
          Books you’ve saved to read later
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search by title, author or genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {filteredWishlist.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No matching books found
        </p>
      )}

      {/* ================= GRID ================= */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWishlist.map((book) => (
          <Card
            key={book._id}
            className="hover:shadow-lg transition"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {book.title || "Untitled Book"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <img
                src={book.coverImage}
                alt={book.title || "cover"}
                className="h-48 w-full rounded object-cover"
              />

              <div className="text-sm space-y-1">
                <p>
                  <strong>Author:</strong>{" "}
                  {book.authorName || "Unknown"}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {book.genre || "N/A"}
                </p>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.description ||
                  "No description available"}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedBook(book)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={removeMutation.isPending}
                  onClick={() =>
                    removeMutation.mutate(book._id)
                  }
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
