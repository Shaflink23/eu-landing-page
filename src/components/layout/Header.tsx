export default function Header() {
			return (
				<header className="w-full z-50 absolute top-0 left-0 bg-transparent pt-5">
					{/* Only render logo if not in modal */}
					{/* This logic should be handled in the parent layout/App, not here. Remove logo from modal overlay. */}
				</header>
			);
}