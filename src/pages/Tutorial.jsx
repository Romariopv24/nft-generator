import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import step0 from "../assets/img/step1.png"
import step1 from "../assets/img/step2.png"
import step2 from "../assets/img/step3.png"

const Tutorial = () => {
    const [step, setStep] = useState(0)
    const navigate = useNavigate()
    const imgs = {
        0: step0,
        1: step1,
        2: step2
    }

    const handleClick = ({ target: { name } }) => {
        if (name === "next" && step < 2) setStep((prev) => prev += 1)
        if (name === "previous") setStep((prev) => prev -= 1)
        if (name === "finish") {
            navigate("/")
        }
    }

    return <>
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#000000b7", padding: "2em", paddingTop: "8rem", borderRadius: 0 }}>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", width: "40%", alignItems: "center", justifyContent: "center", minWidth: "378px" }}>
                    <img src={imgs[step]} style={{ borderRadius: "15px", maxWidth: "478px", width: "90%" }} />
                </div>

                <div style={{ display: "flex", width: "60%", height: "100%" }}>
                    <div style={{ display: "flex", width: "20%", height: "6%", justifyContent: "space-between" }}>
                        {step < 2 ? <button name="next" onClick={handleClick}>Siguiente</button>: <button name="finish" onClick={handleClick}>Continuar</button>}
                        {step > 0 && <button name="previous" onClick={handleClick}>anterior</button>}
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Tutorial