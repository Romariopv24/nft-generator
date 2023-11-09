import React from "react";
import { FormattedMessage } from "react-intl";
import "../styles/scss/_terms.scss";

const Terms = () => {
  return (
    <div style={{ paddingTop: "6vh" }}>
      <div className="justify-content-center d-flex">
        <h1>
          <FormattedMessage
            id="legalwarning.termsncondition"
            defaultMessage="Términos y Condiciones del Generador de Colecciones de NFTs"
          />
        </h1>
      </div>
      <div className="principal_container text_justify p-3">
        <p>
          <FormattedMessage
            id="legalwarning.date"
            defaultMessage="Effective Date: November 1, 2023"
          />
        </p>

        <p className="fw-bold fs-4">
          {" "}
          <ins>
            <FormattedMessage
              id="legalwarning.aceptTitle"
              defaultMessage="Acceptance of Terms and Conditions"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.aceptText"
            defaultMessage="By accessing and using the NFT Collection Generator service (hereinafter referred to as 'the Service'), you agree to and are bound by the following terms and conditions. If you do not agree to these terms, we recommend that you do not use the Service."
          />
        </p>
        <p className="fw-bold fs-4">
          {" "}
          <ins>
            <FormattedMessage
              id="legalwarning.firstTitle"
              defaultMessage="1. Use of the Service"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.1.1"
            defaultMessage="1.1 Registration and Authentication: To use the Service, users must authenticate using a compatible cryptocurrency wallet, such as Metamask. The user is solely responsible for maintaining the security of their wallet and access credentials."
          />
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.1.2"
            defaultMessage="1.2 Collection Generation: Users can generate collections of NFTs through the Service. Up to 99 images per collection are free, but if a user generates more than 99 images in a single collection, fees will apply as set forth in section 2."
          />
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.1.3"
            defaultMessage=" 1.3 Almacenamiento de Colecciones: Las colecciones generadas se almacenarán en el Servicio durante un período de 15 días. Después de este período, el usuario deberá descargar y respaldar sus colecciones, ya que el Servicio no garantiza el almacenamiento a largo plazo."
          />
        </p>
        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.secondTitle"
              defaultMessage="2. Fees and Payment"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.2.1"
            defaultMessage="2.1 Image Generation Fees: If a user generates more than 99 images in a single collection, fees will apply based on the prevailing rates at the time of generation. These fees will be detailed to the user before confirming the collection generation."
          />
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.2.2"
            defaultMessage="2.2 Métodos de Pago: Las tarifas se pagarán en la criptomoneda especificada en el Servicio o mediante Tarjeta de Crédito, y el usuario deberá completar el pago utilizando su billetera de criptomonedas compatible o tarjeta de crédito vigente."
          />
        </p>
        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.thirdTitle"
              defaultMessage="3. Intellectual Property and Usage Rights"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.3.1"
            defaultMessage="3.1 Generated Collections: The collections generated through the Service are the exclusive property of the users. The user retains all intellectual property rights over the images and the generated JSON files."
          />
        </p>
        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.fourthTitle"
              defaultMessage="4. User Responsibility"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.4.1"
            defaultMessage="4.1 Legal Compliance: The user is solely responsible for complying with all applicable laws and regulations regarding the use and generation of NFTs through the Service, including those related to copyright, intellectual property, and cryptocurrencies."
          />
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.4.2"
            defaultMessage="4.2 Wallet Security: The user must take necessary measures to keep their cryptocurrency wallet and access credentials secure. The Service is not responsible for any loss or unauthorized access to the wallet."
          />
        </p>
        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.fiveTitle"
              defaultMessage="5. Changes to Terms and Conditions"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.5"
            defaultMessage="The Service reserves the right to update or modify these terms and conditions at any time. Users will be notified of any changes, and continued use of the Service will constitute acceptance of the updated terms."
          />
        </p>
        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.sixTitle"
              defaultMessage="6. Limitation of Liability"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.6"
            defaultMessage="The Service is not liable for any direct, indirect, incidental, consequential, or special damages, including loss of profits, revenue, or data, that may arise from the use or inability to use the Service."
          />
        </p>

        <p className="fw-bold fs-4">
          <ins>
            <FormattedMessage
              id="legalwarning.sevenTitle"
              defaultMessage="7. Contact"
            />
          </ins>
        </p>
        <p>
          <FormattedMessage
            id="legalwarning.7"
            defaultMessage="For questions or clarifications regarding these terms and conditions, you can contact us through the contact form provided for this purpose."
          />
        </p>
      </div>
    </div>
  );
};

export default Terms;
