# Ukulele Buddy Tuner

Lovable-prompti – Opit soittamaan! Ukuleleviritin

Rakenna responsiivinen, selainpohjainen ukulelen viritysmittari, joka toimii erityisesti lapsille mahdollisimman helposti, mutta näyttää samalla siistiltä ja brändin mukaiselta. Sovellus tulee osaksi Opit soittamaan! -kokonaisuutta ja siihen linkitetään myös Todo Groupsin ukulelen soitto-oppaista.

Tavoite on yksinkertainen:

Lapsen pitää pystyä virittämään ukulele lähes ilman aikuisen apua.

Sovelluksen tulee toimia hyvin puhelimella, tabletilla ja tietokoneella, mutta suunnittelu tehdään ensisijaisesti mobile first -periaatteella.

1. Julkaisu ja tekninen periaate

Toteuta sovellus niin, että se voidaan exportata itsenäiseksi www-sovellukseksi esimerkiksi osoitteeseen:

https://www.opitsoittamaan.fi/viritin/

Tärkeät periaatteet:

ei vaadi kirjautumista

ei tarvitse tietokantaa

ei tarvitse backend-palvelua

mikrofonin ääni käsitellään vain paikallisesti selaimessa

ääntä ei tallenneta

ääntä ei lähetetä palvelimelle

Sovelluksen tulee toimia mahdollisimman hyvin ainakin:

iPhone / Safari

Android / Chrome

iPad

Windows / Chrome / Edge

Mac / Safari / Chrome

2. Visuaalinen tyyli

Käytä ulkoasussa Opit soittamaan! -materiaalien ja bannerin tyyliä:

vaalea, raikas, lapsiystävällinen ilme

vihreä, vaaleanvihreä, valkoinen ja lämmin keltainen sävymaailma

selkeä, rauhallinen ja helposti hahmotettava käyttöliittymä

ei liian tekninen eikä liian levoton

Sovelluksen pitää tuntua samalta maailmalta kuin Opit soittamaan! -materiaalit.

3. Päätoiminto

Sovellus on ukulelen viritysmittari standardivireelle:

G4 = 392.00 Hz

C4 = 261.63 Hz

E4 = 329.63 Hz

A4 = 440.00 Hz

Viritysjärjestys automaattitilassa:

G → C → E → A

Huomio: kyseessä on tavallinen high-G ukulele, joten G-kieli ei ole matalin ääni.

4. Aloitusnäkymä

Näytä aloituksessa:

Otsikko

Ukuleleviritin

Lyhyt teksti

Viritetään ukulele helposti!

Suuri painike

ALOITA VIRITYS

Pienempi vaihtoehto

Valitse kieli itse

Kun käyttäjä aloittaa, pyydä mikrofonin käyttöoikeus ystävällisellä tekstillä:

Tarvitsen mikrofonin kuullakseni ukulelesi.

Painike:

SALLI MIKROFONI

Jos lupa evätään, näytä yksinkertainen ohje sen sallimiseksi.

5. Käyttötilat

Toteuta kaksi tilaa:

A) Automaattinen viritys

Lapselle suositeltu oletustila.

Sovellus ohjaa virityksen järjestyksessä:

G → C → E → A

B) Manuaalinen viritys

Käyttäjä voi valita itse viritettävän kielen.

Näytä isot painikkeet:

G C E A

6. Näkymä virityksen aikana

Näytä aina vain yksi selkeä tehtävä kerrallaan.

Esimerkiksi G-kielen kohdalla:

Suuri kirjain

G

Ohjeteksti

Soita G-kieltä

Visuaalinen ukulelen kaula/lapa

Näytä ohjelmaan sopiva grafiikka ukulelen lavasta ja kielistä.

Tämän grafiikan tehtävä on näyttää selvästi:

mitä kieltä soitetaan

mikä viritystappi liittyy siihen

Korosta aktiivinen kieli selvästi.

7. Mittari

Näytä suuri, helposti ymmärrettävä viritysmittari.

Rakenne:

keskellä = oikea vire

vasen puoli = liian matala

oikea puoli = liian korkea

Näytä:

selkeä viisari tai liikkuva osoitin

tilanneväri

lyhyt sanallinen ohje

Esimerkit:

Jos kieli on liian matala:

Alavire – kiristä kieltä vähän

Jos kieli on liian korkea:

Ylävire – löysää kieltä vähän

Jos se on melkein oikein:

Melkein oikein – säädä vähän

Jos se on oikein:

Vireessä!

Älä käytä lapsen päänäkymässä vaikeita teknisiä arvoja kuten cents-lukuja pääpainona. Halutessasi voit näyttää pienen tarkkuustiedon pienellä, mutta pääohjeen pitää olla sanallinen.

8. Sävelkorkeuden tunnistus

Toteuta luotettava sävelkorkeuden tunnistus ukulelelle.

Tärkeitä vaatimuksia:

tunnistaa ukulelen perustaajuuden

ei tartu helposti yläsäveliin

ei tee oktaavivirheitä

sietää hieman taustamelua

tasoittaa mittausta niin, ettei viisari hypi levottomasti

jos signaali on epäselvä, näytä esimerkiksi:

Soita kieli uudelleen

Älä siirrä viisaria villisti, jos signaali ei ole luotettava.

9. Milloin kieli hyväksytään vireeseen

Määrittele virityksen tilat esimerkiksi näin:

yli ±15 cents = selvästi väärin

±5–15 cents = melko lähellä

alle ±5 cents = vireessä

Sävel hyväksytään vireeseen vasta, kun se pysyy noin 600 ms tarpeeksi lähellä oikeaa säveltä.

Näin estetään se, että sovellus hyväksyy vireen vain hetkellisestä ohituksesta.

10. Konnahahmot vireen tason indikaattorina

Lisää käyttöliittymään kolme erillistä Opit soittamaan! -maailmaan sopivaa konnahahmokuvaa, jotka indikoivat vireen tasoa.

Käytä hahmoja näin:

A) Tosi väärä vire

Näytä konna kädet korvilla.

Tämä hahmo näkyy, kun kieli on selvästi pahasti pielessä.

Käyttömerkitys:

erittäin epävireessä

liian korkea tai liian matala reilusti

käyttäjälle tunne: “nyt pitää säätää enemmän”

Tekstin kanssa esimerkiksi:
Aika kaukana – säädä lisää

B) Aika lähellä virettä

Näytä tuumiva konna, sormi poskella.

Tämä hahmo näkyy, kun sävel on jo melko lähellä oikeaa, mutta ei vielä täysin kohdallaan.

Käyttömerkitys:

melkein oikein

pieni säätö vielä tarvitaan

käyttäjälle tunne: “hyvä, jatka vielä vähän”

Tekstin kanssa esimerkiksi:
Melkein oikein – säädä vähän

C) Oikea vire

Näytä iloinen peukkua näyttävä konna.

Tämä hahmo näkyy, kun kieli on vireessä.

Käyttömerkitys:

oikea vire löytyi

onnistumisen vahvistus

käyttäjälle tunne: “hyvä!”

Tekstin kanssa:
Vireessä!

11. Hahmojen käyttö käytännössä

Konnahahmo näkyy mittarin yhteydessä tai sen vieressä.

Logiikka:

selvästi väärä vire → kädet korvilla

lähes vireessä → sormi poskella

vireessä → iloinen peukku

Tee hahmojen vaihtumisesta selkeää mutta rauhallista.

Hahmot eivät saa olla liian hallitsevia, mutta niiden tulee olla helposti huomattavia ja lapselle emotionaalisesti ymmärrettäviä.

Ne tukevat lapsen ymmärrystä paremmin kuin pelkkä viisari.

12. Onnistuminen ja ääni

Kun kieli menee vireeseen:

mittari muuttuu vihreäksi

näytä teksti:

VIREESSÄ!

näytä iloinen peukkua näyttävä konna

soita lyhyt miellyttävä onnistumisääni

Onnistumisääni voi olla lyhyt, pehmeä “kilahdus” tai kyseisen kielen oikea sävel.

Huomioi kuitenkin, ettei sovellus tulkitse omaa kaiutinääntään mikrofonisignaaliksi. Voit pysäyttää analyysin hetkeksi onnistumisäänen ajaksi.

Lisää myös mahdollisuus mykistää äänet.

13. Siirtyminen seuraavaan kieleen

Kun yksi kieli on vireessä, näytä esimerkiksi:

Hienoa! G on vireessä.

Sen jälkeen:

Siirry seuraavaan kieleen: C

Näytä painike:

SEURAAVA

Voit halutessasi siirtyä automaattisesti pienen viiveen jälkeen, mutta käyttäjän pitää voida myös painaa itse.

Toista sama kaikkien kielten kohdalla:

G

C

E

A

14. Lopetusnäkymä

Kun kaikki neljä kieltä on viritetty, näytä:

iloinen peukkua näyttävä konna

onnistumisnäkymä

selkeä loppuohje

Teksti:

Hienoa! Ukulele on vireessä!

Lisäohje:

Soita kielet järjestyksessä: G – C – E – A.
Jos ne kuulostavat hyvältä, ukulele on valmis soittoon.

Painikkeet:

VIRITÄ UUDELLEEN

VALITSE KIELI

15. Ukulelen kaula/lapakuva

Käytä ohjelmaan sopivaa siistiä grafiikkaa ukulelen lavasta ja otelaudan alusta.

Grafiikan tehtävä on näyttää:

mikä kieli on aktiivinen

mihin kohtaan käyttäjän huomio kohdistuu

tarvittaessa mikä viritystappi siihen liittyy

Tämä grafiikka ei ole vain koriste, vaan toiminnallinen ohjausväline.

Aktiivinen kieli pitää korostaa selvästi.

16. Käytettävyys lapsille

Suunnittele käyttöliittymä niin, että myös pieni lapsi ymmärtää sen.

Periaatteet:

näytöllä vain vähän asiaa kerrallaan

yksi selkeä tehtävä kerrallaan

isot painikkeet

suuri fontti

sanalliset ohjeet

selkeä tunnepohjainen palaute hahmoilla

ei liikaa teknistä tekstiä

Tärkeimmät kolme kysymystä, joihin sovelluksen pitää vastata koko ajan:

Mitä kieltä soitan?

Onko se liian korkea vai liian matala?

Onko se jo oikein?

17. Responsiivisuus

Puhelimella pystysuuntainen asettelu:

otsikko

soitettava kieli

ukulelen grafiikka

mittari

konnahahmo

ohjeteksti

painikkeet

Tabletilla ja tietokoneella ukulelen kuva, mittari ja konnahahmo voivat olla osittain rinnakkain.

Tärkeää:

käyttäjän ei tarvitse zoomata

käyttäjän ei tarvitse vierittää kesken virityksen

kaikki olennainen näkyy yhdellä ruudulla

18. Yksityisyysteksti

Lisää sivulle pienellä mutta selkeästi löydettävällä tekstillä:

Mikrofonin ääntä käsitellään vain tällä laitteella. Ääntä ei tallenneta eikä lähetetä palvelimelle.

19. Kehitysprioriteetit

Tee ensin toimiva, luotettava ja helppo MVP.

Prioriteettijärjestys:

mikrofonin käyttö toimii hyvin

sävelkorkeuden tunnistus toimii luotettavasti

mittari toimii vakaasti

kielten ohjaus toimii lapselle ymmärrettävästi

konnahahmot indikoivat vireen tasoa selkeästi

ulkoasu viimeistellään brändin mukaiseksi

20. Ydinajatus

Tämä ei ole vain tekninen tuner-appi.

Tämä on Opit soittamaan! -maailmaan kuuluva, erittäin helppo, rohkaiseva ja lapselle ymmärrettävä ukuleleviritin, jossa:

ukulelen kuva näyttää mitä kieltä viritetään

mittari näyttää sävelen suunnan

konnahahmot kertovat tunnetasolla kuinka lähellä oikeaa virettä ollaan

lapsi saa selkeän onnistumiskokemuksen.

Lopputuloksen pitää tuntua siltä, että lapsi oikeasti uskaltaa käyttää sitä yksin.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://opi-soittamaan-ukulele-viritin.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/63bafdc5-7c65-483b-be84-816f08a2a842).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
