import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "./adminApi";

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

/* ================= TYPES ================= */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

const AdminUsers = () => {
  const queryClient = useQueryClient();

  /* ================= FETCH USERS ================= */
  const { data, isLoading, isError } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });

  /* ================= DELETE USER ================= */
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
      alert("User deleted successfully");
    },
  });

  if (isLoading) {
    return <p className="p-4">Loading users...</p>;
  }

  if (isError || !data) {
    return (
      <p className="p-4 text-red-500">
        Failed to load users
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">
                  {user.role}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {user.role === "admin" ? (
                    <span className="text-muted-foreground text-sm">
                      Protected
                    </span>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        deleteMutation.mutate(user._id)
                      }
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
