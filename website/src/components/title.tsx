interface TitleProps {
  title: string;
}

export const Title = ({ title }: TitleProps) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        padding: "6rem 0rem 4rem 0rem",
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
            borderTop: "0.375rem dotted #CF9D13",
            width: "100%"
          }}
        />
        <h2
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