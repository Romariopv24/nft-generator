import "./loader.css";

export default function Loader() {
  return (
    <div class="clock-loader">
      <span
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "20px",
          marginTop: "7rem",
          color: "#C8CCE9",
        }}
      >
        Loading...
      </span>
    </div>
  );
}
