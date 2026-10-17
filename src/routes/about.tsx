import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
});

const STACK = ["TanStack Start", "React", "Tailwind CSS", "Better Auth", "TanStack Query"];

function About() {
	return (
		<main className="page-wrap px-4 py-8 sm:py-10">
			<section className="dash-panel rise-in p-6 sm:p-8">
				<p className="island-kicker mb-2">Tentang proyek</p>
				<h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					Ekraf Toba Dashboard
				</h1>
				<p className="mt-4 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					Aplikasi web untuk memperkenalkan Danau Toba dan mengelola produk ekonomi kreatif
					(ekraf) lokal. Pengguna dapat masuk, melihat ringkasan wilayah, serta mengelola produk
					dan akun pengguna.
				</p>
				<p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
					Dibuat oleh <span className="font-semibold">Martha Saulina Nababan</span>.
				</p>

				<h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-[var(--kicker)]">
					Teknologi
				</h2>
				<ul className="m-0 flex list-none flex-wrap gap-2 p-0">
					{STACK.map((s) => (
						<li
							key={s}
							className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3.5 py-1.5 text-sm font-medium text-[var(--sea-ink)]"
						>
							{s}
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
