"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

interface Props {
  userId: number;
  avatarUrl: string | null;
  name: string;
  username: string;
  profileUrl: string;
}

export default function ProfileActions({ userId, avatarUrl, name, username, profileUrl }: Props) {
  const { user } = useAuth();
  const isOwner = user && user.id === userId;
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch("/api/auth/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (data.avatar_url) setAvatar(data.avatar_url);
    } catch { /* ignore */ }
    setUploading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Avatar */}
      <div className="relative inline-block">
        {isOwner && <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />}
        <button
          onClick={() => isOwner && fileRef.current?.click()}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg shadow-[#1E6DF0]/20 ${isOwner ? "cursor-pointer group" : "cursor-default"}`}
          disabled={!isOwner || uploading}
          title={isOwner ? "Change profile photo" : `@${username}`}
        >
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1E6DF0] to-[#3B82F6] flex items-center justify-center text-white text-3xl sm:text-4xl font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {isOwner && (
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Copy link below stats — rendered in parent, but we expose the button here */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#1E6DF0] hover:text-[#1557CC] font-medium transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
        {isOwner && (
          <>
            <span className="text-[#CBD5E1]">|</span>
            <a href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] font-medium transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit profile
            </a>
          </>
        )}
      </div>
    </>
  );
}
