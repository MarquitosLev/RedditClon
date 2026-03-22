import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createPost,
  fileToDataUrl,
  detectMediaType,
  type CreatePostInput,
} from '../../services/postService';

interface CreatePostBoxProps {
  onPostCreated: () => void;
}

const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onPostCreated }) => {
  const { authState } = useAuth();
  const user = authState.user;

  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Keep track of whether the editor is empty for placeholder display
  const handleEditorInput = () => {
    const el = editorRef.current;
    if (!el) return;
    setIsEmpty(el.innerText.trim() === '');
  };

  // Apply rich text formatting via execCommand
  const applyFormat = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('El título no puede estar vacío.');
      return;
    }
    if (!user) return;

    const bodyHtml = editorRef.current?.innerHTML ?? '';
    const bodyText = editorRef.current?.innerText?.trim() ?? '';

    setError('');
    setIsSubmitting(true);
    try {
      const input: CreatePostInput = {
        title: title.trim(),
        body: bodyText ? bodyHtml : '',
        authorUsername: user.username,
        authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      };
      if (selectedFile) {
        input.mediaUrl = await fileToDataUrl(selectedFile);
        input.mediaType = detectMediaType(selectedFile);
      }
      createPost(input);
      // Reset
      setTitle('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        setIsEmpty(true);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onPostCreated();
    } catch {
      setError('Hubo un error al publicar. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title.trim().length > 0 && !isSubmitting;

  return (
    <div className="create-post-box">
      {/* Header: avatar + title */}
      <div className="create-post-header">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username ?? 'guest'}`}
          alt="avatar"
          className="create-post-avatar"
        />
        <input
          className="create-post-title-input"
          type="text"
          placeholder="Título de la publicación *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
        />
      </div>

      {/* Body: rich text editor */}
      <div className="create-post-body">
        <div className="create-post-editor-wrapper">
          {isEmpty && (
            <span className="editor-placeholder">¿Qué estás pensando?</span>
          )}
          <div
            ref={editorRef}
            className="create-post-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            spellCheck
          />
        </div>

        {/* File preview */}
        {selectedFile && (
          <div className="create-post-preview">
            {selectedFile.type.startsWith('image/') && previewUrl && (
              <img src={previewUrl} alt="Preview" className="media-preview-img" />
            )}
            {selectedFile.type.startsWith('video/') && previewUrl && (
              <video src={previewUrl} controls className="media-preview-video" />
            )}
            {!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/') && (
              <div className="media-preview-other">📎 {selectedFile.name}</div>
            )}
            <button className="remove-media-btn" onClick={handleRemoveFile} type="button">
              ✕ Quitar archivo
            </button>
          </div>
        )}
      </div>

      {/* Footer: attach + formatting toolbar + submit */}
      <div className="create-post-footer">
        <div className="create-post-footer-left">
          {/* Attach button */}
          <button
            className={`attach-btn ${selectedFile ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            title={selectedFile ? selectedFile.name : 'Adjuntar imagen o video'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
            {selectedFile && <span className="attach-dot" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Divider */}
          <span className="toolbar-divider" />

          {/* Formatting buttons */}
          <div className="format-toolbar">
            <button className="fmt-btn" type="button" title="Negrita" onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}>
              <strong>B</strong>
            </button>
            <button className="fmt-btn" type="button" title="Cursiva" onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}>
              <em>I</em>
            </button>
            <button className="fmt-btn" type="button" title="Subrayado" onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }}>
              <span style={{ textDecoration: 'underline' }}>U</span>
            </button>
            <button className="fmt-btn" type="button" title="Tachado" onMouseDown={(e) => { e.preventDefault(); applyFormat('strikeThrough'); }}>
              <span style={{ textDecoration: 'line-through' }}>S</span>
            </button>
            <button className="fmt-btn" type="button" title="Enlace" onMouseDown={(e) => {
              e.preventDefault();
              const url = prompt('URL del enlace:');
              if (url) applyFormat('createLink', url);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <button className="fmt-btn" type="button" title="Lista" onMouseDown={(e) => { e.preventDefault(); applyFormat('insertUnorderedList'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="create-post-footer-right">
          {error && <span className="create-post-error">{error}</span>}
          <button
            className="create-post-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            type="button"
          >
            {isSubmitting ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
