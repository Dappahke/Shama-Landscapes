"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  Building,
  Ruler,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import GalleryUpload from "@/components/GalleryUpload";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    cover_url: "",
    image_gallery: [],
    location: "",
    year: new Date().getFullYear().toString(),
    project_type: "",
    client: "",
    area: "",
    status: "In Progress"
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/projects?sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error);
      setProjects(result.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.cover_url.trim()) errors.cover_url = "Cover image is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.year.trim()) errors.year = "Year is required";
    if (!formData.project_type.trim()) errors.project_type = "Project type is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (editingProject) {
        response = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingProject.id })
        });
      } else {
        response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const response = await fetch(
        `/api/admin/projects?id=${projectToDelete.id}`,
        { method: "DELETE" }
      );
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      tagline: project.tagline || "",
      description: project.description || "",
      cover_url: project.cover_url || "",
      image_gallery: project.image_gallery || [],
      location: project.location || "",
      year: project.year || "",
      project_type: project.project_type || "",
      client: project.client || "",
      area: project.area || "",
      status: project.status || "In Progress"
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      tagline: "",
      description: "",
      cover_url: "",
      image_gallery: [],
      location: "",
      year: new Date().getFullYear().toString(),
      project_type: "",
      client: "",
      area: "",
      status: "In Progress"
    });
    setFormErrors({});
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const toggleStatus = async (project) => {
    const newStatus = project.status === "Completed" ? "In Progress" : "Completed";
    
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, status: newStatus })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      fetchProjects();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5EBE8]">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-[#0F7F40]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-[#F5EBE8] md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black text-black md:text-3xl">Projects</h1>
          <p className="mt-1 text-black/60">Manage your portfolio and track project status</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#0F7F40] text-white rounded-xl font-semibold hover:bg-[#0c6633] transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 mb-6 bg-white border shadow-sm border-black/5 rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute -translate-y-1/2 text-black/40 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5EBE8] border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#F5EBE8] border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 text-sm font-medium"
            >
              <option value="all">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            
            <button
              onClick={() => {
                setSortOrder(prev => prev === "asc" ? "desc" : "asc");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F5EBE8] border border-black/10 rounded-xl hover:bg-[#F5EBE8]/80 transition-colors"
            >
              <ArrowUpDown size={18} className="text-black/60" />
              <span className="hidden text-sm font-medium text-black/60 sm:inline">
                {sortOrder === "desc" ? "Newest" : "Oldest"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-[#F5EBE8] rounded-full">
            <Building className="w-10 h-10 text-black/20" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-black/60">No projects found</h3>
          <p className="mb-6 text-black/40">Get started by adding your first project</p>
          <button
            onClick={openAddModal}
            className="px-6 py-2.5 bg-[#0F7F40] text-white rounded-xl font-medium hover:bg-[#0c6633] transition-colors"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden transition-all bg-white border shadow-sm border-black/5 rounded-2xl hover:shadow-lg group"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.cover_url}
                  alt={project.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${project.status === "Completed" 
                      ? "bg-[#0F7F40] text-white" 
                      : "bg-[#BD7563] text-white"}
                  `}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute flex gap-2 transition-opacity opacity-0 top-3 right-3 group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 transition-colors rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Edit2 size={16} className="text-black/70" />
                  </button>
                  <button
                    onClick={() => confirmDelete(project)}
                    className="p-2 transition-colors rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider uppercase text-[#BD7563]">
                      {project.tagline}
                    </p>
                    <h3 className="text-lg font-bold leading-tight text-black line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-4 text-sm text-black/50 line-clamp-2">
                  {project.description}
                </p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-black/60">
                    <MapPin size={14} className="text-[#0F7F40]" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/60">
                    <Calendar size={14} className="text-[#0F7F40]" />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/60">
                    <Ruler size={14} className="text-[#0F7F40]" />
                    <span>{project.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <span className="text-xs font-medium text-black/40">
                    {project.project_type}
                  </span>
                  <button
                    onClick={() => toggleStatus(project)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${project.status === "Completed"
                        ? "bg-[#BD7563]/10 text-[#BD7563] hover:bg-[#BD7563]/20"
                        : "bg-[#0F7F40]/10 text-[#0F7F40] hover:bg-[#0F7F40]/20"}
                    `}
                  >
                    {project.status === "Completed" ? (
                      <><Clock size={12} /> Mark Ongoing</>
                    ) : (
                      <><CheckCircle2 size={12} /> Mark Complete</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-2xl font-bold text-black">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 transition-colors hover:bg-[#F5EBE8] rounded-xl"
              >
                <X size={24} className="text-black/50" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.title ? 'border-red-500' : 'border-black/10'} focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40] transition-all`}
                      placeholder="e.g., The Hub Karen"
                    />
                    {formErrors.title && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <AlertCircle size={14} /> {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Tagline */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-all border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40]"
                      placeholder="e.g., Landscape Architecture · 2024"
                    />
                  </div>

                  {/* Cover Image Upload - NEW! */}
                  <div className="md:col-span-2">
                    <ImageUpload
                      value={formData.cover_url}
                      onChange={(url) => {
                        setFormData(prev => ({ ...prev, cover_url: url }));
                        if (formErrors.cover_url) {
                          setFormErrors(prev => ({ ...prev, cover_url: null }));
                        }
                      }}
                      label="Cover Image *"
                    />
                    {formErrors.cover_url && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <AlertCircle size={14} /> {formErrors.cover_url}
                      </p>
                    )}
                  </div>

                  {/* Gallery Upload - NEW! */}
                  <div className="md:col-span-2">
                    <GalleryUpload
                      images={formData.image_gallery}
                      onChange={(urls) => setFormData(prev => ({ ...prev, image_gallery: urls }))}
                      label="Image Gallery"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.description ? 'border-red-500' : 'border-black/10'} focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40] transition-all resize-none`}
                      placeholder="Describe the project..."
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.location ? 'border-red-500' : 'border-black/10'} focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40] transition-all`}
                      placeholder="e.g., Karen, Nairobi"
                    />
                    {formErrors.location && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Year *
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.year ? 'border-red-500' : 'border-black/10'} focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40] transition-all`}
                      placeholder="2024"
                    />
                    {formErrors.year && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.year}</p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Project Type *
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.project_type ? 'border-red-500' : 'border-black/10'} focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40] transition-all bg-white`}
                    >
                      <option value="">Select type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Institutional">Institutional</option>
                      <option value="Landscape Architecture">Landscape Architecture</option>
                      <option value="Public Space Design">Public Space Design</option>
                    </select>
                    {formErrors.project_type && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.project_type}</p>
                    )}
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Client
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-all border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40]"
                      placeholder="e.g., Private Developer"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-all border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40]"
                      placeholder="e.g., 4,200 m²"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-all bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F7F40]/20 focus:border-[#0F7F40]"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5 bg-[#F5EBE8]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-semibold transition-colors text-black/70 hover:bg-black/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-[#0F7F40] text-white font-semibold rounded-xl hover:bg-[#0c6633] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    {editingProject ? "Update Project" : "Create Project"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-center text-black">
              Delete Project?
            </h3>
            <p className="mb-6 text-center text-black/50">
              Are you sure you want to delete <strong>{projectToDelete?.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 font-semibold text-black/70 transition-colors bg-[#F5EBE8] rounded-xl hover:bg-[#F5EBE8]/80"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 font-semibold text-white transition-colors bg-red-600 rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}