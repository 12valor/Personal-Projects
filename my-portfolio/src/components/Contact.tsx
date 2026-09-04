"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Facebook,
  Github,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollReveal } from "./ScrollReveal";

const email = "evangelista.agdiaz@gmail.com";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/ag.evangelistaii",
    icon: Facebook,
  },
  { name: "GitHub", url: "https://github.com/12valor", icon: Github },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) throw new Error("Failed to send inquiry");

      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      window.setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative border-t border-border bg-background px-4 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <ScrollReveal className="flex flex-col justify-between gap-14 py-2">
          <div className="flex flex-col gap-6">
            <h2 className="max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-foreground sm:text-6xl md:text-8xl">
              Have an idea?
              <span className="block text-muted-foreground">Let&apos;s build it.</span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Tell me what you are making, where it needs to go, and what a good
              result looks like. I will help shape the rest.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Email
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="group flex w-fit max-w-full items-center gap-3 text-left"
              >
                <span className="break-all text-xl font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline sm:text-2xl md:text-3xl">
                  {email}
                </span>
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    Copied to clipboard.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button key={social.name} asChild variant="outline" size="icon">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                      <Icon aria-hidden="true" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Card className="rounded-2xl border-border/80 bg-card shadow-sm">
            <CardHeader className="gap-2 p-6 md:p-8">
              <CardTitle className="text-2xl tracking-tight md:text-3xl">Start a conversation</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A few details are enough. I usually reply as soon as I can.
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-5">
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="rounded-xl border-border/80 bg-background/50 px-4 py-3"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="rounded-xl border-border/80 bg-background/50 px-4 py-3"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="What are we creating?"
                      required
                      rows={4}
                      className="rounded-xl border-border/80 bg-background/50 p-4"
                    />
                  </Field>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full gap-2 rounded-xl text-base font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send inquiry</span>
                        <ArrowUpRight />
                      </>
                    )}
                  </Button>

                  {(isSubmitted || errorMsg) && (
                    <Alert variant={errorMsg ? "destructive" : "default"}>
                      <AlertDescription>
                        {errorMsg || "Thanks! I will be in touch soon."}
                      </AlertDescription>
                    </Alert>
                  )}
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
