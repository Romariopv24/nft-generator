import React, {useState} from "react";
import textosIngles from "../lang/en-US.json";
import textosEspanol from "../lang/es-ES.json";
import { IntlProvider } from "react-intl";

const langContext = React.createContext();

const LangProvider = ({children}) => {
    let localePorDefecto;
    let textosPorDefecto;
    const idioma = localStorage.getItem('idioma');

    if (idioma) {
        localePorDefecto = idioma;
        if (idioma === 'es-ES') {
            textosPorDefecto = textosEspanol;
        } else if (idioma === 'en-US') {
            textosPorDefecto = textosIngles;
        } else {
            localePorDefecto = 'en-US';
            textosPorDefecto = textosIngles;
        }
    }

    const [textos, setTextos] = useState(textosPorDefecto);
    const [locale, setLocale] = useState(localePorDefecto);

    const cambiarIdioma = (idioma) => {
        switch (idioma) {
            case 'es-ES':
                setTextos(textosEspanol);
                setLocale('es-ES');
                localStorage.setItem('idioma', 'es-ES');
                break;
            case 'en-US':
                setTextos(textosIngles);
                setLocale('en-US');
                localStorage.setItem('idioma', 'en-US');
                break;
            default:
                setTextos(textosIngles);
                setLocale('en-US');
                localStorage.setItem('idioma', 'en-US');
        }
    }

    return (
        <langContext.Provider value={{cambiarIdioma: cambiarIdioma}}>
            <IntlProvider locale={locale} messages={textos} defecto={textosPorDefecto}>
                {children}
            </IntlProvider>
        </langContext.Provider>
    );
};

export {LangProvider, langContext};