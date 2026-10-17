import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Check,
	Eye,
	EyeOff,
	Lock,
	Mail,
	ShieldCheck,
	Sparkles,
	User,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/demo/better-auth")({
	component: AuthPage,
});

function passwordStrength(pw: string) {
	let score = 0;
	if (pw.length >= 8) score++;
	if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
	if (/\d/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw)) score++;
	return score; // 0..4
}

const STRENGTH_LABEL = ["Terlalu pendek", "Lemah", "Cukup", "Kuat", "Sangat kuat"];

function AuthPage() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [showPw, setShowPw] = useState(false);
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
			} else {
				const result = await authClient.signIn.email({ email, password });
				if (result.error) setError(result.error.message || "Email atau password salah");
			}
		} catch {
			setError("Terjadi kesalahan. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
	};

	if (isPending || session?.user) {
		return (
			<main className="auth-shell items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--line)] border-t-[var(--lagoon-deep)]" />
			</main>
		);
	}

	const strength = passwordStrength(password);

	return (
		<main className="auth-shell">
			{/* ===== Panel kiri: branding ===== */}
			<aside className="auth-brand">
				<div className="auth-orb auth-orb-a" />
				<div className="auth-orb auth-orb-b" />
				<div className="auth-orb auth-orb-c" />

				<div className="relative z-10 flex h-full flex-col justify-between gap-10">
					<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
						<Sparkles className="size-4" />
						Ekraf Dashboard
					</div>

					<div className="rise-in">
						<h1 className="display-title text-4xl font-bold leading-tight sm:text-5xl">
							Kelola ekonomi kreatif
							<br />
							dengan lebih mudah.
						</h1>
						<p className="mt-4 max-w-md text-base leading-7 text-white/80">
							Pantau produk, atur pengguna, dan lihat ringkasan bisnismu dalam satu dashboard yang
							rapi dan aman.
						</p>

						<ul className="mt-8 grid gap-3 text-sm font-medium">
							{[
								{ icon: BarChart3, text: "Ringkasan data real-time" },
								{ icon: Users, text: "Manajemen pengguna & peran" },
								{ icon: ShieldCheck, text: "Autentikasi aman dengan Better Auth" },
							].map(({ icon: Icon, text }) => (
								<li key={text} className="flex items-center gap-3">
									<span className="grid size-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
										<Icon className="size-4.5" />
									</span>
									{text}
								</li>
							))}
						</ul>
					</div>

					<p className="text-xs text-white/60">© {new Date().getFullYear()} Martha Saulina Nababan</p>
				</div>
			</aside>

			{/* ===== Panel kanan: form ===== */}
			<section className="auth-form-side">
				<div className="auth-card rise-in">
					<p className="island-kicker mb-2">{isSignUp ? "Daftar" : "Masuk"}</p>
					<h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
						{isSignUp ? "Buat akun baru" : "Selamat datang kembali"}
					</h2>
					<p className="mt-2 mb-6 text-sm text-[var(--sea-ink-soft)]">
						{isSignUp
							? "Isi data di bawah untuk mulai menggunakan dashboard."
							: "Masuk dengan email dan password untuk melanjutkan."}
					</p>

					{/* Tab Masuk / Daftar */}
					<div className="auth-tabs" role="tablist">
						<button
							type="button"
							role="tab"
							aria-selected={!isSignUp}
							className={!isSignUp ? "is-active" : ""}
							onClick={() => {
								setIsSignUp(false);
								setError("");
							}}
						>
							Masuk
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={isSignUp}
							className={isSignUp ? "is-active" : ""}
							onClick={() => {
								setIsSignUp(true);
								setError("");
							}}
						>
							Daftar
						</button>
					</div>

					<form onSubmit={handleSubmit} className="mt-6 grid gap-4">
						{isSignUp && (
							<Field label="Nama lengkap" htmlFor="name" icon={User}>
								<input
									id="name"
									type="text"
									autoComplete="name"
									placeholder="Nama kamu"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="auth-input"
									required
								/>
							</Field>
						)}

						<Field label="Email" htmlFor="email" icon={Mail}>
							<input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="nama@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="auth-input"
								required
							/>
						</Field>

						<Field label="Password" htmlFor="password" icon={Lock}>
							<input
								id="password"
								type={showPw ? "text" : "password"}
								autoComplete={isSignUp ? "new-password" : "current-password"}
								placeholder="Minimal 8 karakter"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="auth-input pr-11"
								required
								minLength={8}
							/>
							<button
								type="button"
								onClick={() => setShowPw((v) => !v)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
								aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
							>
								{showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</button>
						</Field>

						{isSignUp && password.length > 0 && (
							<div className="-mt-1">
								<div className="flex gap-1.5">
									{[1, 2, 3, 4].map((i) => (
										<span
											key={i}
											className={`h-1.5 flex-1 rounded-full transition-colors ${
												strength >= i
													? strength <= 1
														? "bg-red-400"
														: strength === 2
															? "bg-amber-400"
															: "bg-emerald-500"
													: "bg-[var(--line)]"
											}`}
										/>
									))}
								</div>
								<p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--sea-ink-soft)]">
									{strength >= 3 && <Check className="size-3 text-emerald-600" />}
									Kekuatan password: {STRENGTH_LABEL[strength]}
								</p>
							</div>
						)}

						{error && (
							<div
								role="alert"
								className="rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-300"
							>
								{error}
							</div>
						)}

						<button type="submit" disabled={loading} className="auth-submit">
							{loading ? (
								<>
									<span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
									Mohon tunggu…
								</>
							) : (
								<>
									{isSignUp ? "Buat akun" : "Masuk"}
									<ArrowRight className="size-4" />
								</>
							)}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
						{isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
						<button
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp);
								setError("");
							}}
							className="font-semibold text-[var(--lagoon-deep)] underline-offset-4 hover:underline"
						>
							{isSignUp ? "Masuk di sini" : "Daftar sekarang"}
						</button>
					</p>
				</div>
			</section>
		</main>
	);
}

function Field({
	label,
	htmlFor,
	icon: Icon,
	children,
}: {
	label: string;
	htmlFor: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-1.5">
			<label htmlFor={htmlFor} className="text-sm font-semibold text-[var(--sea-ink)]">
				{label}
			</label>
			<div className="relative">
				<Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
				{children}
			</div>
		</div>
	);
}
