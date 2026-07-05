"use client";

import * as React from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useFirebase } from "@/firebase/client-provider";
import type { Partner } from "@/types/partner";

type PartnerFormState = {
  name: string;
  slug: string;
  logoUrl: string;
  imageUrl: string;
  websiteUrl: string;
  description: string;
  partnerType: string;
  order: number;
  status: "draft" | "published";
  featured: boolean;
};

const PARTNERS_COLLECTION = "partners";

const emptyForm: PartnerFormState = {
  name: "",
  slug: "",
  logoUrl: "",
  imageUrl: "",
  websiteUrl: "",
  description: "",
  partnerType: "sponsor",
  order: 1,
  status: "draft",
  featured: false,
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PartnersAdminPage() {
  const { db } = useFirebase();

  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [form, setForm] = React.useState<PartnerFormState>(emptyForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!db) return;

    setLoading(true);

    const partnersQuery = query(
      collection(db, PARTNERS_COLLECTION),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      partnersQuery,
      (snapshot) => {
        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Partner[];

        setPartners(items);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(snapshotError);
        setError("Failed to load partners.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  function updateForm<K extends keyof PartnerFormState>(
    key: K,
    value: PartnerFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  function handleEdit(partner: Partner) {
    setEditingId(partner.id ?? null);

    setForm({
      name: partner.name ?? "",
      slug: partner.slug ?? "",
      logoUrl: partner.logoUrl ?? "",
      imageUrl: partner.imageUrl ?? "",
      websiteUrl: partner.websiteUrl ?? "",
      description: partner.description ?? "",
      partnerType: partner.partnerType ?? "sponsor",
      order: partner.order ?? 1,
      status: partner.status ?? "draft",
      featured: partner.featured ?? false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!db) {
      setError("Firebase is not ready yet.");
      return;
    }

    if (!form.name.trim()) {
      setError("Partner name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const slug = form.slug.trim() || createSlug(form.name);

    const payload = {
      name: form.name.trim(),
      slug,
      logoUrl: form.logoUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      websiteUrl: form.websiteUrl.trim(),
      description: form.description.trim(),
      partnerType: form.partnerType.trim() || "sponsor",
      order: Number(form.order) || 1,
      status: form.status,
      featured: form.featured,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, PARTNERS_COLLECTION, editingId), payload);
      } else {
        await addDoc(collection(db, PARTNERS_COLLECTION), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to save partner.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(partner: Partner) {
    if (!db || !partner.id) return;

    const confirmed = window.confirm(
      `Delete "${partner.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, PARTNERS_COLLECTION, partner.id));
    } catch (deleteError) {
      console.error(deleteError);
      setError("Failed to delete partner.");
    }
  }

  const publishedCount = partners.filter(
    (partner) => partner.status === "published"
  ).length;

  const draftCount = partners.filter(
    (partner) => partner.status === "draft"
  ).length;

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-50 px-6 py-5 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Partners</h1>
        <p className="mt-2 text-slate-600">
          Manage partner logos, sponsor images, website links, and homepage
          visibility.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Partners</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {partners.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{draftCount}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Partner" : "Add Partner"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use image URLs for now. Firebase Storage upload can be added after
              the upload helper is confirmed.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Partner Name
            </label>
            <input
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="Toyota Ghana"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Slug
            </label>
            <input
              value={form.slug}
              onChange={(event) => updateForm("slug", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="toyota-ghana"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Logo URL
            </label>
            <input
              value={form.logoUrl}
              onChange={(event) => updateForm("logoUrl", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              value={form.imageUrl}
              onChange={(event) => updateForm("imageUrl", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Website URL
            </label>
            <input
              value={form.websiteUrl}
              onChange={(event) =>
                updateForm("websiteUrl", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Partner Type
            </label>
            <select
              value={form.partnerType}
              onChange={(event) =>
                updateForm("partnerType", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              <option value="sponsor">Sponsor</option>
              <option value="corporate">Corporate Partner</option>
              <option value="implementation">Implementation Partner</option>
              <option value="medical">Medical Partner</option>
              <option value="community">Community Partner</option>
              <option value="media">Media Partner</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(event) =>
                updateForm("order", Number(event.target.value))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) =>
                updateForm(
                  "status",
                  event.target.value as "draft" | "published"
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              placeholder="Briefly describe the partner and their role in supporting DIBF."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateForm("featured", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Feature this partner on the homepage
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Partner"
                : "Add Partner"}
          </button>
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Partner List</h2>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
            Loading partners...
          </div>
        ) : partners.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
            No partners have been added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => {
              const previewImage = partner.logoUrl || partner.imageUrl;

              return (
                <article
                  key={partner.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative flex h-48 items-center justify-center bg-slate-100">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={partner.name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <span className="text-sm text-slate-500">
                        No image available
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {partner.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {partner.partnerType || "Partner"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          partner.status === "published"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {partner.status}
                      </span>
                    </div>

                    {partner.description && (
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {partner.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Order: {partner.order}</span>
                      {partner.featured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
                          Featured
                        </span>
                      )}
                    </div>

                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-medium text-blue-600 hover:underline"
                      >
                        Visit website
                      </a>
                    )}

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(partner)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(partner)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}