'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Download,
  Search,
  Grid,
  List,
  Calendar,
  FileText
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { MediaFile } from '@/types/admin';

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFiles(prev => [data.file, ...prev]);
        } else {
          const error = await response.json();
          alert(error.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed');
      }
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
  });

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/media?id=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
        setSelectedFiles(selectedFiles.filter(id => id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const copyUrl = (url: string, filename: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopySuccess(filename);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deleteSelectedFiles = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) {
      return;
    }

    for (const fileId of selectedFiles) {
      await deleteFile(fileId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ice-white mb-2">Media Library</h1>
            <p className="text-ice-white/60">Manage your images and files</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedFiles.length > 0 && (
              <button
                onClick={deleteSelectedFiles}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedFiles.length})
              </button>
            )}
            
            <div className="flex items-center bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-ice-yellow/20 text-ice-yellow' 
                    : 'text-ice-white/60 hover:text-ice-white'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-ice-yellow/20 text-ice-yellow' 
                    : 'text-ice-white/60 hover:text-ice-white'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragActive
              ? 'border-ice-yellow bg-ice-yellow/5'
              : 'border-ice-yellow/30 hover:border-ice-yellow/50 hover:bg-ice-yellow/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-ice-yellow/10 rounded-full flex items-center justify-center">
              <Upload className="text-ice-yellow" size={24} />
            </div>
            <div>
              <p className="text-ice-white font-medium mb-2">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-ice-white/60 text-sm">
                Supports: JPEG, PNG, WebP, GIF (max 10MB each)
              </p>
            </div>
            {isUploading && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-ice-yellow border-t-transparent rounded-full"></div>
                <span className="text-ice-yellow text-sm">Uploading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-yellow/60" size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
            />
          </div>
          
          <div className="text-ice-white/60 text-sm">
            {filteredFiles.length} of {files.length} files
          </div>
        </div>

        {/* Files Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-ice-yellow border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-ice-white/60">Loading files...</p>
          </div>
        ) : filteredFiles.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-ice-black/60 backdrop-blur-sm border rounded-xl overflow-hidden hover:border-ice-yellow/40 transition-all duration-300 group ${
                    selectedFiles.includes(file.id) ? 'border-ice-yellow ring-2 ring-ice-yellow/20' : 'border-ice-yellow/20'
                  }`}
                >
                  <div className="relative aspect-square">
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(file.url, file.originalName)}
                        className="p-2 bg-ice-yellow/20 text-ice-yellow rounded-lg hover:bg-ice-yellow/30 transition-colors duration-300"
                        title="Copy URL"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-4 h-4 text-ice-yellow bg-ice-black/80 border-ice-yellow/30 rounded focus:ring-ice-yellow focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-ice-white text-sm font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="text-ice-white/60 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl overflow-hidden">
              <div className="divide-y divide-ice-yellow/10">
                {filteredFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 hover:bg-ice-yellow/5 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-4 h-4 text-ice-yellow bg-ice-black/80 border-ice-yellow/30 rounded focus:ring-ice-yellow focus:ring-2"
                      />
                      
                      <div className="w-12 h-12 bg-ice-yellow/10 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-ice-white font-medium truncate">{file.originalName}</p>
                        <div className="flex items-center gap-4 text-sm text-ice-white/60">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyUrl(file.url, file.originalName)}
                          className="p-2 text-ice-yellow hover:bg-ice-yellow/10 rounded-lg transition-all duration-300"
                          title="Copy URL"
                        >
                          <Copy size={18} />
                        </button>
                        <a
                          href={file.url}
                          download={file.originalName}
                          className="p-2 text-ice-white hover:bg-ice-white/10 rounded-lg transition-all duration-300"
                          title="Download"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-ice-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ice-white mb-2">No files found</h3>
            <p className="text-ice-white/60 mb-4">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Upload your first file to get started.'}
            </p>
            {!searchQuery && (
              <div className="bg-ice-yellow/10 border border-ice-yellow/30 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-ice-yellow font-semibold mb-2">💡 How to use Media Library:</h4>
                <ul className="text-ice-white/70 text-sm space-y-1 text-left">
                  <li>• Upload images for your blog posts</li>
                  <li>• Copy URLs to embed in articles</li>
                  <li>• Organize and manage all visual content</li>
                  <li>• Use for featured images and inline graphics</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Copy Success Toast */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Copy size={16} />
          <span>URL copied for {copySuccess}!</span>
        </div>
      )}
    </AdminLayout>
  );
}
