'use client';

import * as React from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

type HomepageSectionSettings = {
  sectionLabel: string;
  sectionTitle: string;
  sectionBody: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  backgroundImageUrl?: string;
};

type HomepageSettingsForm = {
  whyDibf: HomepageSectionSettings;
  coreFocus: HomepageSectionSettings;
  partnership: HomepageSectionSettings;
  impactStore: HomepageSectionSettings;
  finalCta: HomepageSectionSettings;
};

const possibleDocPaths = [
  'websiteConfiguration/homepage',
  'websiteConfigurations/homepage',
  'website-configurations/homepage',
  'siteSettings/homepage',
  'settings/homepage',
  'configuration/homepage',
  'homepageSettings/default',
  'homepageSettings/homepage',
];

const defaultSettings: HomepageSettingsForm = {
  whyDibf: {
    sectionLabel: 'WHY DIBF',
    sectionTitle: 'A trusted platform for shared impact.',
    sectionBody:
      'DIBF stands as a trusted platform for health, humanitarian service, sustainable giving, education, and community-centered development.',
    imageUrl: '',
    ctaLabel: '',
    ctaLink: '',
  },
  coreFocus: {
    sectionLabel: 'CORE FOCUS AREAS',
    sectionTitle: 'Where DIBF Creates Meaningful Change',
    sectionBody:
      'Our work connects health, education, community development, giving, research, and partnerships into one shared impact platform.',
    imageUrl: '',
    ctaLabel: '',
    ctaLink: '',
  },
  partnership: {
    sectionLabel: 'PARTNERSHIPS',
    sectionTitle: 'Stronger Together. Greater Impact.',
    sectionBody:
      'We believe meaningful change happens through collaboration. Partner with us to build healthier, more resilient communities across the globe.',
    imageUrl: '',
    ctaLabel: 'Partner With Us',
    ctaLink: '/get-involved/partner',
  },
  impactStore: {
    sectionLabel: 'IMPACT STORE',
    sectionTitle: 'Shop With Purpose.',
    sectionBody:
      'Every purchase helps support health outreach, community programs, and sustainable impact initiatives.',
    imageUrl: '',
    ctaLabel: 'Visit Impact Store',
    ctaLink: '/impact-store',
  },
  finalCta: {
    sectionLabel: 'BE PART OF THE JOURNEY',
    sectionTitle: 'Make an Impact Today',
    sectionBody:
      'Your support helps us reach more communities with healthcare, education, and opportunity.',
    imageUrl: '',
    backgroundImageUrl: '',
    ctaLabel: 'Give Now',
    ctaLink: '/give',
  },
};

function getString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getObject(source: Record<string, unknown>, key: string) {
  const value = source[key];

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function pickString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getString(source[key]);
    if (value) return value;
  }

  return '';
}

function normalizeSettings(value: unknown): HomepageSettingsForm {
  const data =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const whyDibf = getObject(data, 'whyDibf');
  const coreFocus = getObject(data, 'coreFocus');
  const partnership = getObject(data, 'partnership');
  const impactStore = getObject(data, 'impactStore');
  const finalCta = getObject(data, 'finalCta');

  return {
    whyDibf: {
      sectionLabel:
        pickString(whyDibf, ['sectionLabel', 'label']) ||
        pickString(data, ['whyDibfSectionLabel', 'whyDibfLabel']) ||
        defaultSettings.whyDibf.sectionLabel,
      sectionTitle:
        pickString(whyDibf, ['sectionTitle', 'title']) ||
        pickString(data, ['whyDibfSectionTitle', 'whyDibfTitle']) ||
        defaultSettings.whyDibf.sectionTitle,
      sectionBody:
        pickString(whyDibf, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['whyDibfSectionBody', 'whyDibfBody']) ||
        defaultSettings.whyDibf.sectionBody,
      imageUrl:
        pickString(whyDibf, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['whyDibfImageUrl', 'whyDibfImage']),
      ctaLabel: '',
      ctaLink: '',
    },

    coreFocus: {
      sectionLabel:
        pickString(coreFocus, ['sectionLabel', 'label']) ||
        pickString(data, ['coreFocusSectionLabel', 'coreFocusLabel']) ||
        defaultSettings.coreFocus.sectionLabel,
      sectionTitle:
        pickString(coreFocus, ['sectionTitle', 'title']) ||
        pickString(data, ['coreFocusSectionTitle', 'coreFocusTitle']) ||
        defaultSettings.coreFocus.sectionTitle,
      sectionBody:
        pickString(coreFocus, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['coreFocusSectionBody', 'coreFocusBody']) ||
        defaultSettings.coreFocus.sectionBody,
      imageUrl:
        pickString(coreFocus, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['coreFocusImageUrl', 'coreFocusImage']),
      ctaLabel: '',
      ctaLink: '',
    },

    partnership: {
      sectionLabel:
        pickString(partnership, ['sectionLabel', 'label']) ||
        pickString(data, ['partnershipSectionLabel', 'partnershipLabel']) ||
        defaultSettings.partnership.sectionLabel,
      sectionTitle:
        pickString(partnership, ['sectionTitle', 'title']) ||
        pickString(data, ['partnershipSectionTitle', 'partnershipTitle']) ||
        defaultSettings.partnership.sectionTitle,
      sectionBody:
        pickString(partnership, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['partnershipSectionBody', 'partnershipBody']) ||
        defaultSettings.partnership.sectionBody,
      imageUrl:
        pickString(partnership, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['partnershipImageUrl', 'partnershipImage']),
      ctaLabel:
        pickString(partnership, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, ['partnershipCtaLabel']) ||
        defaultSettings.partnership.ctaLabel,
      ctaLink:
        pickString(partnership, ['ctaLink', 'buttonLink']) ||
        pickString(data, ['partnershipCtaLink']) ||
        defaultSettings.partnership.ctaLink,
    },

    impactStore: {
      sectionLabel:
        pickString(impactStore, ['sectionLabel', 'label']) ||
        pickString(data, ['impactStoreSectionLabel', 'impactStoreLabel']) ||
        defaultSettings.impactStore.sectionLabel,
      sectionTitle:
        pickString(impactStore, ['sectionTitle', 'title']) ||
        pickString(data, ['impactStoreSectionTitle', 'impactStoreTitle']) ||
        defaultSettings.impactStore.sectionTitle,
      sectionBody:
        pickString(impactStore, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['impactStoreSectionBody', 'impactStoreBody']) ||
        defaultSettings.impactStore.sectionBody,
      imageUrl:
        pickString(impactStore, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['impactStoreImageUrl', 'impactStoreImage']),
      ctaLabel:
        pickString(impactStore, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, ['impactStoreCtaLabel']) ||
        defaultSettings.impactStore.ctaLabel,
      ctaLink:
        pickString(impactStore, ['ctaLink', 'buttonLink']) ||
        pickString(data, ['impactStoreCtaLink']) ||
        defaultSettings.impactStore.ctaLink,
    },

    finalCta: {
      sectionLabel:
        pickString(finalCta, ['sectionLabel', 'label']) ||
        pickString(data, ['finalCtaSectionLabel']) ||
        defaultSettings.finalCta.sectionLabel,
      sectionTitle:
        pickString(finalCta, ['sectionTitle', 'title', 'ctaTitle']) ||
        pickString(data, ['finalCtaTitle', 'ctaTitle']) ||
        defaultSettings.finalCta.sectionTitle,
      sectionBody:
        pickString(finalCta, ['sectionBody', 'body', 'ctaBody']) ||
        pickString(data, ['finalCtaBody', 'ctaBody']) ||
        defaultSettings.finalCta.sectionBody,
      imageUrl:
        pickString(finalCta, ['imageUrl', 'image']) ||
        pickString(data, ['finalCtaImageUrl']),
      backgroundImageUrl:
        pickString(finalCta, [
          'backgroundImageUrl',
          'backgroundImage',
          'imageUrl',
        ]) || pickString(data, ['finalCtaBackgroundImageUrl', 'finalCtaImageUrl']),
      ctaLabel:
        pickString(finalCta, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, ['finalCtaLabel', 'finalCtaButtonLabel']) ||
        defaultSettings.finalCta.ctaLabel,
      ctaLink:
        pickString(finalCta, ['ctaLink', 'buttonLink']) ||
        pickString(data, ['finalCtaLink', 'finalCtaButtonLink']) ||
        defaultSettings.finalCta.ctaLink,
    },
  };
}

function pickValue(current: string, incoming: string) {
  return incoming && incoming.trim() ? incoming : current;
}

function mergeSection(
  current: HomepageSectionSettings,
  incoming: HomepageSectionSettings
): HomepageSectionSettings {
  return {
    sectionLabel: pickValue(current.sectionLabel, incoming.sectionLabel),
    sectionTitle: pickValue(current.sectionTitle, incoming.sectionTitle),
    sectionBody: pickValue(current.sectionBody, incoming.sectionBody),
    imageUrl: pickValue(current.imageUrl, incoming.imageUrl),
    backgroundImageUrl: pickValue(
      current.backgroundImageUrl || '',
      incoming.backgroundImageUrl || ''
    ),
    ctaLabel: pickValue(current.ctaLabel, incoming.ctaLabel),
    ctaLink: pickValue(current.ctaLink, incoming.ctaLink),
  };
}

function mergeSettings(
  current: HomepageSettingsForm,
  incoming: HomepageSettingsForm
): HomepageSettingsForm {
  return {
    whyDibf: mergeSection(current.whyDibf, incoming.whyDibf),
    coreFocus: mergeSection(current.coreFocus, incoming.coreFocus),
    partnership: mergeSection(current.partnership, incoming.partnership),
    impactStore: mergeSection(current.impactStore, incoming.impactStore),
    finalCta: mergeSection(current.finalCta, incoming.finalCta),
  };
}

function updateSectionField(
  settings: HomepageSettingsForm,
  section: keyof HomepageSettingsForm,
  field: keyof HomepageSectionSettings,
  value: string
): HomepageSettingsForm {
  return {
    ...settings,
    [section]: {
      ...settings[section],
      [field]: value,
    },
  };
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function ImagePreview({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl?: string;
}) {
  if (!imageUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        {label} preview will appear here after adding an image URL.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={imageUrl} alt={label} className="h-72 w-full object-cover" />
      </div>
    </div>
  );
}

export default function HomepageSettingsPage() {
  const [settings, setSettings] =
    React.useState<HomepageSettingsForm>(defaultSettings);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        let mergedSettings = defaultSettings;

        for (const path of possibleDocPaths) {
          try {
            const snapshot = await getDoc(doc(db, path));

            if (snapshot.exists()) {
              mergedSettings = mergeSettings(
                mergedSettings,
                normalizeSettings(snapshot.data())
              );
            }
          } catch {
            continue;
          }
        }

        if (isMounted) {
          setSettings(mergedSettings);
        }
      } catch {
        if (isMounted) {
          setError('Could not load homepage settings. Showing defaults.');
          setSettings(defaultSettings);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    section: keyof HomepageSettingsForm,
    field: keyof HomepageSectionSettings,
    value: string
  ) => {
    setSettings((current) => updateSectionField(current, section, field, value));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setSuccess('');
    setError('');

    try {
      await setDoc(
        doc(db, 'homepageSettings', 'homepage'),
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccess('Homepage settings saved successfully.');
    } catch {
      setError('Failed to save homepage settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-slate-600">Loading homepage settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32">
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-black text-secondary">
          Homepage Settings
        </h1>
        <p className="mt-2 text-slate-600">
          Manage homepage section text, images, and call-to-action buttons.
        </p>
      </section>

      {success ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-900">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-900">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-black text-secondary">
          Why DIBF Section
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TextInput
            label="Section Label"
            value={settings.whyDibf.sectionLabel}
            onChange={(value) =>
              handleChange('whyDibf', 'sectionLabel', value)
            }
          />

          <TextInput
            label="Section Title"
            value={settings.whyDibf.sectionTitle}
            onChange={(value) =>
              handleChange('whyDibf', 'sectionTitle', value)
            }
          />

          <div className="lg:col-span-2">
            <TextArea
              label="Section Body"
              value={settings.whyDibf.sectionBody}
              onChange={(value) =>
                handleChange('whyDibf', 'sectionBody', value)
              }
            />
          </div>

          <div className="lg:col-span-2">
            <TextInput
              label="Image URL"
              value={settings.whyDibf.imageUrl}
              onChange={(value) => handleChange('whyDibf', 'imageUrl', value)}
              placeholder="https://..."
            />
          </div>

          <div className="lg:col-span-2">
            <ImagePreview
              label="Why DIBF Image Preview"
              imageUrl={settings.whyDibf.imageUrl}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-black text-secondary">
          Core Focus Areas Section
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TextInput
            label="Section Label"
            value={settings.coreFocus.sectionLabel}
            onChange={(value) =>
              handleChange('coreFocus', 'sectionLabel', value)
            }
          />

          <TextInput
            label="Section Title"
            value={settings.coreFocus.sectionTitle}
            onChange={(value) =>
              handleChange('coreFocus', 'sectionTitle', value)
            }
          />

          <div className="lg:col-span-2">
            <TextArea
              label="Section Body"
              value={settings.coreFocus.sectionBody}
              onChange={(value) =>
                handleChange('coreFocus', 'sectionBody', value)
              }
            />
          </div>

          <div className="lg:col-span-2">
            <TextInput
              label="Image URL"
              value={settings.coreFocus.imageUrl}
              onChange={(value) => handleChange('coreFocus', 'imageUrl', value)}
              placeholder="https://..."
            />
          </div>

          <div className="lg:col-span-2">
            <ImagePreview
              label="Core Focus Areas Image Preview"
              imageUrl={settings.coreFocus.imageUrl}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-black text-secondary">
          Partnership Section
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TextInput
            label="Section Label"
            value={settings.partnership.sectionLabel}
            onChange={(value) =>
              handleChange('partnership', 'sectionLabel', value)
            }
          />

          <TextInput
            label="Section Title"
            value={settings.partnership.sectionTitle}
            onChange={(value) =>
              handleChange('partnership', 'sectionTitle', value)
            }
          />

          <div className="lg:col-span-2">
            <TextArea
              label="Section Body"
              value={settings.partnership.sectionBody}
              onChange={(value) =>
                handleChange('partnership', 'sectionBody', value)
              }
            />
          </div>

          <div className="lg:col-span-2">
            <TextInput
              label="Image URL"
              value={settings.partnership.imageUrl}
              onChange={(value) =>
                handleChange('partnership', 'imageUrl', value)
              }
              placeholder="https://..."
            />
          </div>

          <div className="lg:col-span-2">
            <ImagePreview
              label="Partnership Image Preview"
              imageUrl={settings.partnership.imageUrl}
            />
          </div>

          <TextInput
            label="CTA Label"
            value={settings.partnership.ctaLabel}
            onChange={(value) => handleChange('partnership', 'ctaLabel', value)}
          />

          <TextInput
            label="CTA Link"
            value={settings.partnership.ctaLink}
            onChange={(value) => handleChange('partnership', 'ctaLink', value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-black text-secondary">
          Impact Store Section
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TextInput
            label="Section Label"
            value={settings.impactStore.sectionLabel}
            onChange={(value) =>
              handleChange('impactStore', 'sectionLabel', value)
            }
          />

          <TextInput
            label="Section Title"
            value={settings.impactStore.sectionTitle}
            onChange={(value) =>
              handleChange('impactStore', 'sectionTitle', value)
            }
          />

          <div className="lg:col-span-2">
            <TextArea
              label="Section Body"
              value={settings.impactStore.sectionBody}
              onChange={(value) =>
                handleChange('impactStore', 'sectionBody', value)
              }
            />
          </div>

          <div className="lg:col-span-2">
            <TextInput
              label="Image URL"
              value={settings.impactStore.imageUrl}
              onChange={(value) =>
                handleChange('impactStore', 'imageUrl', value)
              }
              placeholder="https://..."
            />
          </div>

          <div className="lg:col-span-2">
            <ImagePreview
              label="Impact Store Image Preview"
              imageUrl={settings.impactStore.imageUrl}
            />
          </div>

          <TextInput
            label="CTA Label"
            value={settings.impactStore.ctaLabel}
            onChange={(value) => handleChange('impactStore', 'ctaLabel', value)}
          />

          <TextInput
            label="CTA Link"
            value={settings.impactStore.ctaLink}
            onChange={(value) => handleChange('impactStore', 'ctaLink', value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-black text-secondary">
          Final CTA Section
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TextInput
            label="Section Label"
            value={settings.finalCta.sectionLabel}
            onChange={(value) =>
              handleChange('finalCta', 'sectionLabel', value)
            }
          />

          <TextInput
            label="CTA Title"
            value={settings.finalCta.sectionTitle}
            onChange={(value) =>
              handleChange('finalCta', 'sectionTitle', value)
            }
          />

          <div className="lg:col-span-2">
            <TextArea
              label="CTA Body"
              value={settings.finalCta.sectionBody}
              onChange={(value) =>
                handleChange('finalCta', 'sectionBody', value)
              }
            />
          </div>

          <div className="lg:col-span-2">
            <TextInput
              label="Background Image URL"
              value={settings.finalCta.backgroundImageUrl || ''}
              onChange={(value) =>
                handleChange('finalCta', 'backgroundImageUrl', value)
              }
              placeholder="https://..."
            />
          </div>

          <div className="lg:col-span-2">
            <ImagePreview
              label="Final CTA Background Preview"
              imageUrl={settings.finalCta.backgroundImageUrl}
            />
          </div>

          <TextInput
            label="CTA Label"
            value={settings.finalCta.ctaLabel}
            onChange={(value) => handleChange('finalCta', 'ctaLabel', value)}
          />

          <TextInput
            label="CTA Link"
            value={settings.finalCta.ctaLink}
            onChange={(value) => handleChange('finalCta', 'ctaLink', value)}
          />
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="h-14 rounded-2xl bg-primary px-10 text-base font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Homepage Settings'}
          </button>
        </div>
      </div>
    </form>
  );
}