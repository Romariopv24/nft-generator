import React from "react"
import { FormattedMessage } from "react-intl"
import "../styles/scss/_legal-warning.scss"
import GenericModal from "./GenericModal"

export const LegalWarning = ({ showLegalWarning, setShowLegalWarning }) => {
  const close = () => {
    setShowLegalWarning(false)
  }

  return (
    <GenericModal show={showLegalWarning}>
      <div>
        <h3
          className="p-3"
          style={{
            fontSize: "1.5rem",
            padding: ".7em",
            boxShadow: "#ffffff1f 0px 2px 3px 0px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }}
        >
          <FormattedMessage
            id="legalwarning.title"
            defaultMessage="Licence Agreement"
          />
        </h3>

        <div
          style={{ overflowY: "scroll", maxHeight: "65vh" }}
          className="p-2 my-3 legal-p"
        >
          <h4 id="list-item-1">
            {" "}
            <FormattedMessage
              id="aviso.legal.item1.title"
              defaultMessage="License Agreement Overview: "
            />
          </h4>
          <p>
            <FormattedMessage
              id="aviso.legal.item1.p1"
              defaultMessage="This agreement outlines the terms under which users of Fanaticoins NFT Generator acquire the right to use Fanaticoins NFT Generator’s content. By creating, publishing, exporting, or using designs containing Fanaticoins NFT Generator’s content, users agree to abide by the terms of this License Agreement and Fanaticoins NFT Generator’s Terms of Use, all of which are incorporated herein by reference."
            />
          </p>

          <p>
            <FormattedMessage
              id="aviso.legal.item1.p2"
              defaultMessage="Fanaticoins NFT Generator retains the right to modify the terms of this Agreement, and users are obligated to adhere to such changes."
            />
          </p>

          <p>
            <FormattedMessage
              id="aviso.legal.item1.p3"
              defaultMessage="Failure to comply with these terms may result in legal action and immediate account termination."
            />
          </p>
          <h4 id="list-item-2">
            {" "}
            <FormattedMessage
              id="aviso.legal.item2.title"
              defaultMessage="Fundamental Points and Disclaimers:"
            />
          </h4>
          <p>
            <FormattedMessage
              id="aviso.legal.item2.p1"
              defaultMessage="All media, including photos, images, videos, GIFs, and audio, as well as content generated by AI (shapes, gradients, icons, illustrations, fonts, templates, etc.), are protected by U.S. and international copyright laws. Fanaticoins NFT Generator and its contributors reserve all rights, including copyrights and intellectual property rights."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item2.p2"
              defaultMessage="Fanaticoins NFT Generator may alter, cancel, or replace licenses granted by this Agreement and reserves the right to replace content at any time."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item2.p3"
              defaultMessage="Fanaticoins NFT Generator does not guarantee the accuracy of metadata or information accompanying media and content."
            />
          </p>
          <h4 id="list-item-3">
            {" "}
            <FormattedMessage
              id="aviso.legal.item3.title"
              defaultMessage="Free Media License: "
            />
          </h4>
          <p>
            <FormattedMessage
              id="aviso.legal.item3.p1"
              defaultMessage="Free media provided by Fanaticoins NFT Generator is subject to the licenses of third-party sources. Users must refer to the license agreements of sources like Pixabay, Pexels, Unsplash, Shopify, Google Drive, Storyblocks, and Giphy."
            />
          </p>

          <h4 id="list-item-4">
            {" "}
            <FormattedMessage
              id="aviso.legal.item4.title"
              defaultMessage="Permitted Uses and Restrictions:"
            />
          </h4>
          <p>
            <FormattedMessage
              id="aviso.legal.item4.p1"
              defaultMessage="Users are responsible for appropriate use of media and content within Fanaticoins NFT Generator, including resolving disputes arising from their use."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item4.p2"
              defaultMessage="Users may transfer designs to clients under the condition that clients adhere to the terms of this Agreement. Users remain responsible for their clients' compliance."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item4.p3"
              defaultMessage="Various restrictions apply, in cluding prohibitions on editing content in offensive ways, pornographic, commercializing unaltered content, implying endorsements, using content in trademarks, and engaging in competitive activities."
            />
          </p>

          <h4 id="list-item-4">
            {" "}
            <FormattedMessage
              id="aviso.legal.item5.title"
              defaultMessage="Permitted Uses and Restrictions:"
            />
          </h4>

          <p>
            <FormattedMessage
              id="aviso.legal.item5.p1"
              defaultMessage="Fanaticoins NFT Generator reserves the right to terminate or suspend accounts without notice for violations. Termination results in the loss of rights to media and content."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item5.p2"
              defaultMessage="Licenses may be terminated without notice for non-compliance, requiring users to cease usage and confirm compliance."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item5.p3"
              defaultMessage="Users can terminate their license by destroying content and no longer using Fanaticoins NFT Generator’s media, content, and design."
            />
          </p>
          <h4 id="list-item-4">
            {" "}
            <FormattedMessage
              id="aviso.legal.item6.title"
              defaultMessage="Infringement Claims: "
            />
          </h4>
          <p>
            <FormattedMessage
              id="aviso.legal.item6.p1"
              defaultMessage="Users must cease using content upon awareness of infringement claims and inform Fanaticoins NFT Generator. Users are responsible for adopting measures and notifying Fanaticoins NFT Generator of infringement claims promptly."
            />
          </p>
          <p>
            <FormattedMessage
              id="aviso.legal.item6.p2"
              defaultMessage="The right to use content provided by Fanaticoins NFT Generator is governed by this Agreement, and users agree to its terms by downloading or exporting designs containing free stock media."
            />
          </p>
        </div>
      </div>

      <div className="p-2 mb-2">
        <button className="__boton-mediano enphasis-button" onClick={close}>
          <FormattedMessage id="legalwarning.button" defaultMessage="Accept" />
        </button>
      </div>
    </GenericModal>
  )
}
