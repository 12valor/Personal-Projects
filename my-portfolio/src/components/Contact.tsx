"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Facebook,
  Github,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollReveal } from "./ScrollReveal";
import { submitContactAction, initialContactState } from "../app/contact-actions";
import { Magnetic } from "./ui/Magnetic";

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
  const [resetKey, setResetKey] = useState(0);

  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialContactState
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleResetForm = () => {
    setResetKey((k) => k + 1);
  };

  const isSuccess = state.success && resetKey === 0;

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
                  <Magnetic key={social.name} strength={0.3}>
                    <Button asChild variant="outline" size="icon" className="rounded-full">
                      <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                        <Icon aria-hidden="true" />
                      </a>
                    </Button>
                  </Magnetic>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Card className="relative overflow-hidden rounded-2xl border-border/80 bg-card shadow-sm">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center p-8 md:p-14 text-center min-h-[460px] space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      Inquiry Sent
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {state.message || "Thank you for reaching out. I will review your project and get back to you promptly."}
                    </p>
                  </div>

                  <Magnetic strength={0.3}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                      className="rounded-xl gap-2 mt-4 px-6"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Send another message</span>
                    </Button>
                  </Magnetic>
                </motion.div>
              ) : (
                <motion.div
                  key={`form-${resetKey}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <CardHeader className="gap-2 p-6 md:p-8">
                    <CardTitle className="text-2xl tracking-tight md:text-3xl">
                      Start a conversation
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A few details are enough. I usually reply as soon as I can.
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
                    <form action={formAction}>
                      <FieldGroup className="gap-5">
                        <Field>
                          <FieldLabel htmlFor="name">Name</FieldLabel>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={state.values?.name || ""}
                            placeholder="Your name"
                            required
                            disabled={isPending}
                            className="rounded-xl border-border/80 bg-background/50 px-4 py-3"
                          />
                          {state.errors?.name && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                              {state.errors.name[0]}
                            </p>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={state.values?.email || ""}
                            placeholder="you@example.com"
                            required
                            disabled={isPending}
                            className="rounded-xl border-border/80 bg-background/50 px-4 py-3"
                          />
                          {state.errors?.email && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                              {state.errors.email[0]}
                            </p>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="message">Message</FieldLabel>
                          <Textarea
                            id="message"
                            name="message"
                            defaultValue={state.values?.message || ""}
                            placeholder="What are we creating?"
                            required
                            disabled={isPending}
                            rows={4}
                            className="rounded-xl border-border/80 bg-background/50 p-4"
                          />
                          {state.errors?.message && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                              {state.errors.message[0]}
                            </p>
                          )}
                        </Field>

                        <Magnetic strength={0.2} className="w-full">
                          <Button
                            type="submit"
                            disabled={isPending}
                            size="lg"
                            className="w-full gap-2 rounded-xl text-base font-medium cursor-pointer"
                          >
                            {isPending ? (
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
                        </Magnetic>

                        {state.errors?._form && (
                          <Alert variant="destructive">
                            <AlertDescription>
                              {state.errors._form[0]}
                            </AlertDescription>
                          </Alert>
                        )}
                      </FieldGroup>
                    </form>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
