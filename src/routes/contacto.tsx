import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { SectionKicker } from "@/components/section-kicker";
import { CONTACT_EMAIL } from "@/lib/plans";

export const Route = createFileRoute("/contacto")({ component: ContactoPage });

function ContactoPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionKicker code="09" label="Contacto" />
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.05em]">Escríbenos.</h1>
        <p className="mt-4 max-w-md text-muted">
          Cada envío entra a la cola de VantBot y a {CONTACT_EMAIL}. Sin copia en el navegador.
        </p>
      </div>
      <ContactForm source="contacto" />
    </main>
  );
}
