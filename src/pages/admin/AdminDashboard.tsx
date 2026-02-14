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
interface AdminStatsResponse {
  stats: {
    totalUsers: number;
    totalBooks: number;
    totalBookRequests: number;
  };
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  recentBooks: {
    _id: string;
    title: string;
    genre: string;
    authorName: string;
    createdAt: string;
  }[];
  recentBookRequests: {
    _id: string;
    bookName: string;
    authorName: string;
    category: string;
    userEmail: string;
    createdAt: string;
  }[];
}

/* 🔥 TOP VIEWED BOOK TYPE */
interface TopViewedBook {
  _id: string;
  title: string;
  authorName: string;
  genre: string;
  viewsCount: number;
}

/* ================= API CALLS ================= */
const getAdminStats = async () => {
  const res = await api.get("/api/admin/stats");
  return res.data as AdminStatsResponse;
};

const getTopViewedBooks = async () => {
  const res = await api.get("/api/admin/top-viewed-books");
  return res.data as TopViewedBook[];
};

const AdminDashboard = () => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const {
    data: topBooks,
  } = useQuery({
    queryKey: ["top-viewed-books"],
    queryFn: getTopViewedBooks,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading admin dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load admin dashboard
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.stats.totalUsers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.stats.totalBooks}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.stats.totalBookRequests}
          </CardContent>
        </Card>
      </div>

      {/* ================= 🔥 TOP VIEWED BOOKS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Top Viewed Books</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topBooks?.length ? (
                topBooks.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.authorName}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell className="font-semibold">
                      {book.viewsCount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= RECENT USERS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">
                    {user.role}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= RECENT BOOK REQUESTS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Book Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentBookRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.bookName}</TableCell>
                  <TableCell>{req.authorName}</TableCell>
                  <TableCell>{req.category}</TableCell>
                  <TableCell>{req.userEmail}</TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
