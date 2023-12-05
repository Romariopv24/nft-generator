import { SnackbarProvider } from "notistack"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { LangProvider } from "./context/langContext"

if (process.env.NODE_ENV === "production") {
  console.log = () => {}
}

ReactDOM.render(
  <LangProvider>
    <React.StrictMode>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </React.StrictMode>
  </LangProvider>,
  document.getElementById("root")
)
