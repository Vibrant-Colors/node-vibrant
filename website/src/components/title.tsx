interface TitleProps {
	title: string;
	id?: string;
}

export const Title = ({ title, id }: TitleProps) => {
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				alignItems: "center",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
				}}
			>
				<hr
					style={{
						position: "absolute",
						top: "calc(50% + calc(0.375rem / 2))",
						zIndex: -1,
						left: "50%",
						transform: "translate(-50%, -50%)",
						borderColor: "transparent",
						borderTop: "0.375rem dotted #CF9D13",
						width: "100%",
					}}
				/>
				<h2
					id={id}
					style={{
						width: "fit-content",
						margin: "0 auto",
						background: "var(--sl-color-bg)",
						padding: "0 1rem",
						color: "var(--sl-color-text)",
						fontSize: "2rem",
						fontWeight: "700",
						lineHeight: "2.5rem",
						textAlign: "center",
					}}
				>
					{title}
				</h2>
			</div>
		</div>
	);
};
