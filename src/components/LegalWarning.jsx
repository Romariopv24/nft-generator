import React from "react";
import { FormattedMessage } from "react-intl";
import "../styles/scss/_legal-warning.scss";
import GenericModal from "./GenericModal";

export const LegalWarning = ({ showLegalWarning, setShowLegalWarning }) => {
  console.log(showLegalWarning);

  const close = () => {
    setShowLegalWarning(false);
  };

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
            borderBottomRightRadius: 0,
          }}
        >
          <FormattedMessage
            id="legalwarning.title"
            defaultMessage="Legal Warning"
          />
        </h3>

        <div
          style={{ overflowY: "scroll", maxHeight: "65vh" }}
          className="p-2 my-3 legal-p"
        >
          <h4 id="list-item-1">Item 1</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Tristique magna sit amet purus gravida. Tempus imperdiet nulla
            malesuada pellentesque. Donec ultrices tincidunt arcu non sodales.
            Porttitor rhoncus dolor purus non. Consectetur purus ut faucibus
            pulvinar. Eget arcu dictum varius duis at consectetur lorem donec
            massa. Nibh sed pulvinar proin gravida hendrerit lectus a. Mus
            mauris vitae ultricies leo integer malesuada nunc vel risus.
            Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Auctor
            augue mauris augue neque gravida in fermentum et. In iaculis nunc
            sed augue lacus viverra vitae congue eu.
          </p>
          <h4 id="list-item-2">Item 2</h4>
          <p>
            Semper eget duis at tellus. Aliquam eleifend mi in nulla posuere. Mi
            bibendum neque egestas congue quisque. Aliquet enim tortor at auctor
            urna nunc. Est ante in nibh mauris cursus mattis molestie a. Aliquet
            lectus proin nibh nisl condimentum id venenatis a. Egestas sed
            tempus urna et. Eget egestas purus viverra accumsan in. Dictum at
            tempor commodo ullamcorper a lacus vestibulum sed. Ipsum a arcu
            cursus vitae. Nisi quis eleifend quam adipiscing. Arcu cursus vitae
            congue mauris rhoncus aenean vel. Eu mi bibendum neque egestas
            congue quisque.
          </p>
          <h4 id="list-item-3">Item 3</h4>
          <p>
            Mattis aliquam faucibus purus in. Cursus eget nunc scelerisque
            viverra mauris in aliquam sem. Rhoncus dolor purus non enim praesent
            elementum facilisis. Turpis tincidunt id aliquet risus feugiat in.
            Faucibus purus in massa tempor nec. Dui id ornare arcu odio ut sem.
            Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Fusce
            id velit ut tortor pretium viverra suspendisse potenti nullam. Quam
            elementum pulvinar etiam non quam lacus. Risus ultricies tristique
            nulla aliquet enim tortor at auctor. Sed velit dignissim sodales ut
            eu sem integer vitae. Magna etiam tempor orci eu lobortis elementum
            nibh tellus.
          </p>
          <h4 id="list-item-4">Item 4</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Magnis dis
            parturient montes nascetur ridiculus. Vitae sapien pellentesque
            habitant morbi tristique senectus et. Sit amet massa vitae tortor
            condimentum. Dolor magna eget est lorem ipsum dolor sit. Convallis
            aenean et tortor at risus viverra. In nulla posuere sollicitudin
            aliquam ultrices. In nulla posuere sollicitudin aliquam ultrices
            sagittis orci. Commodo odio aenean sed adipiscing. Ut pharetra sit
            amet aliquam id diam maecenas ultricies. Ac turpis egestas sed
            tempus urna et. Convallis tellus id interdum velit.
          </p>
        </div>
      </div>

      <div className="p-2 mb-2">
        <button className="__boton-mediano enphasis-button" onClick={close}>
          <FormattedMessage id="legalwarning.button" defaultMessage="Accept" />
        </button>
      </div>
    </GenericModal>
  );
};
