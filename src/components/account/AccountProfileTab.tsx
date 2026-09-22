import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  MapPin,
  CheckCircle,
  Edit3,
  Save,
  Camera,
  Trash2,
  GraduationCap,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { User } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface AccountProfileTabProps {
  user: User;
  onUpdateUser?: (updated: Partial<User>) => void;
}

export const AccountProfileTab: React.FC<AccountProfileTabProps> = ({ user, onUpdateUser }) => {
  const { updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '+91 98765 43210');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);

  // Academic Fields
  const [university, setUniversity] = useState(
    user.profile?.university || user.campusName || 'University / Campus'
  );
  const [course, setCourse] = useState(user.profile?.course || 'B.Tech');
  const [branch, setBranch] = useState(user.profile?.branch || 'Computer Science & Engineering');
  const [year, setYear] = useState(user.profile?.year || '3rd Year (Class of 2026)');
  const [hostelBlock, setHostelBlock] = useState(
    user.profile?.hostelBlock || user.hostelBlock || 'Block B'
  );
  const [roomNumber, setRoomNumber] = useState(
    user.profile?.roomNumber || user.roomNumber || '304'
  );
  const [studentId, setStudentId] = useState(
    user.profile?.studentId || user.studentId || 'STU-2024-042'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please select a valid image format (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setValidationError('Image size must be less than 3 MB.');
      return;
    }

    setValidationError(null);

    // Create local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    // Save avatar update
    updateProfile({ avatarUrl: previewUrl });
    if (onUpdateUser) {
      onUpdateUser({ avatarUrl: previewUrl });
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    updateProfile({ avatarUrl: undefined });
    if (onUpdateUser) {
      onUpdateUser({ avatarUrl: undefined });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setValidationError('Full name must be at least 2 characters long.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setValidationError('Please provide a valid 10-digit mobile contact number.');
      return;
    }

    setIsSaving(true);

    const updatedUserPayload: Partial<User> = {
      name: name.trim(),
      phone: phone.trim(),
      avatarUrl,
      campusName: university,
      hostelBlock,
      roomNumber,
      studentId: studentId.trim(),
      profile: {
        ...(user.profile || {}),
        university,
        course,
        branch,
        year,
        hostelBlock,
        roomNumber,
        studentId: studentId.trim(),
        campusName: university,
      },
    };

    try {
      await updateProfile(updatedUserPayload);
      if (onUpdateUser) {
        onUpdateUser(updatedUserPayload);
      }
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      setValidationError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to current user values
    setName(user.name);
    setPhone(user.phone || '+91 98765 43210');
    setUniversity(user.profile?.university || user.campusName || 'University / Campus');
    setCourse(user.profile?.course || 'B.Tech');
    setBranch(user.profile?.branch || 'Computer Science & Engineering');
    setYear(user.profile?.year || '3rd Year (Class of 2026)');
    setHostelBlock(user.profile?.hostelBlock || user.hostelBlock || 'Block B');
    setRoomNumber(user.profile?.roomNumber || user.roomNumber || '304');
    setStudentId(user.profile?.studentId || user.studentId || 'STU-2024-042');
    setValidationError(null);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Toast Feedback */}
      {saveSuccess && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            color: '#22C55E',
            animation: 'easehubFadeIn 0.2s ease',
          }}
        >
          <CheckCircle size={16} />
          <span>Student profile updated successfully.</span>
        </div>
      )}

      {validationError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 43, 43, 0.1)',
            border: '1px solid rgba(255, 43, 43, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            color: '#FF7B72',
          }}
        >
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Avatar & Verification Banner Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-1)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          {/* Avatar with Photo Upload Trigger */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-3)',
                border: '2px solid var(--color-brand-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-blue-light)',
                overflow: 'hidden',
                boxShadow: '0 0 16px var(--color-blue-glow)',
                fontSize: '1.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile image"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-blue)',
                color: '#FFFFFF',
                border: '2px solid var(--color-surface-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={13} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)', fontWeight: 800, color: 'var(--color-text-primary, #0F172A)', margin: 0 }}>
                {user.name}
              </h2>
              {user.emailVerified ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  <ShieldCheck size={12} /> Verified Scholar
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 700,
                  }}
                >
                  Verification Pending
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
              <span>{user.email}</span>
              <span>•</span>
              <span style={{ color: 'var(--color-blue-light)' }}>{studentId}</span>
            </div>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: 0,
                  marginTop: '0.35rem',
                }}
              >
                <Trash2 size={11} /> Remove photo
              </button>
            )}
          </div>
        </div>

        {/* Edit / Save Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isEditing ? (
            <Button
              variant="secondary"
              size="md"
              icon={<Edit3 size={14} />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<Save size={14} />}
                loading={isSaving}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Grid: Identity & Academic Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-6)' }}>
        {/* Card 1: Personal Identity */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1rem, 2.5vw, var(--space-6))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
            <UserIcon size={18} color="var(--color-brand-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary, #0F172A)', margin: 0 }}>
              Personal Identity
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Full Name */}
            <div>
              <label style={fieldLabelStyle}>Legal Student Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              ) : (
                <div style={readOnlyValueStyle}>{name}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={fieldLabelStyle}>Institutional Email (Read-Only)</label>
                <span style={{ fontSize: '0.68rem', color: '#22C55E', fontWeight: 600 }}>Primary Identity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...readOnlyValueStyle, color: 'var(--color-text-secondary)' }}>
                <Mail size={14} color="var(--color-text-muted)" />
                <span>{user.email}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                Institutional email changes require university admin domain verification.
              </span>
            </div>

            {/* Phone */}
            <div>
              <label style={fieldLabelStyle}>Mobile Phone (Delivery Notices)</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...readOnlyValueStyle }}>
                  <Phone size={14} color="var(--color-text-muted)" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Academic & Hostel Residence */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1rem, 2.5vw, var(--space-6))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
            <GraduationCap size={18} color="var(--color-brand-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary, #0F172A)', margin: 0 }}>
              Academic & Campus Residence
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* University */}
            <div>
              <label style={fieldLabelStyle}>University / Institutional Campus</label>
              {isEditing ? (
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  style={inputStyle}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...readOnlyValueStyle }}>
                  <Building size={14} color="var(--color-text-muted)" />
                  <span>{university}</span>
                </div>
              )}
            </div>

            {/* Course & Branch */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
              <div>
                <label style={fieldLabelStyle}>Degree / Program</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech, MBA"
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...readOnlyValueStyle }}>
                    <BookOpen size={13} color="var(--color-text-muted)" />
                    <span>{course}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={fieldLabelStyle}>Academic Year</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 3rd Year"
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...readOnlyValueStyle }}>
                    <Calendar size={13} color="var(--color-text-muted)" />
                    <span>{year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Branch */}
            <div>
              <label style={fieldLabelStyle}>Department / Branch</label>
              {isEditing ? (
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  style={inputStyle}
                />
              ) : (
                <div style={readOnlyValueStyle}>{branch}</div>
              )}
            </div>

            {/* Hostel Block & Room Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
              <div>
                <label style={fieldLabelStyle}>Hostel Block</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g. Aryabhatta Block B"
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...readOnlyValueStyle }}>
                    <MapPin size={13} color="var(--color-text-muted)" />
                    <span>{hostelBlock}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={fieldLabelStyle}>Room Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 304"
                    style={inputStyle}
                  />
                ) : (
                  <div style={readOnlyValueStyle}>Room {roomNumber}</div>
                )}
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label style={fieldLabelStyle}>University Student ID / Roll Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2024-042"
                  style={inputStyle}
                />
              ) : (
                <div style={{ ...readOnlyValueStyle, color: 'var(--color-blue-light)', fontFamily: 'var(--font-mono)' }}>
                  {studentId}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontFamily: 'var(--font-display)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '44px',
  padding: '0.65rem 0.85rem',
  backgroundColor: 'var(--color-surface-2)',
  border: '1px solid var(--color-brand-blue)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary, #0F172A)',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
};

const readOnlyValueStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--color-text-primary, #0F172A)',
  padding: '0.2rem 0',
};
