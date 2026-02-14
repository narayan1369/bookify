"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestBook } from "@/http/api";

/**
 * ✅ Works as:
 * 1️⃣ Modal
 * 2️⃣ Full Page
 * 3️⃣ Backend already connected
 */
type Props = {
  open?: boolean;
  onClose?: () => void;
};

const RequestBookPage = ({ open = true, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await requestBook({
        bookName: formData.get("bookName") as string,
        authorName: formData.get("authorName") as string,
        category: formData.get("category") as string,
        userEmail: formData.get("userEmail") as string,
        message: formData.get("message") as string,
      });

      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setError("❌ Failed to send request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-serif">
          📚 Request a Book
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Didn’t find the book or audiobook you were looking for?  
          Submit a request and we’ll try to add it soon.
        </p>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="text-center space-y-3">
            <p className="text-green-600 font-semibold text-lg">
              ✅ Request Submitted Successfully!
            </p>
            <p className="text-sm text-muted-foreground">
              Our team will review your request and contact you if needed.
            </p>

            {onClose && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Book Name */}
            <div>
              <label className="text-sm font-medium">
                Book / Audio Book Name
              </label>
              <Input
                name="bookName"
                placeholder="Eg. Atomic Habits"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="text-sm font-medium">
                Author Name
              </label>
              <Input
                name="authorName"
                placeholder="Eg. James Clear"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                <option value="BCA">BCA</option>
                <option value="B.Com">B.Com</option>
                <option value="BA">BA</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Psychology">Psychology</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Audio Book">Audio Book</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Your Email
              </label>
              <Input
                type="email"
                name="userEmail"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium">
                Additional Message (optional)
              </label>
              <Textarea
                name="message"
                placeholder="Edition, language, audio version etc."
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending Request..." : "Submit Request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );

  /* ================= MODAL MODE (🔥 FINAL FIX) ================= */
  if (onClose) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader />
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  /* ================= PAGE MODE ================= */
  return <div className="max-w-3xl mx-auto">{content}</div>;
};

export default RequestBookPage;
