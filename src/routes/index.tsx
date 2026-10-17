import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, LogIn, MapPin, Package, Users } from "lucide-react";

import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { data: session, isPending } = authClient.useSession();
	const signedIn = !!session?.user;

	return (
		<main className="page-wrap px-4 py-8 sm:py-10">
			<section className="dash-hero rise-in">
				<div className="relative z-10 max-w-2xl">
					<p className="m-0 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
						<MapPin className="size-3.5" />
						Tanah Batak, Sumatera Utara
					</p>
					<h1 className="display-title mt-4 text-4xl font-bold leading-tight sm:text-6xl">
						Horas! Selamat datang di <span className="text-[#bff3e6]">Ekraf Toba</span>
					</h1>
					<p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
						Dashboard untuk mengenal Danau Toba dan mengelola produk ekonomi kreatif lokal — dari
						kain ulos sampai kuliner khas Batak.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						{isPending ? null : signedIn ? (
							<Link to="/dashboard" className="dash-hero-btn dash-hero-btn-solid gap-2">
								<LayoutDashboard className="size-4" />
								Buka dashboard
							</Link>
						) : (
							<Link to="/demo/better-auth" className="dash-hero-btn dash-hero-btn-solid gap-2">
								<LogIn className="size-4" />
								Masuk / Daftar
							</Link>
						)}
						<Link to="/about" className="dash-hero-btn gap-2">
							Tentang proyek <ArrowRight className="size-4" />
						</Link>
					</div>
				</div>

				<svg
					aria-hidden="true"
					viewBox="0 0 1200 220"
					preserveAspectRatio="none"
					className="absolute inset-x-0 bottom-0 h-28 w-full sm:h-40"
				>
					<path
						d="M0 150 L140 70 L240 130 L380 40 L520 140 L640 90 L780 150 L900 60 L1040 130 L1200 80 V220 H0Z"
						fill="rgba(255,255,255,0.10)"
					/>
					<path
						d="M0 180 L160 110 L300 165 L460 95 L620 170 L760 120 L920 175 L1080 115 L1200 160 V220 H0Z"
						fill="rgba(255,255,255,0.14)"
					/>
					<path
						d="M0 205 Q150 185 300 205 T600 205 T900 205 T1200 205 V220 H0Z"
						fill="rgba(191,243,230,0.35)"
					/>
				</svg>
				<div className="auth-orb auth-orb-a opacity-60" />
			</section>

			<section className="mt-6 grid gap-4 sm:grid-cols-3">
				{[
					{
						icon: MapPin,
						title: "Kenali wilayah",
						text: "Pesona alam, budaya, kerajinan, dan kuliner khas Danau Toba.",
					},
					{
						icon: Package,
						title: "Kelola produk",
						text: "Tambah, ubah, dan hapus produk kreatif lokal dengan mudah.",
					},
					{
						icon: Users,
						title: "Atur pengguna",
						text: "Kelola akun dan peran dengan autentikasi yang aman.",
					},
				].map(({ icon: Icon, title, text }, i) => (
					<div
						key={title}
						className="dash-panel dash-stat rise-in"
						style={{ animationDelay: `${i * 70}ms` }}
					>
						<span className="grid size-11 place-items-center rounded-xl bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)]">
							<Icon className="size-5" />
						</span>
						<h3 className="m-0 mt-4 text-base font-bold text-[var(--sea-ink)]">{title}</h3>
						<p className="m-0 mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">{text}</p>
					</div>
				))}
			</section>

			{!signedIn && !isPending && (
				<p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
					Pertama kali menjalankan aplikasi?{" "}
					<Link
						to="/setup"
						className="font-semibold text-[var(--lagoon-deep)] underline underline-offset-4"
					>
						Buat akun admin &amp; data contoh
					</Link>
				</p>
			)}
		</main>
	);
}
