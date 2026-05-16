import type { ColorPalette, GeneratedSite, SiteSection } from "@/types";
import { useCallback, useEffect, useRef } from "react";

interface SitePreviewProps {
  generatedData: GeneratedSite;
  editingField: EditingField | null;
  onStartEdit: (field: EditingField) => void;
  onSaveEdit: (value: string) => void;
  onCancelEdit: () => void;
  highlightedSection: string | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

export interface EditingField {
  sectionIndex: number;
  field: "heading" | "body";
  originalValue: string;
}

function getStyle(palette: ColorPalette) {
  return {
    "--site-primary": palette.primary,
    "--site-secondary": palette.secondary,
    "--site-accent": palette.accent,
    "--site-bg": palette.background,
    "--site-text": palette.text,
  } as React.CSSProperties;
}

interface SectionProps {
  section: SiteSection;
  index: number;
  palette: ColorPalette;
  isHighlighted: boolean;
  editingField: EditingField | null;
  onStartEdit: (field: EditingField) => void;
  onSaveEdit: (value: string) => void;
  onCancelEdit: () => void;
  sectionRef: (el: HTMLElement | null) => void;
}

function EditableText({
  value,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  className,
  as: Tag = "span",
}: {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (v: string) => void;
  onCancelEdit: () => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        defaultValue={value}
        className={`${className} bg-transparent border border-dashed border-primary outline-none resize-none w-full rounded px-1`}
        rows={Tag === "p" ? 3 : 1}
        onBlur={(e) => onSaveEdit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSaveEdit(e.currentTarget.value);
          }
          if (e.key === "Escape") onCancelEdit();
        }}
      />
    );
  }

  return (
    <Tag
      className={`${className} cursor-text hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/50 rounded px-1 -mx-1 transition-all`}
      onClick={onStartEdit}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}

function HeroSection({
  section,
  palette,
  isHighlighted,
  editingField,
  index,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sectionRef,
}: SectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[70vh] flex flex-col items-center justify-center px-8 py-20 text-center transition-all ${isHighlighted ? "ring-2 ring-inset ring-primary/40" : ""}`}
      style={{ background: palette.primary, color: palette.background }}
    >
      <div className="max-w-3xl mx-auto">
        <EditableText
          as="h1"
          value={section.heading}
          className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "heading"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "heading",
              originalValue: section.heading,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        <EditableText
          as="p"
          value={section.body}
          className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "body"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "body",
              originalValue: section.body,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        {section.ctaText && (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: palette.accent, color: palette.text }}
          >
            {section.ctaText}
          </button>
        )}
      </div>
    </section>
  );
}

function AboutSection({
  section,
  palette,
  isHighlighted,
  editingField,
  index,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sectionRef,
}: SectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`px-8 py-16 transition-all ${isHighlighted ? "ring-2 ring-inset ring-primary/40" : ""}`}
      style={{ background: palette.background, color: palette.text }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <EditableText
            as="h2"
            value={section.heading}
            className="text-3xl font-bold font-display mb-4"
            isEditing={
              editingField?.sectionIndex === index &&
              editingField.field === "heading"
            }
            onStartEdit={() =>
              onStartEdit({
                sectionIndex: index,
                field: "heading",
                originalValue: section.heading,
              })
            }
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
          <EditableText
            as="p"
            value={section.body}
            className="text-base leading-relaxed opacity-80"
            isEditing={
              editingField?.sectionIndex === index &&
              editingField.field === "body"
            }
            onStartEdit={() =>
              onStartEdit({
                sectionIndex: index,
                field: "body",
                originalValue: section.body,
              })
            }
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        </div>
        <div
          className="rounded-2xl aspect-video flex items-center justify-center text-2xl"
          style={{ background: `${palette.secondary}33` }}
        >
          <span
            style={{ color: palette.primary }}
            className="font-display font-bold text-4xl opacity-30"
          >
            ✦
          </span>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({
  section,
  palette,
  isHighlighted,
  editingField,
  index,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sectionRef,
}: SectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`px-8 py-16 transition-all ${isHighlighted ? "ring-2 ring-inset ring-primary/40" : ""}`}
      style={{ background: `${palette.secondary}15`, color: palette.text }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <EditableText
            as="h2"
            value={section.heading}
            className="text-3xl font-bold font-display mb-3"
            isEditing={
              editingField?.sectionIndex === index &&
              editingField.field === "heading"
            }
            onStartEdit={() =>
              onStartEdit({
                sectionIndex: index,
                field: "heading",
                originalValue: section.heading,
              })
            }
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
          <EditableText
            as="p"
            value={section.body}
            className="text-base opacity-70 max-w-xl mx-auto"
            isEditing={
              editingField?.sectionIndex === index &&
              editingField.field === "body"
            }
            onStartEdit={() =>
              onStartEdit({
                sectionIndex: index,
                field: "body",
                originalValue: section.body,
              })
            }
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(
            section.items ?? [
              { title: "Speed", description: "Deploy in minutes, not weeks" },
              {
                title: "Design",
                description: "AI-generated layouts that impress",
              },
              {
                title: "Scale",
                description: "Built to grow with your business",
              },
            ]
          ).map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-6 border"
              style={{
                background: palette.background,
                borderColor: `${palette.secondary}40`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-sm"
                style={{
                  background: `${palette.primary}20`,
                  color: palette.primary,
                }}
              >
                ✦
              </div>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: palette.text }}
              >
                {item.title}
              </h3>
              <p className="text-xs opacity-60" style={{ color: palette.text }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  section,
  palette,
  isHighlighted,
  editingField,
  index,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sectionRef,
}: SectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`px-8 py-16 transition-all ${isHighlighted ? "ring-2 ring-inset ring-primary/40" : ""}`}
      style={{ background: palette.background, color: palette.text }}
    >
      <div className="max-w-lg mx-auto text-center">
        <EditableText
          as="h2"
          value={section.heading}
          className="text-3xl font-bold font-display mb-3"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "heading"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "heading",
              originalValue: section.heading,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        <EditableText
          as="p"
          value={section.body}
          className="text-sm opacity-70 mb-8"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "body"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "body",
              originalValue: section.body,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        <form
          className="flex flex-col gap-3 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-medium mb-1"
              style={{ color: palette.text }}
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{
                background: `${palette.secondary}10`,
                borderColor: `${palette.secondary}30`,
                color: palette.text,
              }}
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-medium mb-1"
              style={{ color: palette.text }}
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{
                background: `${palette.secondary}10`,
                borderColor: `${palette.secondary}30`,
                color: palette.text,
              }}
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-medium mb-1"
              style={{ color: palette.text }}
            >
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="Your message"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none"
              style={{
                background: `${palette.secondary}10`,
                borderColor: `${palette.secondary}30`,
                color: palette.text,
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: palette.primary, color: palette.background }}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

function GenericSection({
  section,
  palette,
  isHighlighted,
  editingField,
  index,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sectionRef,
}: SectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`px-8 py-16 transition-all ${isHighlighted ? "ring-2 ring-inset ring-primary/40" : ""}`}
      style={{ background: palette.background, color: palette.text }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <EditableText
          as="h2"
          value={section.heading}
          className="text-3xl font-bold font-display mb-4"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "heading"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "heading",
              originalValue: section.heading,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
        <EditableText
          as="p"
          value={section.body}
          className="text-base opacity-70 leading-relaxed"
          isEditing={
            editingField?.sectionIndex === index &&
            editingField.field === "body"
          }
          onStartEdit={() =>
            onStartEdit({
              sectionIndex: index,
              field: "body",
              originalValue: section.body,
            })
          }
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </section>
  );
}

function FooterSection({ palette }: { palette: ColorPalette }) {
  return (
    <footer
      className="px-8 py-8"
      style={{ background: `${palette.text}10`, color: palette.text }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-sm opacity-80">
          YourBrand
        </span>
        <nav className="flex items-center gap-6">
          {["Home", "About", "Services", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-xs opacity-60 hover:opacity-100 transition-all"
              style={{ color: palette.text }}
            >
              {link}
            </a>
          ))}
        </nav>
        <span className="text-xs opacity-40">
          &copy; {new Date().getFullYear()}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default function SitePreview({
  generatedData,
  editingField,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  highlightedSection,
  sectionRefs,
}: SitePreviewProps) {
  const { sections, colorPalette, siteTitle } = generatedData;
  const style = getStyle(colorPalette);

  const setSectionRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      sectionRefs.current[key] = el;
    },
    [sectionRefs],
  );

  const renderSection = (section: SiteSection, index: number) => {
    const key = `${section.type}-${index}`;
    const isHighlighted = highlightedSection === key;
    const commonProps: SectionProps = {
      section,
      index,
      palette: colorPalette,
      isHighlighted,
      editingField,
      onStartEdit,
      onSaveEdit,
      onCancelEdit,
      sectionRef: setSectionRef(key),
    };

    switch (section.type) {
      case "hero":
        return <HeroSection key={key} {...commonProps} />;
      case "about":
        return <AboutSection key={key} {...commonProps} />;
      case "features":
        return <FeaturesSection key={key} {...commonProps} />;
      case "contact":
        return <ContactSection key={key} {...commonProps} />;
      default:
        return <GenericSection key={key} {...commonProps} />;
    }
  };

  return (
    <div
      style={{
        ...style,
        background: colorPalette.background,
        fontFamily: "inherit",
      }}
    >
      {/* Site nav */}
      <nav
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b"
        style={{
          background: `${colorPalette.background}ee`,
          borderColor: `${colorPalette.secondary}30`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          className="font-display font-bold text-sm"
          style={{ color: colorPalette.text }}
        >
          {siteTitle}
        </span>
        <div className="flex items-center gap-6">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs hover:opacity-100 transition-all"
              style={{ color: colorPalette.text, opacity: 0.6 }}
            >
              {item}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
          style={{
            background: colorPalette.primary,
            color: colorPalette.background,
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Sections */}
      {sections.map((section, index) => renderSection(section, index))}

      <FooterSection palette={colorPalette} />
    </div>
  );
}
