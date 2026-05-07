import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
  useEffect,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { auth } from "@/lib/store";

import {
  Wallet,
  Sparkles,
} from "lucide-react";

export const Route =
  createFileRoute(
    "/auth"
  )({
    head: () => ({
      meta: [
        {
          title:
            "Sign in — FinFlow Pro",
        },

        {
          name:
            "description",

          content:
            "Sign in or create your FinFlow Pro account.",
        },
      ],
    }),

    component: AuthPage,
  });

function AuthPage() {
  const navigate =
    useNavigate();

  const [mode, setMode] =
    useState<
      "login" | "signup"
    >("login");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [err, setErr] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  useEffect(() => {
    if (auth.current())
      navigate({ to: "/" });
  }, [navigate]);

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setErr("");

    try {
      if (
        mode === "login"
      ) {
        await auth.login(
          email,
          password
        );
      } else {
        await auth.signup(
          email,
          password,
          name ||
            email.split(
              "@"
            )[0]
        );
      }

      window.location.href =
        "/";
    } catch (e) {
      setErr(
        (e as Error).message
      );
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 font-semibold text-lg z-10">
          <span className="grid place-items-center size-9 rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </span>

          FinFlow{" "}

          <span className="text-primary">
            Pro
          </span>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-5">
            <Sparkles className="size-3 text-primary" />

            Smarter money
            decisions
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Your money,
            <br />

            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              beautifully
              tracked.
            </span>
          </h1>

          <p className="mt-4 text-muted-foreground max-w-md">
            Multiple
            accounts,
            category
            insights, and
            exportable
            reports — all
            in one elegant
            dashboard.
          </p>
        </motion.div>

        <div className="text-xs text-muted-foreground z-10">
          © FinFlow Pro
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="glass rounded-3xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold">
            {mode ===
            "login"
              ? "Welcome back"
              : "Create account"}
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            {mode ===
            "login"
              ? "Sign in to continue"
              : "Start tracking in under a minute"}
          </p>

          <form
            onSubmit={submit}
            className="mt-6 space-y-4"
          >
            <AnimatePresence>
              {mode ===
                "signup" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height:
                      "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label>
                    Name
                  </Label>

                  <Input
                    value={
                      name
                    }
                    onChange={(
                      e
                    ) =>
                      setName(
                        e.target
                          .value
                      )
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label>
                Email
              </Label>

              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Password
              </Label>

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    password
                  }
                  onChange={(e) =>
                    setPassword(
                      e.target
                        .value
                    )
                  }
                  required
                />

                <span
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer text-muted-foreground"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </span>
              </div>
            </div>

            {err && (
              <p className="text-sm text-destructive">
                {err}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              {mode ===
              "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>

            <button
              type="button"
              className="text-sm text-primary hover:underline mt-2 w-full"
            >
              Forgot
              Password?
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            {mode ===
            "login"
              ? "No account?"
              : "Already have one?"}{" "}

            <button
              className="text-primary hover:underline"
              onClick={() =>
                setMode(
                  mode ===
                    "login"
                    ? "signup"
                    : "login"
                )
              }
            >
              {mode ===
              "login"
                ? "Sign up"
                : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}