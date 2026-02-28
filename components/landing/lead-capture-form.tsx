"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LeadCaptureFormProps = {
  source: string;
  title: string;
  description: string;
  whatsappHref: string;
  compact?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
};

type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const EMPTY_VALUES: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export function LeadCaptureForm({
  source,
  title,
  description,
  whatsappHref,
  compact = false,
  submitLabel = "Solicitar contacto",
  defaultMessage = "Quiero información del Proyecto Urb. Santa Beatriz.",
}: LeadCaptureFormProps) {
  const [values, setValues] = useState<LeadFormValues>({
    ...EMPTY_VALUES,
    message: defaultMessage,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!values.name.trim() || !values.phone.trim() || !values.message.trim()) {
      setError("Completa nombre, teléfono y mensaje.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
          message: values.message,
          source,
        }),
      });

      const responseData = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(responseData?.error ?? "No se pudo enviar tu solicitud.");
        return;
      }

      setSuccess("Solicitud enviada. Te contactaremos pronto.");
      setValues({
        ...EMPTY_VALUES,
        message: defaultMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={`Formulario ${source}`}>
      <div>
        <h3 className={compact ? "text-lg font-semibold" : "text-2xl font-semibold"}>{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${source}-name`} className="text-sm font-medium">
          Nombre
        </label>
        <Input
          id={`${source}-name`}
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${source}-phone`} className="text-sm font-medium">
          Teléfono
        </label>
        <Input
          id={`${source}-phone`}
          value={values.phone}
          onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
          placeholder="990 814 630"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${source}-email`} className="text-sm font-medium">
          Correo (opcional)
        </label>
        <Input
          id={`${source}-email`}
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="tu-correo@dominio.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${source}-message`} className="text-sm font-medium">
          Mensaje
        </label>
        <Textarea
          id={`${source}-message`}
          value={values.message}
          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
          placeholder="Cuéntanos tu consulta"
          required
          className={compact ? "min-h-24" : "min-h-28"}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting} aria-label="Enviar formulario de contacto">
          {isSubmitting ? "Enviando..." : submitLabel}
        </Button>
        <Button asChild variant="secondary">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">
            WhatsApp
          </a>
        </Button>
      </div>
    </form>
  );
}
