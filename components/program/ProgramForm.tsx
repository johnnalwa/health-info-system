// app/components/program/ProgramForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
});

type ProgramFormData = z.infer<typeof programSchema>;

export default function ProgramForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating program:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create Health Program</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Program Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="e.g., TB Control, Malaria Prevention"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Program description and objectives"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300">
            {isSubmitting ? "Creating..." : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
}
