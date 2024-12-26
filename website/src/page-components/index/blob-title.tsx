interface BlobTitleProps {
	title: string;
}

export const BlobTitle = ({ title }: BlobTitleProps) => {
	const titleLength = title.length;
	const svgWidth = titleLength * 85; // Adjust multiplier as needed
	const svgHeight = 250;

	return (
		<div
			style={{
				position: "relative",
				maxWidth: "1200px",
				margin: "0 auto",
				width: "100%",
			}}
		>
			<svg
				width={"100%"}
				viewBox={`0 0 ${svgWidth} ${svgHeight}`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<clipPath id="textClip">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							style={{ transform: "translate(20%, 0%)" }}
							d="M229.346 4.55498C355.281 29.5933 425.293 147.645 370.785 206.007C323.101 257.063 262.072 194.01 193.395 180.478C122.857 166.579 33.3513 204.321 4.50831 140.756C-24.3347 77.191 103.412 -20.4833 229.346 4.55498Z"
							fill="#CF9D13"
						/>
					</clipPath>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill="#CF9D13"
					clipPath="url(#textClip)"
				/>
				<text
					x="50%"
					y="80%"
					dominantBaseline="middle"
					textAnchor="middle"
					fontSize="9rem"
					fontWeight="800"
					fill="var(--sl-color-text)"
				>
					{title}
				</text>
				<text
					style={{ userSelect: "none" }}
					x="50%"
					y="80%"
					dominantBaseline="middle"
					textAnchor="middle"
					fontSize="9rem"
					fontWeight="800"
					fill="#ffff26"
					clipPath="url(#textClip)"
				>
					{title}
				</text>
			</svg>

			<h1 className="srOnly">{title}</h1>
		</div>
	);
};
