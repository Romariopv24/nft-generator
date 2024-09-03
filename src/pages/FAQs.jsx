import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import "../styles/scss/_faqs.scss";
//import { MDBAccordion, MDBAccordionItem, MDBContainer } from "mdb-react-ui-kit";

const dataCollection = [
  {
    question: (
      <FormattedMessage
        id="faq.1.ask"
        defaultMessage="What is NFT Collection generation with layers?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.1.res"
        defaultMessage="The generation of NFT collections with layers is a process that allows you to create unique NFT collections by combining different layers of images or visual elements. This enables the creation of a variety of custom NFTs with unique features."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.2.ask"
        defaultMessage="How does NFT Collection generation with layers work in this service?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.2.res"
        defaultMessage="To use our service, users must upload the layers of images that will make up their NFT collections. They can then configure the rarities of these layers and generate custom NFT collections from them."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.3.ask"
        defaultMessage="What are the “rarities“ of the layers, and how are they configured?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.3.res"
        defaultMessage="“Rarities“ refer to the probability of a specific layer being used when generating an NFT within a collection. Users can configure the rarities of their layers to determine how often they will appear in the NFTs generated in the collection. This allows for the creation of NFTs with unique and scarce elements."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.4.ask"
        defaultMessage="What types of images or layers can be uploaded?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.4.res"
        defaultMessage="You can upload images or layers in common image formats, such as PNG or JPEG. Layers can be visual elements, illustrations, photographs, or any type of graphic content you want to combine in your NFTs within the collection. The layers should all be of the same dimensions and follow the guidelines established by the platform."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.5.ask"
        defaultMessage="How are NFTs generated within a collection from the layers?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.5.res"
        defaultMessage="Once you have uploaded the layers and configured the rarities, our system will generate unique NFTs within the collection by combining these layers according to the rarity settings you have established. The generated NFTs will be ready for download and use on any marketplace and network."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.6.ask"
        defaultMessage="Can I sell the NFTs generated in collections on NFT markets?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.6.res"
        defaultMessage="Yes, the NFTs generated in collections belong to you, and you can sell them on the NFT markets of your choice. You can use the generated metadata and provided information to list your NFTs on these markets."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.7.ask"
        defaultMessage="How long are the NFTs generated in collections stored in the service?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.7.res"
        defaultMessage="The NFTs generated in collections are stored on the service for a specified period (which may vary). After this time, it is the user's responsibility to download and back up their NFTs, as the service does not guarantee long-term storage."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.8.ask"
        defaultMessage="What if I change my mind or make an error in the generation of NFTs within a collection?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.8.res"
        defaultMessage="NFT generations within a collection are final and cannot be undone. Be sure to carefully review and confirm your settings before generating the NFTs."
      />
    ),
  },
  {
    question: (
      <FormattedMessage
        id="faq.9.ask"
        defaultMessage="Can I modify the layers or rarities after generating the NFTs within a collection?"
      />
    ),
    answer: (
      <FormattedMessage
        id="faq.9.res"
        defaultMessage="Once the NFTs within a collection are generated, it is not possible to modify the layers or associated rarities. If you want to make changes, you will need to create a new generation of NFTs within the collection with the desired settings."
      />
    ),
  },
];

const FAQs = () => {
  const [accordion, setActiveAccordion] = useState(-1);

  function toggleAccordion(index) {
    if (index === accordion) {
      setActiveAccordion(-1);
      return;
    }
    setActiveAccordion(index);
  }

  return (
    <>
      <div className="container faqs_container">
        <div>
          {/* <span className="accordion__title">Frequently asked questions</span> */}
          <h1 className="h1_title">
            {" "}
            <FormattedMessage
              id="faq.title"
              defaultMessage="FAQs - NFT Collection Generation with Layers"
            />
          </h1>
        </div>
        <div className="accordion__faq">
          {dataCollection.map((item, index) => (
            <div key={index} onClick={() => toggleAccordion(index)}>
              <div className="accordion__faq-heading">
                <h3 className={accordion === index ? "active mt-2" : "mt-2"}>
                  {item.question}
                </h3>
                <div>
                  {accordion === index ? (
                    <span className="verticle">-</span>
                  ) : (
                    <span className="horizental">+</span>
                  )}
                </div>
              </div>
              <div>
                <p className={accordion === index ? "active" : "inactive"}>
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            height: "40rem",
            marginTop: "3rem",
            marginBottom: "3rem",
            paddingBottom: "3rem",
          }}
        >
          <iframe
            title="Faqs"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/Jox6R5-rIH0?si=cHFkuoiBTMjqNaJ9"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>
    </>
  );
};

export default FAQs;
