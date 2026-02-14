import { useQuery } from "@tanstack/react-query";
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

/* ================= TYPES ================= */
interface BookRequest {
  _id: string;
  bookName: string;
  authorName: string;
  category: string;
  userEmail: string;
  message?: string;
  createdAt: string;
}

/* ================= API CALL ================= */
const getAllBookRequests = async () => {
  const res = await api.get("/api/admin/book-requests");
  return res.data as BookRequest[];
};

const AdminBookRequests = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-book-requests"],
    queryFn: getAllBookRequests,
  });

  /* ================= STATES ================= */
  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading book requests...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load book requests
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Book Requests</h1>
        <p className="text-sm text-muted-foreground">
          Requests submitted by users for new books
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Requested On</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No book requests found
                  </TableCell>
                </TableRow>
              )}

              {data.map((req) => (
                <TableRow key={req._id}>
                  <TableCell className="font-medium">
                    {req.bookName}
                  </TableCell>

                  <TableCell>{req.authorName}</TableCell>

                  <TableCell>{req.category}</TableCell>

                  <TableCell>{req.userEmail}</TableCell>

                  <TableCell className="max-w-[250px] truncate">
                    {req.message || "-"}
                  </TableCell>

                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
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

export default AdminBookRequests;
