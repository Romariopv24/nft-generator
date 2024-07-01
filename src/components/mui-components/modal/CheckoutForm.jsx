// /* eslint-disable react/prop-types */
// import { Box, Button, Stack } from "@mui/material"
// import {
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js"
// import { useEffect, useState } from "react"
import StripeSkeleton from "../../custom/StripeSkeleton"

import { Box, Button, Stack } from "@mui/material"
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { axiosClass } from "../../../api/api.config"
import { useStoreProv } from "../../../utils/zustand/store"
import { useNavigate } from "react-router-dom"
import { useIntl } from "react-intl"

export default function CheckoutForm({
  // setIsConfirmed,
  // handleDownload,
  // paymentIntentId,
  // setShowModal,
  // state
  options,
  handleClose,
  stripePromise,
  botonGenerate,
  closePaymentModal
}) {
  const intl = useIntl()
  const [lie, setLie] = useState(false)
  // const { setStripe } = useStore()
  const stripe = useStripe()
  const elements = useElements()

  const { payConfirm, setPayConfirm, email, setSignal } = useStoreProv()
  const [message, setMessage] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)
  useEffect(() => {
    if (!stripe || !elements) return

    if (elements?._commonOptions?.clientSecret?.id) {
      setTimeout(() => {
        setLie(true)
      }, 3000)
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent)
      console.log("prueba")
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsProcessing(true)

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "http://localhost:3000"
        },
        redirect: "if_required"
      })
      .then((res) => {
        if (res.paymentIntent) {
          const paymenConfirmed = intl.formatMessage({
            id: "payment.Confirmed",
            defaultMessage: "Payment Confirmed, please wait a few minutes!"
          })
          axiosClass
            .post("confirm_payment", { paymentIntentId: res.paymentIntent.id })
            .then(async (res) => {
              if (res.status === 200) {
                enqueueSnackbar(paymenConfirmed, {
                  variant: "success",
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                  }
                })
                setPayConfirm(true)
                handleClose()
                setSignal(true)
              }
            })
            .catch((err) => {
              setPayConfirm(false)
            })
        }
      })
      .catch((err) => {
        setIsProcessing(false)
        setPayConfirm(false)
      })
  }

  const paymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        email: email !== "" ? email : ""
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {!lie ? (
        <StripeSkeleton />
      ) : (
        <>
          <LinkAuthenticationElement id="link-authentication-element" />
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />
          <Stack alignItems={"center"}>
            <Button
              variant="contained"
              sx={btnStyle}
              type="submit"
              disabled={isProcessing || !stripe || !elements}
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
            {message && <Box id="payment-message">{message}</Box>}
          </Stack>
        </>
      )}
    </form>
  )
}

const btnStyle = {
  bgcolor: "#6B78B8",
  height: "2rem",
  marginY: 2
}

// import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
// import React, { useEffect, useState } from "react"

// export default function CheckoutForm({ handleClose, options, stripePromise }) {
//   const stripe = useStripe()
//   const elements = useElements()

//   const [message, setMessage] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (!stripe) {
//       return
//     }

//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     )

//     if (!clientSecret) {
//       return
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Payment succeeded!")
//           break
//         case "processing":
//           setMessage("Your payment is processing.")
//           break
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.")
//           break
//         default:
//           setMessage("Something went wrong.")
//           break
//       }
//     })
//   }, [stripe])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return
//     }

//     setIsLoading(true)

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Make sure to change this to your payment completion page
//         return_url: "http://localhost:3000"
//       }
//     })

//     // This point will only be reached if there is an immediate error when
//     // confirming the payment. Otherwise, your customer will be redirected to
//     // your `return_url`. For some payment methods like iDEAL, your customer will
//     // be redirected to an intermediate site first to authorize the payment, then
//     // redirected to the `return_url`.
//     if (error.type === "card_error" || error.type === "validation_error") {
//       setMessage(error.message)
//     } else {
//       setMessage("An unexpected error occurred.")
//     }

//     setIsLoading(false)
//   }

//   const paymentElementOptions = {
//     layout: "tabs"
//   }

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <PaymentElement id="payment-element" options={paymentElementOptions} />
//       <button disabled={isLoading || !stripe || !elements} id="submit">
//         <span id="button-text">
//           {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
//         </span>
//       </button>
//       <button onClick={handleClose}>
//         <span id="button-text">close</span>
//       </button>
//       {/* Show any error or success messages */}
//       {message && <div id="payment-message">{message}</div>}
//     </form>
//   )
// }
