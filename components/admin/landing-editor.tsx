"use client";

import { Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { landingDraftPayloadSchema } from "@/lib/content/schemas";
import type { LandingDraftPayload, LandingPageRecord } from "@/lib/content/types";

const EMPTY_HERO = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaHref: "",
  imageUrl: "",
};

const EMPTY_HEADER_MENU_ITEM = {
  label: "",
  href: "",
};

const EMPTY_FEATURE = {
  title: "",
  description: "",
  iconKey: "",
};

const EMPTY_FAQ = {
  question: "",
  answer: "",
};

type LandingEditorProps = {
  initialLanding: Omit<LandingPageRecord, "updatedAt"> & { updatedAt: string };
};

export function LandingEditor({ initialLanding }: LandingEditorProps) {
  const [payload, setPayload] = useState<LandingDraftPayload>({
    data: initialLanding.data,
    seo: initialLanding.seo,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingHeroIndex, setUploadingHeroIndex] = useState<number | null>(null);
  const [heroUploadFiles, setHeroUploadFiles] = useState<Record<number, File | null>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updatedByLabel = useMemo(() => {
    if (!initialLanding.updatedBy?.email) {
      return "Sin editor registrado";
    }

    return `Última edición por ${initialLanding.updatedBy.email}`;
  }, [initialLanding.updatedBy?.email]);

  function updatePayload(next: LandingDraftPayload) {
    setPayload(next);
    setMessage(null);
    setError(null);
  }

  function validateLocalPayload(): LandingDraftPayload | null {
    const parsed = landingDraftPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Revisa los campos requeridos antes de guardar.");
      return null;
    }

    return parsed.data;
  }

  async function saveDraft(nextPayload?: LandingDraftPayload) {
    const validPayload = nextPayload ?? validateLocalPayload();
    if (!validPayload) {
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/landing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validPayload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "No se pudo guardar el borrador");
        return false;
      }

      setMessage("Borrador guardado correctamente");
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  async function onPublish() {
    const validPayload = validateLocalPayload();
    if (!validPayload) {
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const saved = await saveDraft(validPayload);
      if (!saved) {
        return;
      }

      const response = await fetch("/api/admin/publish", {
        method: "POST",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "No se pudo publicar");
        return;
      }

      setMessage("Contenido publicado y landing actualizada");
    } finally {
      setIsPublishing(false);
    }
  }

  async function uploadHeroImage(index: number) {
    const file = heroUploadFiles[index];
    if (!file) {
      setError("Selecciona una imagen antes de subir.");
      return;
    }

    setUploadingHeroIndex(index);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "hero");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; file?: { url: string } }
        | null;

      if (!response.ok || !data?.file?.url) {
        setError(data?.error ?? "No se pudo subir la imagen");
        return;
      }

      setPayload((current) => ({
        ...current,
        data: {
          ...current.data,
          heroSlider: current.data.heroSlider.map((item, itemIndex) =>
            itemIndex === index ? { ...item, imageUrl: data.file?.url } : item,
          ),
        },
      }));
      setHeroUploadFiles((current) => ({
        ...current,
        [index]: null,
      }));
      setMessage("Imagen optimizada y cargada correctamente.");
    } finally {
      setUploadingHeroIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Editor de Landing</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{updatedByLabel}</Badge>
              <Badge variant="outline">
                Actualizado: {new Date(initialLanding.updatedAt).toLocaleString("es-PE")}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void saveDraft()} disabled={isSaving || isPublishing || uploadingHeroIndex !== null}>
              {isSaving ? "Guardando..." : "Guardar borrador"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void onPublish()}
              disabled={isSaving || isPublishing || uploadingHeroIndex !== null}
            >
              {isPublishing ? "Publicando..." : "Publicar"}
            </Button>
          </div>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardHeader>
      </Card>

      <Accordion
        type="multiple"
        defaultValue={["header", "hero", "features", "faq", "contact", "seo"]}
      >
        <AccordionItem value="header">
          <AccordionTrigger>Cabecera (Menú y CTA)</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Input
                  placeholder="Texto de marca"
                  value={payload.data.header.brandText}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      data: {
                        ...payload.data,
                        header: {
                          ...payload.data.header,
                          brandText: event.target.value,
                        },
                      },
                    });
                  }}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Texto CTA principal"
                    value={payload.data.header.primaryCtaText}
                    onChange={(event) => {
                      updatePayload({
                        ...payload,
                        data: {
                          ...payload.data,
                          header: {
                            ...payload.data.header,
                            primaryCtaText: event.target.value,
                          },
                        },
                      });
                    }}
                  />
                  <Input
                    placeholder="Enlace CTA principal"
                    value={payload.data.header.primaryCtaHref}
                    onChange={(event) => {
                      updatePayload({
                        ...payload,
                        data: {
                          ...payload.data,
                          header: {
                            ...payload.data.header,
                            primaryCtaHref: event.target.value,
                          },
                        },
                      });
                    }}
                  />
                  <Input
                    placeholder="Texto CTA secundario"
                    value={payload.data.header.secondaryCtaText}
                    onChange={(event) => {
                      updatePayload({
                        ...payload,
                        data: {
                          ...payload.data,
                          header: {
                            ...payload.data.header,
                            secondaryCtaText: event.target.value,
                          },
                        },
                      });
                    }}
                  />
                  <Input
                    placeholder="Enlace CTA secundario"
                    value={payload.data.header.secondaryCtaHref}
                    onChange={(event) => {
                      updatePayload({
                        ...payload,
                        data: {
                          ...payload.data,
                          header: {
                            ...payload.data.header,
                            secondaryCtaHref: event.target.value,
                          },
                        },
                      });
                    }}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">Items del menú</p>
                  {payload.data.header.menu.map((item, index) => (
                    <Card key={`menu-item-${index}`}>
                      <CardContent className="grid gap-3 pt-6 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                        <Input
                          placeholder="Label"
                          value={item.label}
                          onChange={(event) => {
                            const menu = payload.data.header.menu.map((menuItem, menuIndex) =>
                              menuIndex === index
                                ? { ...menuItem, label: event.target.value }
                                : menuItem,
                            );

                            updatePayload({
                              ...payload,
                              data: {
                                ...payload.data,
                                header: {
                                  ...payload.data.header,
                                  menu,
                                },
                              },
                            });
                          }}
                        />
                        <Input
                          placeholder="Href (ej: #beneficios o https://...)"
                          value={item.href}
                          onChange={(event) => {
                            const menu = payload.data.header.menu.map((menuItem, menuIndex) =>
                              menuIndex === index ? { ...menuItem, href: event.target.value } : menuItem,
                            );

                            updatePayload({
                              ...payload,
                              data: {
                                ...payload.data,
                                header: {
                                  ...payload.data.header,
                                  menu,
                                },
                              },
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updatePayload({
                              ...payload,
                              data: {
                                ...payload.data,
                                header: {
                                  ...payload.data.header,
                                  menu: payload.data.header.menu.filter((_, menuIndex) => menuIndex !== index),
                                },
                              },
                            });
                          }}
                          disabled={payload.data.header.menu.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      updatePayload({
                        ...payload,
                        data: {
                          ...payload.data,
                          header: {
                            ...payload.data.header,
                            menu: [...payload.data.header.menu, EMPTY_HEADER_MENU_ITEM],
                          },
                        },
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar item de menú
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero">
          <AccordionTrigger>Hero Slider</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {payload.data.heroSlider.map((slide, index) => (
                <Card key={`hero-${index}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Slide {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updatePayload({
                          ...payload,
                          data: {
                            ...payload.data,
                            heroSlider: payload.data.heroSlider.filter((_, itemIndex) => itemIndex !== index),
                          },
                        });
                      }}
                      disabled={payload.data.heroSlider.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Título"
                      value={slide.title}
                      onChange={(event) => {
                        const heroSlider = payload.data.heroSlider.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, heroSlider },
                        });
                      }}
                    />
                    <Input
                      placeholder="Subtítulo"
                      value={slide.subtitle}
                      onChange={(event) => {
                        const heroSlider = payload.data.heroSlider.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, subtitle: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, heroSlider },
                        });
                      }}
                    />
                    <Input
                      placeholder="Texto CTA"
                      value={slide.ctaText}
                      onChange={(event) => {
                        const heroSlider = payload.data.heroSlider.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, ctaText: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, heroSlider },
                        });
                      }}
                    />
                    <Input
                      placeholder="Enlace CTA"
                      value={slide.ctaHref}
                      onChange={(event) => {
                        const heroSlider = payload.data.heroSlider.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, ctaHref: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, heroSlider },
                        });
                      }}
                    />
                    <div className="space-y-2 sm:col-span-2">
                      <Input
                        placeholder="URL de imagen (opcional)"
                        value={slide.imageUrl ?? ""}
                        onChange={(event) => {
                          const heroSlider = payload.data.heroSlider.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, imageUrl: event.target.value } : item,
                          );
                          updatePayload({
                            ...payload,
                            data: { ...payload.data, heroSlider },
                          });
                        }}
                      />
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={(event) => {
                            const selected = event.target.files?.[0] ?? null;
                            setHeroUploadFiles((current) => ({
                              ...current,
                              [index]: selected,
                            }));
                          }}
                          className="sm:max-w-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void uploadHeroImage(index)}
                          disabled={!heroUploadFiles[index] || uploadingHeroIndex !== null}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingHeroIndex === index ? "Subiendo..." : "Subir y optimizar"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formatos: JPG/PNG/WebP/AVIF. Máximo recomendado: 8MB.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  updatePayload({
                    ...payload,
                    data: {
                      ...payload.data,
                      heroSlider: [...payload.data.heroSlider, EMPTY_HERO],
                    },
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar slide
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {payload.data.features.map((feature, index) => (
                <Card key={`feature-${index}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Feature {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updatePayload({
                          ...payload,
                          data: {
                            ...payload.data,
                            features: payload.data.features.filter((_, itemIndex) => itemIndex !== index),
                          },
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Título"
                      value={feature.title}
                      onChange={(event) => {
                        const features = payload.data.features.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, features },
                        });
                      }}
                    />
                    <Textarea
                      placeholder="Descripción"
                      value={feature.description}
                      onChange={(event) => {
                        const features = payload.data.features.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, features },
                        });
                      }}
                    />
                    <Input
                      placeholder="iconKey (opcional)"
                      value={feature.iconKey ?? ""}
                      onChange={(event) => {
                        const features = payload.data.features.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, iconKey: event.target.value } : item,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, features },
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  updatePayload({
                    ...payload,
                    data: {
                      ...payload.data,
                      features: [...payload.data.features, EMPTY_FEATURE],
                    },
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar feature
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger>FAQ</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {payload.data.faq.map((item, index) => (
                <Card key={`faq-${index}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Pregunta {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updatePayload({
                          ...payload,
                          data: {
                            ...payload.data,
                            faq: payload.data.faq.filter((_, itemIndex) => itemIndex !== index),
                          },
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Pregunta"
                      value={item.question}
                      onChange={(event) => {
                        const faq = payload.data.faq.map((faqItem, itemIndex) =>
                          itemIndex === index ? { ...faqItem, question: event.target.value } : faqItem,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, faq },
                        });
                      }}
                    />
                    <Textarea
                      placeholder="Respuesta"
                      value={item.answer}
                      onChange={(event) => {
                        const faq = payload.data.faq.map((faqItem, itemIndex) =>
                          itemIndex === index ? { ...faqItem, answer: event.target.value } : faqItem,
                        );
                        updatePayload({
                          ...payload,
                          data: { ...payload.data, faq },
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  updatePayload({
                    ...payload,
                    data: {
                      ...payload.data,
                      faq: [...payload.data.faq, EMPTY_FAQ],
                    },
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar pregunta
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger>Contacto / Footer</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
                <Input
                  placeholder="Teléfono"
                  value={payload.data.contact.phone}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      data: {
                        ...payload.data,
                        contact: {
                          ...payload.data.contact,
                          phone: event.target.value,
                        },
                      },
                    });
                  }}
                />
                <Input
                  placeholder="WhatsApp URL"
                  value={payload.data.contact.whatsapp}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      data: {
                        ...payload.data,
                        contact: {
                          ...payload.data.contact,
                          whatsapp: event.target.value,
                        },
                      },
                    });
                  }}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={payload.data.contact.email}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      data: {
                        ...payload.data,
                        contact: {
                          ...payload.data.contact,
                          email: event.target.value,
                        },
                      },
                    });
                  }}
                />
                <Input
                  placeholder="Dirección"
                  value={payload.data.contact.address}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      data: {
                        ...payload.data,
                        contact: {
                          ...payload.data.contact,
                          address: event.target.value,
                        },
                      },
                    });
                  }}
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seo">
          <AccordionTrigger>SEO</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Input
                  placeholder="Title"
                  value={payload.seo.title}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      seo: {
                        ...payload.seo,
                        title: event.target.value,
                      },
                    });
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={payload.seo.description}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      seo: {
                        ...payload.seo,
                        description: event.target.value,
                      },
                    });
                  }}
                />
                <Input
                  placeholder="OG Title"
                  value={payload.seo.ogTitle}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      seo: {
                        ...payload.seo,
                        ogTitle: event.target.value,
                      },
                    });
                  }}
                />
                <Textarea
                  placeholder="OG Description"
                  value={payload.seo.ogDescription}
                  onChange={(event) => {
                    updatePayload({
                      ...payload,
                      seo: {
                        ...payload.seo,
                        ogDescription: event.target.value,
                      },
                    });
                  }}
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="flex gap-3">
        <Button
          onClick={() => void saveDraft()}
          disabled={isSaving || isPublishing || uploadingHeroIndex !== null}
        >
          {isSaving ? "Guardando..." : "Guardar borrador"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => void onPublish()}
          disabled={isSaving || isPublishing || uploadingHeroIndex !== null}
        >
          {isPublishing ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </div>
  );
}
