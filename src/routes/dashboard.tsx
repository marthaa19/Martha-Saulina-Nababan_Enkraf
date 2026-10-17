import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import {
	ArrowDownToLine,
	ArrowUpRight,
	Award,
	Boxes,
	Landmark,
	MapPin,
	Mountain,
	Music,
	Package,
	Palette,
	Ruler,
	ShieldCheck,
	Shirt,
	Users,
	Utensils,
	Waves,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "#/lib/auth-client";
import { getServerSession } from "@/lib/server/auth";
import { getProducts } from "@/lib/server/products";
import { getUsers } from "@/lib/server/users";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const { session } = await getServerSession();
		if (!session) {
			return redirect({ to: "/demo/better-auth" }) as any;
		}
	},
	component: Dashboard,
});

/* ==========================================================================
 * KONTEN WILAYAH — ganti isi objek ini untuk memperkenalkan wilayah lain.
 * ========================================================================== */
type Icon = React.ComponentType<{ className?: string }>;
type Spot = { name: string; image: string };
const img = (file: string) => `/images/pesona/${file}`;

const REGION = {
	name: "Danau Toba",
	subtitle: "Tanah Batak, Sumatera Utara",
	greeting: "Horas!",
	tagline:
		"Danau vulkanik terbesar di dunia, rumah bagi budaya Batak Toba yang kaya dan ekonomi kreatif yang terus tumbuh.",
	facts: [
		{ label: "Provinsi", value: "Sumatera Utara", icon: MapPin },
		{ label: "Panjang danau", value: "± 100 km", icon: Ruler },
		{ label: "Kedalaman maks.", value: "± 500 m", icon: ArrowDownToLine },
		{ label: "Status", value: "UNESCO Global Geopark", icon: Award },
	] as { label: string; value: string; icon: Icon }[],
	about: [
		"Danau Toba terbentuk dari letusan super vulkanik purba dan menjadi danau kaldera terbesar di dunia. Di tengahnya berdiri Pulau Samosir, pulau yang dikelilingi air danau.",
		"Di sekeliling danau hidup masyarakat Batak Toba dengan adat, musik, arsitektur, dan kerajinan yang masih terjaga — modal besar bagi pengembangan ekonomi kreatif (ekraf) daerah.",
	],
	highlights: [
		{
			icon: Mountain,
			title: "Wisata alam",
			cover: img("sipiso-piso.jpg"),
			tone: "blue",
			items: [
				{ name: "Danau Toba", image: img("danau-toba.jpg") },
				{ name: "Pulau Samosir", image: img("pulau-samosir.jpg") },
				{ name: "Air Terjun Sipiso-piso", image: img("sipiso-piso.jpg") },
				{ name: "Bukit Holbung", image: img("bukit-holbung.jpg") },
			],
		},
		{
			icon: Landmark,
			title: "Budaya & adat",
			cover: img("huta-siallagan.jpg"),
			tone: "amber",
			items: [
				{ name: "Rumah Bolon", image: img("rumah-bolon.jpg") },
				{ name: "Tor-tor", image: img("tor-tor.jpg") },
				{ name: "Gondang Sabangunan", image: img("gondang-sabangunan.jpg") },
				{ name: "Huta Siallagan", image: img("huta-siallagan.jpg") },
			],
		},
		{
			icon: Shirt,
			title: "Kerajinan",
			cover: img("kain-ulos.jpg"),
			tone: "red",
			items: [
				{ name: "Kain Ulos", image: img("kain-ulos.jpg") },
				{ name: "Ukiran Gorga", image: img("ukiran-gorga.jpg") },
				{ name: "Patung Sigale-gale", image: img("sigale-gale.jpg") },
				{ name: "Perhiasan perak", image: img("perhiasan-perak.jpg") },
			],
		},
		{
			icon: Utensils,
			title: "Kuliner khas",
			cover: img("mi-gomak.jpg"),
			tone: "orange",
			items: [
				{ name: "Arsik ikan mas", image: img("arsik-ikan-mas.jpg") },
				{ name: "Naniura", image: img("naniura.jpg") },
				{ name: "Mi Gomak", image: img("mi-gomak.jpg") },
				{ name: "Kopi Sumatera", image: img("kopi-sumatera.jpg") },
			],
		},
	] as { icon: Icon; title: string; tone: keyof typeof TONES; cover: string; items: Spot[] }[],
	ekraf: [
		{ icon: Palette, text: "Kriya & seni rupa" },
		{ icon: Music, text: "Musik & seni pertunjukan" },
		{ icon: Utensils, text: "Kuliner" },
		{ icon: Shirt, text: "Fesyen & tekstil" },
	] as { icon: Icon; text: string }[],
};

const TONES = {
	blue: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
	orange: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
	amber: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
	red: "bg-red-500/15 text-red-600 dark:text-red-300",
	indigo: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
} as const;

type Highlight = (typeof REGION.highlights)[number];

const money = (n: number) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function greeting() {
	const h = new Date().getHours();
	if (h < 11) return "Selamat pagi";
	if (h < 15) return "Selamat siang";
	if (h < 18) return "Selamat sore";
	return "Selamat malam";
}

function Dashboard() {
	const { data: session } = authClient.useSession();
	const [active, setActive] = useState<Highlight | null>(null);
	const productsQuery = useQuery({
		queryKey: ["dashboard", "products"],
		queryFn: async () => getProducts(),
	});
	const usersQuery = useQuery({
		queryKey: ["dashboard", "users"],
		queryFn: async () => getUsers(),
	});

	const products = productsQuery.data ?? [];
	const users = usersQuery.data ?? [];
	const totalStock = products.reduce((s, p) => s + p.stock, 0);
	const maxStock = Math.max(1, ...products.map((p) => p.stock));
	const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";
	const loading = productsQuery.isLoading || usersQuery.isLoading;

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
						{REGION.greeting} <span className="text-[#ffd98a]">{REGION.name}</span>
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
						fill="rgba(186,224,255,0.4)"
					/>
				</svg>
				<div className="auth-orb auth-orb-a opacity-60" />
			</section>

			{/* ===== Fakta singkat ===== */}
			<section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
				{REGION.facts.map((f, i) => {
					const FactIcon = f.icon;
					return (
						<div
							key={f.label}
							className="dash-panel dash-stat fact-card rise-in"
							style={{ animationDelay: `${i * 60}ms` }}
						>
							<span className="grid size-9 place-items-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-300">
								<FactIcon className="size-4.5" />
							</span>
							<p className="m-0 mt-3 text-xs font-bold uppercase tracking-wider text-[var(--kicker)]">
								{f.label}
							</p>
							<p className="m-0 mt-1 text-lg font-extrabold leading-snug text-[var(--sea-ink)] sm:text-xl">
								{f.value}
							</p>
						</div>
					);
				})}
			</section>

			{/* ===== Tentang ===== */}
			<section className="mt-6 grid gap-6 lg:grid-cols-5">
				<div className="dash-panel lg:col-span-3">
					<p className="island-kicker mb-2">Tentang wilayah</p>
					<h2 className="display-title m-0 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
						Mengenal {REGION.name}
					</h2>
					<span className="ulos-divider" />
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
				<span className="ulos-divider" />
				<p className="m-0 mt-3 text-sm text-[var(--sea-ink-soft)]">
					Klik salah satu kategori untuk melihat foto-fotonya.
				</p>
				<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{REGION.highlights.map((h, i) => {
						const Icon = h.icon;
						return (
							<button
								type="button"
								key={h.title}
								onClick={() => setActive(h)}
								className="group dash-panel dash-panel-flush dash-stat dash-link rise-in cursor-pointer overflow-hidden text-left"
								style={{ animationDelay: `${i * 70}ms` }}
							>
								<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[var(--lagoon)]/30 to-[var(--palm)]/30">
									<img
										src={h.cover}
										alt={h.title}
										loading="lazy"
										className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#0f2745]/90 via-[#0f2745]/15 to-transparent" />
									<div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4">
										<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/20 text-white backdrop-blur">
											<Icon className="size-4.5" />
										</span>
										<h3 className="m-0 text-lg font-bold text-white">{h.title}</h3>
									</div>
								</div>
								<div className="p-4">
									<ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
										{h.items.map((it) => (
											<li
												key={it.name}
												className="rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-medium text-[var(--sea-ink-soft)]"
											>
												{it.name}
											</li>
										))}
									</ul>
									<span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--lagoon-deep)]">
										Lihat {h.items.length} foto <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									</span>
								</div>
							</button>
						);
					})}
				</div>

				{active && <PesonaModal highlight={active} onClose={() => setActive(null)} />}
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
								{loading ? "Memuat…" : `${products.length} produk · ${totalStock} unit stok`}
							</p>
						</div>
						<Link
							to="/products"
							className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
						>
							Lihat semua <ArrowUpRight className="size-4" />
						</Link>
					</div>

					{products.length === 0 ? (
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
						title={`Pengguna (${loading ? "…" : users.length})`}
						text="Atur akun dan peran pengguna."
					/>
					<div className="dash-panel flex items-start gap-3">
						<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
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

function PesonaModal({ highlight, onClose }: { highlight: Highlight; onClose: () => void }) {
	const Icon = highlight.icon;

	// Tutup dengan tombol Esc & kunci scroll halaman saat popup terbuka.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
			onClick={onClose}
			role="presentation"
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={highlight.title}
				onClick={(e) => e.stopPropagation()}
				className="rise-in max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-2xl sm:p-6"
			>
				<div className="mb-5 flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<span className={`grid size-10 place-items-center rounded-xl ${TONES[highlight.tone]}`}>
							<Icon className="size-5" />
						</span>
						<h3 className="m-0 text-xl font-bold text-[var(--sea-ink)]">{highlight.title}</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Tutup"
						className="grid size-9 cursor-pointer place-items-center rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					{highlight.items.map((it) => (
						<figure
							key={it.name}
							className="group m-0 overflow-hidden rounded-xl border border-[var(--line)] shadow-sm"
						>
							<div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--lagoon)]/30 to-[var(--palm)]/30">
								<img
									src={it.image}
									alt={it.name}
									loading="lazy"
									className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
								<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f2745]/85 to-transparent px-4 pb-3 pt-12">
									<p className="m-0 text-sm font-bold text-white">{it.name}</p>
								</div>
							</div>
						</figure>
					))}
				</div>
			</div>
		</div>
	);
}
