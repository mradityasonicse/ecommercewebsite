import React, { useState, useEffect } from 'react';
import {
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Tag,
  Phone,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { ProviderProfile, ProviderServiceItem } from '../../types/provider';
import { ProviderService } from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';

interface ProviderProfilePageProps {
  onNavigateToSettings?: () => void;
  onNavigateToOnboarding?: () => void;
  onNavigateToAuth?: () => void;
}

export const ProviderProfilePage: React.FC<ProviderProfilePageProps> = ({
  onNavigateToSettings,
  onNavigateToOnboarding,
  onNavigateToAuth,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      ProviderService.getProviderProfile(user.id).then((p) => {
        if (!isMounted) return;
        setProfile(p);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Provider Authentication Required
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Please sign in with your verified provider account credentials to access your business profile.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            if (onNavigateToAuth) onNavigateToAuth();
            else window.location.hash = '#auth/sign-in?returnTo=#provider/profile';
          }}
        >
          Sign In as Provider
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading provider profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          maxWidth: '680px',
          margin: '4rem auto',
          padding: '2.5rem',
          backgroundColor: 'var(--color-surface-1)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <Building size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          No Approved Provider Profile Found
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Access to the provider profile manager requires an approved EaseHub partner account. If you have already applied, check your application status below.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              window.location.hash = '#provider/status';
            }}
          >
            Check Application Status
          </Button>
          {onNavigateToOnboarding && (
            <Button variant="outline" size="md" onClick={onNavigateToOnboarding}>
              Apply as Provider
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');
    try {
      const updated = await ProviderService.updateProviderProfile(user.id, profile);
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = () => {
    const newService: ProviderServiceItem = {
      id: `srv-${Date.now()}`,
      name: 'New Service Item',
      description: '',
      category: profile.primaryCategory,
      price: 100,
      pricingUnit: 'per order',
      status: 'active',
    };
    setProfile({
      ...profile,
      services: [...profile.services, newService],
    });
  };

  const handleRemoveService = (index: number) => {
    const updated = [...profile.services];
    updated.splice(index, 1);
    setProfile({ ...profile, services: updated });
  };

  return (
    <div className="easehub-provider-profile-page" style={{ minHeight: '100vh', padding: 'calc(var(--navbar-height, 76px) + 2rem) 0 5rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-blue-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Verified Provider Profile
              </span>
              <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                {profile.verificationBadge || 'Active Partner'}
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {profile.businessName}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {onNavigateToSettings && (
              <Button variant="outline" size="sm" onClick={onNavigateToSettings}>
                Settings
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveProfile}
              disabled={isSaving}
              icon={<Save size={15} />}
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#10B981',
              fontSize: '0.84rem',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Profile updates have been published to your student storefront.</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(255, 43, 43, 0.12)',
              border: '1px solid rgba(255, 43, 43, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#FF7B72',
              fontSize: '0.84rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. Storefront Identity */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="var(--color-blue-light)" />
              <span>Storefront Brand Identity</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                  Business Storefront Name
                </label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                  Storefront Description & Student Bio
                </label>
                <textarea
                  rows={3}
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 2. Live Services Catalog */}
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={18} color="var(--color-blue-light)" />
                <span>Active Service Catalog ({profile.services.length})</span>
              </h3>

              <Button variant="ghost" size="sm" onClick={handleAddService} icon={<Plus size={14} />}>
                Add Service
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.services.map((service, index) => (
                <div
                  key={service.id || index}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={service.name}
                      placeholder="Service title"
                      onChange={(e) => {
                        const updated = [...profile.services];
                        updated[index].name = e.target.value;
                        setProfile({ ...profile, services: updated });
                      }}
                      style={{
                        flex: 1,
                        marginRight: '1rem',
                        padding: '0.45rem 0.65rem',
                        backgroundColor: 'var(--color-surface-3)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-xs)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      style={{ background: 'none', border: 'none', color: '#FF7B72', cursor: 'pointer', padding: '0.3rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => {
                          const updated = [...profile.services];
                          updated[index].price = parseFloat(e.target.value) || 0;
                          setProfile({ ...profile, services: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.65rem',
                          backgroundColor: 'var(--color-surface-3)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: 'var(--radius-xs)',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Unit
                      </label>
                      <input
                        type="text"
                        value={service.pricingUnit}
                        onChange={(e) => {
                          const updated = [...profile.services];
                          updated[index].pricingUnit = e.target.value;
                          setProfile({ ...profile, services: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.65rem',
                          backgroundColor: 'var(--color-surface-3)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: 'var(--radius-xs)',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Turnaround
                      </label>
                      <input
                        type="text"
                        value={service.turnaround || ''}
                        onChange={(e) => {
                          const updated = [...profile.services];
                          updated[index].turnaround = e.target.value;
                          setProfile({ ...profile, services: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.65rem',
                          backgroundColor: 'var(--color-surface-3)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: 'var(--radius-xs)',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Campus Facility Location & Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-blue-light)" />
                <span>Facility Location</span>
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.25rem' }}>
                {profile.location.campusName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {profile.location.facilityAddress}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                Landmark: {profile.location.landmark} (Perimeter: {profile.location.serviceRadiusKm} km)
              </div>
            </div>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-blue-light)" />
                <span>Contact Details</span>
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                {profile.contact.contactPerson} {profile.contact.designation && `(${profile.contact.designation})`}
              </div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Phone: {profile.contact.phone}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Email: {profile.contact.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
