import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/http/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";

/* ================= TYPES ================= */
interface Book {
  _id: string;
  title: string;
  genre: string;
  authorName: string;
  averageRating?: number;
  ratingsCount?: number;
  createdAt: string;
}

/* ================= API ================= */
const getAllBooksForAdmin = async () => {
  const res = await api.get("/api/books", {
    params: { admin: true },
  });
  return res.data as Book[];
};

const AdminBooks = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-books"],
    queryFn: getAllBooksForAdmin,
  });

  if (isLoading) {
    return <p className="p-4">Loading books...</p>;
  }

  if (isError || !data) {
    return (
      <p className="p-4 text-red-500">
        Failed to load books
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Books</h1>

        {/* ✅ ADMIN ADD BOOK */}
        <Link to="/admin/books/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Added</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.authorName}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {(book.averageRating ?? 0).toFixed(1)}
                      <span className="text-muted-foreground">
                        ({book.ratingsCount ?? 0})
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(book.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminBooks;
