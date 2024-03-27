import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz'
import enMessages from './common/locales/en.json';
import frMessages from './common/locales/fr.json';
import swMessages from './common/locales/sw.json';
import esMessages from './common/locales/es.json';

let dateFormat = 'MM/dd/yyyy';
let timeFormat = 'HH:mm';
let timeZoneFormat = 'Etc/GMT+3';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    ...enMessages,
                    languageName: "English",
                    languageFlag: "us",
                },
            },
            fr: {
                translation: {
                    ...frMessages,
                    languageName: "French",
                    languageFlag: "fr",
                },
            },
            sw: {
                translation: {
                    ...swMessages,
                    languageName: "Kiswahili",
                    languageFlag: "ke",
                },
            },
            es: {
                translation: {
                    ...esMessages,
                    languageName: "Spanish",
                    languageFlag: "es",
                },
            },
        },
        lng: navigator.language.split(/[-_]/)[0] || "en",
        fallbackLng: "en",
        interpolation: {
                escapeValue: false,
                format: function (value, formatType, lng) {
                    if (formatType === "date") {
                      const dateFormat = i18n.options.format.date;
                      //Apply time zone
                      const timeZoneFormat = i18n.options.format.timeZone;          
                      const parseDate = new Date(value);
                      const valueWTimeZone = zonedTimeToUtc(parseDate, timeZoneFormat) ;                        
                      return format(valueWTimeZone, dateFormat)
                    }
                    if (formatType === "time") {
                      const timeFormat = i18n.options.format.time;                      
                      //Apply time zone 
                      const timeZoneFormat = i18n.options.format.timeZone;
                      const parseDate = new Date(value);
                      const valueWTimeZone = zonedTimeToUtc(parseDate, timeZoneFormat) ;                     
                      return format(valueWTimeZone, timeFormat)
                    }
                    return value;
                },
        },
        format: {
            date: dateFormat, 
            time: timeFormat, 
            timeZone: timeZoneFormat,
        },
    });


export default i18n;
