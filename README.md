
# Enkel plugin for å legge inn Nav-dekorator

Jeg skulle starte ett nytt prosjekt. Fant ut at vi
egentlig ikke trengte den i den flaten vi skulle bygge.

Er noen ting denne ikke gjør:
* Støtter ikke Nextjs. eller andre SSRs
* Støtter ikke switching mellom dev og prod
* Støtter ikke override av hvor vidt en bruker er autentisert eller ikke


## Bruk med craco bør være ganske greit overførbart til vanilla 
```craco.config.js
const NavDekoratorWebpackPlugin = require('nav-dekorator-webpack-plugin');
module.exports = {
  webpack: {
    plugins: [
      new NavDekoratorWebpackPlugin({
        overrideEnvSrc: /mitt-eget-endepunkt-for-auth,
        dekorator: {
          context: 'samarbeidspartner',
          simple: true,
          redirectToApp: true,
          level: 'Level4',
          language: 'norsk',
          feedback: false,
          chatbot: false,
        },
      })],
  },
  plugins: [
    {
      plugin: require('craco-less'),
    }
  ],
};
```



## Notater
Avhengig av at https://github.com/jantimon/html-webpack-plugin/ er installert.



### Lokal utvikling av pluginen
Jeg synes det er aller enklest å installere pakken i det repoet der du skal teste den.
Bare kjør denne kommandoen i dette repoet:
```
echo "npm install" $(pwd)
```
Også er det bare å bruke den kommandoen når du skal utvikle. NPM lager da en symlink til det lokale
repoet.
