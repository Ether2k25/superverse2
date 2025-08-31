'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title: string;
}

export default function MediaGalleryModal({ isOpen, onClose, onSelect, title }: MediaGalleryModalProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMediaFiles();
    }
  }, [isOpen]);

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async () => {
    if (selectedFile) {
      try {
        await onSelect(selectedFile);
        onClose();
        setSelectedFile('');
      } catch (error) {
        console.error('Error selecting media file:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[80vh] bg-ice-black border border-ice-yellow/20 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-ice-yellow/20">
              <div>
                <h2 className="text-xl font-bold text-ice-white">{title}</h2>
                <p className="text-ice-white/60 text-sm">Select an image from your media gallery</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-ice-white/60 hover:text-ice-white transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ice-yellow"></div>
                  <span className="ml-3 text-ice-white/60">Loading media files...</span>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-ice-white/40 mb-4" />
                  <p className="text-ice-white/60">No media files found</p>
                  <p className="text-ice-white/40 text-sm mt-2">Upload some images to get started</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedFile === file.url
                            ? 'border-ice-yellow shadow-lg shadow-ice-yellow/20'
                            : 'border-ice-white/10 hover:border-ice-yellow/50'
                        }`}
                        onClick={() => setSelectedFile(file.url)}
                      >
                        <div className="aspect-square bg-ice-black/60 flex items-center justify-center">
                          {file.mimeType.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.originalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-ice-white/40" />
                          )}
                        </div>

                        {/* Selection indicator */}
                        {selectedFile === file.url && (
                          <div className="absolute inset-0 bg-ice-yellow/20 flex items-center justify-center">
                            <div className="bg-ice-yellow text-ice-black rounded-full p-1">
                              <Check size={16} />
                            </div>
                          </div>
                        )}

                        {/* File info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">
                            {file.originalName}
                          </p>
                          <p className="text-white/60 text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-ice-yellow/20">
              <div className="text-ice-white/60 text-sm">
                {selectedFile ? 'Image selected' : 'Select an image to continue'}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-ice-white/60 hover:text-ice-white transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelect}
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-ice-yellow text-ice-black rounded-lg font-semibold transition-all duration-300 hover:bg-ice-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select Image
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
