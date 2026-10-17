import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	Boxes,
	Landmark,
	MapPin,
	Mountain,
	Music,
	Package,
	Palette,
	ShieldCheck,
	Shirt,
	Users,
	Utensils,
	Waves,
} from "lucide-react";

import { authClient } from "#/lib/auth-client";
import { getProducts } from "@/lib/server/products";
import { getUsers } from "@/lib/server/users";

/* ==========================================================================
 * KONTEN WILAYAH — ganti isi objek ini untuk memperkenalkan wilayah lain.
 * ========================================================================== */
type Icon = React.ComponentType<{ className?: string }>;

const REGION = {
	name: "Danau Toba",
	subtitle: "Tanah Batak, Sumatera Utara",
	greeting: "Horas!",
	tagline:
		"Danau vulkanik terbesar di dunia, rumah bagi budaya Batak Toba yang kaya dan ekonomi kreatif yang terus tumbuh.",
	facts: [
		{ label: "Provinsi", value: "Sumatera Utara" },
		{ label: "Panjang danau", value: "± 100 km" },
		{ label: "Kedalaman maks.", value: "± 500 m" },
		{ label: "Status", value: "UNESCO Global Geopark" },
	],
	about: [
		"Danau Toba terbentuk dari letusan super vulkanik purba dan menjadi danau kaldera terbesar di dunia. Di tengahnya berdiri Pulau Samosir, pulau yang dikelilingi air danau.",
		"Di sekeliling danau hidup masyarakat Batak Toba dengan adat, musik, arsitektur, dan kerajinan yang masih terjaga — modal besar bagi pengembangan ekonomi kreatif (ekraf) daerah.",
	],
	highlights: [
		{
			icon: Mountain,
			title: "Wisata alam",
			tone: "teal",
			items: ["Danau Toba", "Pulau Samosir", "Air Terjun Sipiso-piso", "Bukit Holbung"],
		},
		{
			icon: Landmark,
			title: "Budaya & adat",
			tone: "amber",
			items: ["Rumah Bolon", "Tor-tor", "Gondang Sabangunan", "Huta Siallagan"],
		},
		{
			icon: Shirt,
			title: "Kerajinan",
			tone: "rose",
			items: ["Kain Ulos", "Ukiran Gorga", "Patung Sigale-gale", "Perhiasan perak"],
		},
		{
			icon: Utensils,
			title: "Kuliner khas",
			tone: "green",
			items: ["Arsik ikan mas", "Naniura", "Mi Gomak", "Kopi Sumatera"],
		},
	] as { icon: Icon; title: string; tone: keyof typeof TONES; items: string[] }[],
	ekraf: [
		{ icon: Palette, text: "Kriya & seni rupa" },
		{ icon: Music, text: "Musik & seni pertunjukan" },
		{ icon: Utensils, text: "Kuliner" },
		{ icon: Shirt, text: "Fesyen & tekstil" },
	] as { icon: Icon; text: string }[],
};

const TONES = {
	teal: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
	green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
	amber: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
	rose: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
	blue: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
} as const;

const money = (n: number) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function greeting() {
	const h = new Date().getHours();
	if (h < 11) return "Selamat pagi";
	if (h < 15) return "Selamat siang";
	if (h < 18) return "Selamat sore";
	return "Selamat malam";
}

export default function RegionDashboard({ signedIn }: { signedIn: boolean }) {
	const { data: session } = authClient.useSession();
	const productsQuery = useQuery({
		queryKey: ["dashboard", "products"],
		queryFn: async () => getProducts(),
		enabled: signedIn,
	});
	const usersQuery = useQuery({
		queryKey: ["dashboard", "users"],
		queryFn: async () => getUsers(),
		enabled: signedIn,
	});

	const products = productsQuery.data ?? [];
	const users = usersQuery.data ?? [];
	const totalStock = products.reduce((s, p) => s + p.stock, 0);
	const maxStock = Math.max(1, ...products.map((p) => p.stock));
	const firstName = session?.user?.name?.split(" ")[0] ?? "Pengunjung";
	const loading = signedIn && (productsQuery.isLoading || usersQuery.isLoading);

	return (
		<main className="page-wrap px-4 py-8 sm:py-10">
			{/* ===== Hero wilayah ===== */}
			<section className="dash-hero rise-in">
				<div className="relative z-10 max-w-2xl">
					<p className="m-0 text-sm font-semibold text-white/75">
						{greeting()}, {firstName} 👋
					</p>
					<p className="mt-4 mb-0 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
						<MapPin className="size-3.5" />
						{REGION.subtitle}
					</p>
					<h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">
						{REGION.greeting} <span className="text-[#bff3e6]">{REGION.name}</span>
					</h1>
					<p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">{REGION.tagline}</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<a href="#pesona" className="dash-hero-btn dash-hero-btn-solid">
							Jelajahi pesona
						</a>
						<Link to="/products" className="dash-hero-btn">
							Produk kreatif lokal
						</Link>
					</div>
				</div>

				{/* Ilustrasi pegunungan & air */}
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

			{/* ===== Fakta singkat ===== */}
			<section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
				{REGION.facts.map((f, i) => (
					<div
						key={f.label}
						className="dash-panel dash-stat rise-in"
						style={{ animationDelay: `${i * 60}ms` }}
					>
						<p className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--kicker)]">
							{f.label}
						</p>
						<p className="m-0 mt-2 text-lg font-extrabold leading-snug text-[var(--sea-ink)] sm:text-xl">
							{f.value}
						</p>
					</div>
				))}
			</section>

			{/* ===== Tentang ===== */}
			<section className="mt-6 grid gap-6 lg:grid-cols-5">
				<div className="dash-panel lg:col-span-3">
					<p className="island-kicker mb-2">Tentang wilayah</p>
					<h2 className="display-title m-0 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
						Mengenal {REGION.name}
					</h2>
					<div className="mt-4 grid gap-3 text-[var(--sea-ink-soft)]">
						{REGION.about.map((p) => (
							<p key={p} className="m-0 leading-7">
								{p}
							</p>
						))}
					</div>
				</div>

				<div className="dash-panel dash-water lg:col-span-2">
					<Waves className="size-8 opacity-90" />
					<h3 className="m-0 mt-3 text-lg font-bold">Subsektor ekraf unggulan</h3>
					<ul className="m-0 mt-4 grid list-none gap-3 p-0">
						{REGION.ekraf.map(({ icon: Icon, text }) => (
							<li key={text} className="flex items-center gap-3 text-sm font-medium">
								<span className="grid size-8 place-items-center rounded-lg bg-white/15">
									<Icon className="size-4" />
								</span>
								{text}
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* ===== Pesona ===== */}
			<section id="pesona" className="mt-10 scroll-mt-24">
				<p className="island-kicker mb-2">Pesona</p>
				<h2 className="display-title m-0 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
					Yang membuat {REGION.name} istimewa
				</h2>
				<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{REGION.highlights.map(({ icon: Icon, title, tone, items }, i) => (
						<div
							key={title}
							className="dash-panel dash-stat rise-in"
							style={{ animationDelay: `${i * 70}ms` }}
						>
							<span className={`grid size-11 place-items-center rounded-xl ${TONES[tone]}`}>
								<Icon className="size-5" />
							</span>
							<h3 className="m-0 mt-4 text-base font-bold text-[var(--sea-ink)]">{title}</h3>
							<ul className="m-0 mt-3 grid list-none gap-2 p-0 text-sm text-[var(--sea-ink-soft)]">
								{items.map((it) => (
									<li key={it} className="flex items-center gap-2">
										<span className="size-1.5 shrink-0 rounded-full bg-[var(--lagoon)]" />
										{it}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			{/* ===== Ekraf: data nyata dari aplikasi ===== */}
			<section className="mt-10 grid gap-6 lg:grid-cols-3">
				<div className="dash-panel lg:col-span-2">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div>
							<h2 className="m-0 text-lg font-bold text-[var(--sea-ink)]">
								Produk kreatif lokal
							</h2>
							<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
								{!signedIn ? "Data tersedia setelah masuk" : loading ? "Memuat…" : `${products.length} produk · ${totalStock} unit stok`}
							</p>
						</div>
						<Link
							to="/products"
							className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
						>
							Lihat semua <ArrowUpRight className="size-4" />
						</Link>
					</div>

					{!signedIn ? (
						<div className="grid place-items-center gap-3 rounded-xl border border-dashed border-[var(--line)] py-10 text-center text-sm text-[var(--sea-ink-soft)]">
							<Boxes className="size-8 opacity-50" />
							Masuk untuk melihat dan mengelola produk kreatif lokal.
							<Link
								to="/demo/better-auth"
								className="rounded-xl bg-gradient-to-br from-[#3aa8a1] to-[#2f6a4a] px-4 py-2 font-semibold text-white no-underline"
							>
								Masuk / Daftar
							</Link>
						</div>
					) : products.length === 0 ? (
						<div className="grid place-items-center gap-2 rounded-xl border border-dashed border-[var(--line)] py-10 text-center text-sm text-[var(--sea-ink-soft)]">
							<Boxes className="size-8 opacity-50" />
							{loading ? "Memuat data…" : "Belum ada produk."}
						</div>
					) : (
						<ul className="m-0 grid list-none gap-4 p-0">
							{products.slice(0, 5).map((p) => (
								<li key={p.id} className="grid gap-2">
									<div className="flex items-baseline justify-between gap-3">
										<Link
											to="/products/$productId"
											params={{ productId: p.id }}
											className="truncate font-semibold text-[var(--sea-ink)] no-underline hover:underline"
										>
											{p.name}
										</Link>
										<span className="shrink-0 text-sm text-[var(--sea-ink-soft)]">
											{money(p.price)} · {p.stock} unit
										</span>
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
										<div
											className={`h-full rounded-full transition-all duration-700 ${
												p.stock <= 5
													? "bg-gradient-to-r from-amber-400 to-orange-400"
													: "bg-gradient-to-r from-[var(--lagoon)] to-[var(--palm)]"
											}`}
											style={{ width: `${Math.max(Math.round((p.stock / maxStock) * 100), 4)}%` }}
										/>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="grid content-start gap-4">
					<QuickLink
						to="/products"
						icon={Package}
						title="Kelola produk"
						text="Tambah, ubah, dan hapus produk."
					/>
					<QuickLink
						to="/users"
						icon={Users}
						title={signedIn ? `Pengguna (${loading ? "…" : users.length})` : "Pengguna"}
						text="Atur akun dan peran pengguna."
					/>
					<div className="dash-panel flex items-start gap-3">
						<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
							<ShieldCheck className="size-5" />
						</span>
						<div>
							<p className="m-0 font-semibold text-[var(--sea-ink)]">Area aman</p>
							<p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">
								Semua perubahan divalidasi di sisi server.
							</p>
						</div>
					</div>
				</div>
			</section>

			{(productsQuery.isError || usersQuery.isError) && (
				<p className="mt-4 text-sm text-red-600">
					Gagal memuat data:{" "}
					{((productsQuery.error ?? usersQuery.error) as Error | null)?.message ?? "unknown error"}
				</p>
			)}
		</main>
	);
}

function QuickLink({
	to,
	icon: Icon,
	title,
	text,
}: {
	to: "/products" | "/users";
	icon: Icon;
	title: string;
	text: string;
}) {
	return (
		<Link to={to} className="dash-panel dash-link group flex items-start gap-3 no-underline">
			<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)]">
				<Icon className="size-5" />
			</span>
			<div className="flex-1">
				<p className="m-0 font-semibold text-[var(--sea-ink)]">{title}</p>
				<p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">{text}</p>
			</div>
			<ArrowUpRight className="size-4 text-[var(--sea-ink-soft)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
		</Link>
	);
}
