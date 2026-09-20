import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Plus,
  Trash2,
  Upload,
  Palette,
  X,
  ImageIcon,
  ExternalLink,
  Pencil,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-700 to-red-900 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-red-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#000000] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all"
    />
  </div>
);

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-700 to-red-900 rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-full aspect-[16/10] bg-white/5 animate-pulse rounded-xl" />
      <div className="h-4 bg-white/5 animate-pulse rounded-lg w-2/3" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-full" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-4/5" />
      <div className="flex justify-between items-center pt-2 border-t border-white/8 mt-auto">
        <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
        <div className="flex gap-2">
          <div className="w-14 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-16 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const DesignCard = ({ design, onDelete, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card>
      <div className="p-4 flex flex-col h-full">
        {design.image_url && (
          <div className="w-full aspect-[16/10] rounded-xl mb-4 border border-white/8 overflow-hidden bg-white/5">
            {!imgLoaded && (
              <div className="w-full h-full animate-pulse bg-white/5" />
            )}
            <img
              src={design.image_url}
              alt={design.title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            />
          </div>
        )}
        <h3 className="font-semibold text-white text-sm mb-1">
          {design.title}
        </h3>
        {design.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
            {design.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-white/8">
          <div className="flex gap-2">
            {design.link && (
              <a
                href={design.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(design)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(design.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-700 to-red-900 rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-[#000000] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

const DesignForm = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Design",
  uploading,
}) => {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    link: initial?.link || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image_url || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, file);
      }}
      className="p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField
            label="Judul (Title)"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Mobile Banking App Redesign"
            required
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-red-300/70 uppercase tracking-wider font-medium">
            Deskripsi (Description)
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe the design concept, tools used, and design decisions..."
            rows={3}
            className="w-full bg-[#000000] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <InputField
            label="Link"
            value={form.link}
            onChange={set("link")}
            placeholder="https://figma.com/file/... or https://dribbble.com/shots/..."
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-red-300/70 uppercase tracking-wider font-medium">
            Foto Cover (Cover Photo)
          </label>
          <label className="flex items-center gap-4 w-full bg-[#000000] border border-dashed border-white/15 rounded-xl px-4 py-4 cursor-pointer hover:border-red-500/40 hover:bg-white/4 transition-all">
            {preview ? (
              <img
                src={preview}
                className="h-16 w-24 object-cover rounded-lg border border-white/10"
                alt="preview"
              />
            ) : (
              <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-300">
                {preview ? "Change image" : "Click to upload image"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                PNG, JPG, WEBP supported
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={uploading} className="relative group/s">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-black rounded-xl border border-white/10">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading ? "Saving..." : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editDesign, setEditDesign] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDesigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching designs:", error.message);
      alert("Failed to load designs: " + error.message);
    }
    setDesigns(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const uploadImage = async (f) => {
    const fileName = `design-${Date.now()}-${f.name}`;
    const { error: uploadError } = await supabase.storage
      .from("design-images")
      .upload(fileName, f);
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      alert("Image upload failed: " + uploadError.message);
      return null;
    }
    const { data } = supabase.storage
      .from("design-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form, file) => {
    setUploading(true);
    let imageUrl = "";
    if (file) {
      const url = await uploadImage(file);
      if (!url) {
        setUploading(false);
        return;
      }
      imageUrl = url;
    }
    const { error } = await supabase.from("designs").insert({
      title: form.title,
      description: form.description,
      image_url: imageUrl,
      link: form.link,
    });
    if (error) {
      console.error("Insert error:", error.message);
      alert("Failed to create design: " + error.message);
    }
    setShowCreate(false);
    setUploading(false);
    fetchDesigns();
  };

  const handleEdit = async (form, file) => {
    setUploading(true);
    let imageUrl = editDesign.image_url || "";
    if (file) {
      const url = await uploadImage(file);
      if (!url) {
        setUploading(false);
        return;
      }
      imageUrl = url;
    }
    const { error } = await supabase
      .from("designs")
      .update({
        title: form.title,
        description: form.description,
        image_url: imageUrl,
        link: form.link,
      })
      .eq("id", editDesign.id);
    if (error) {
      console.error("Update error:", error.message);
      alert("Failed to update design: " + error.message);
    }
    setEditDesign(null);
    setUploading(false);
    fetchDesigns();
  };

  const deleteDesign = async (id) => {
    if (!confirm("Delete this design?")) return;
    const { error } = await supabase.from("designs").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete design: " + error.message);
    }
    fetchDesigns();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-700 to-red-900 rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-black rounded-xl border border-white/15 flex items-center justify-center">
              <Palette className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Designs
            </h1>
            <p className="text-gray-500 text-xs">
              {loading ? "Loading..." : `${designs.length} designs total`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="relative group shrink-0"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-black rounded-xl border border-white/10">
            <Plus className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-200">New Design</span>
          </div>
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Add New Design" onClose={() => setShowCreate(false)}>
          <DesignForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Save Design"
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editDesign && (
        <Modal title="Edit Design" onClose={() => setEditDesign(null)}>
          <DesignForm
            initial={editDesign}
            onSubmit={handleEdit}
            onCancel={() => setEditDesign(null)}
            submitLabel="Update Design"
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Designs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Palette className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No designs yet. Create your first one!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {designs.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onDelete={deleteDesign}
              onEdit={setEditDesign}
            />
          ))}
        </div>
      )}
    </div>
  );
}
