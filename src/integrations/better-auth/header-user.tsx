import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { authClient } from "#/lib/auth-client";

const btn =
	"inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:bg-[var(--link-bg-hover)]";

export default function BetterAuthHeader() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <div className="h-9 w-20 animate-pulse rounded-xl bg-[var(--line)]" />;
	}

	if (session?.user) {
		return (
			<div className="flex items-center gap-2">
				<div
					title={session.user.email}
					className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[var(--lagoon)] to-[var(--palm)] text-sm font-bold text-white"
				>
					{session.user.name?.charAt(0).toUpperCase() || "U"}
				</div>
				<button
					type="button"
					onClick={() => {
						void authClient.signOut();
					}}
					className={btn}
				>
					<LogOut className="size-4" />
					<span className="hidden sm:inline">Keluar</span>
				</button>
			</div>
		);
	}

	return (
		<Link to="/demo/better-auth" className={btn}>
			<LogIn className="size-4" />
			Masuk
		</Link>
	);
}
