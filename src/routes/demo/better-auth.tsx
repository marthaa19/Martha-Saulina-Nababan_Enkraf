import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/demo/better-auth")({
	component: AuthPage,
});

const labelClass = "text-sm font-semibold text-[var(--sea-ink)]";

const inputClass =
	"h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3.5 text-sm text-[var(--sea-ink)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/25";

function AuthPage() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();
	const [isSignUp, setIsSignUp] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Setelah login / register berhasil, langsung arahkan ke dashboard.
	useEffect(() => {
		if (session?.user) {
			void navigate({ to: "/dashboard" });
		}
	}, [session?.user, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isSignUp) {
				const result = await authClient.signUp.email({ email, password, name });
				if (result.error) setError(result.error.message || "Pendaftaran gagal");
				else window.location.assign("/dashboard");
			} else {
				const result = await authClient.signIn.email({ email, password });
				if (result.error) setError(result.error.message || "Email atau kata sandi salah");
				else window.location.assign("/dashboard");
			}
		} catch {
			setError("Terjadi kesalahan. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
	};

	if (isPending || session?.user) {
		return (
			<main className="grid min-h-[calc(100vh-73px)] place-items-center">
				<div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--line)] border-t-[var(--lagoon-deep)]" />
			</main>
		);
	}

	return (
		<main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-10">
			<div className="w-full max-w-[400px] rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-7 shadow-[0_18px_40px_rgba(23,58,64,0.10)]">
				<h1 className="m-0 mb-5 text-2xl font-bold text-[var(--sea-ink)]">
					{isSignUp ? "Daftar" : "Masuk"}
				</h1>

				<form onSubmit={handleSubmit} className="grid gap-4">
					{isSignUp && (
						<div className="grid gap-1.5">
							<label htmlFor="name" className={labelClass}>
								Nama
							</label>
							<input
								id="name"
								type="text"
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className={inputClass}
								required
							/>
						</div>
					)}

					<div className="grid gap-1.5">
						<label htmlFor="email" className={labelClass}>
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={inputClass}
							required
						/>
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="password" className={labelClass}>
							Kata Sandi
						</label>
						<input
							id="password"
							type="password"
							autoComplete={isSignUp ? "new-password" : "current-password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={inputClass}
							required
							minLength={8}
						/>
					</div>

					{error && (
						<div
							role="alert"
							className="rounded-lg border border-red-300/60 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-300"
						>
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="mt-1 h-11 w-full cursor-pointer rounded-lg bg-[var(--lagoon-deep)] text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#0a1418]"
					>
						{loading ? "Mohon tunggu…" : isSignUp ? "Daftar" : "Masuk"}
					</button>
				</form>

				<p className="m-0 mt-5 text-center text-sm text-[var(--sea-ink-soft)]">
					{isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
					<button
						type="button"
						onClick={() => {
							setIsSignUp(!isSignUp);
							setError("");
						}}
						className="cursor-pointer border-0 bg-transparent p-0 text-sm font-bold text-[var(--lagoon-deep)] hover:underline"
					>
						{isSignUp ? "Masuk" : "Daftar"}
					</button>
				</p>
			</div>
		</main>
	);
}
