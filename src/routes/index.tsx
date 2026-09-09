import { createFileRoute, Link } from "@tanstack/react-router";
import { BASSO, KITARA, UKULELE } from "@/lib/instruments";
import logo from "@/assets/logo.png.asset.json";
import kannelKonna from "@/assets/kannel-konna.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Opit soittamaan! -viritysmittari" },
      {
        name: "description",
        content:
          "Valitse soitin ja viritä se selaimessa: ukulele, kitara, basso ja kannel. Ääni käsitellään vain omalla laitteella.",
      },
      { property: "og:title", content: "Opit soittamaan! -viritysmittari" },
      {
        property: "og:description",
        content: "Helppo viritysmittari lapsille – ukulele, kitara, basso ja kannel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Etusivu,
});

const READY = [UKULELE, KITARA, BASSO, KANNEL];

function Etusivu() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <img src={logo.url} alt="Opit soittamaan!" className="h-12 w-12 sm:h-16 sm:w-16" />
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-primary sm:text-3xl">
            Opit soittamaan! -viritysmittari
          </h1>
          <a
            href="https://www.opitsoittamaan.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs font-bold text-muted-foreground underline hover:text-primary sm:text-sm"
          >
            www.opitsoittamaan.fi
          </a>
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center py-6">
        <h2 className="mb-4 text-center text-lg font-extrabold text-foreground sm:text-xl">
          Valitse soitin
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {READY.map((i) => (
            <Link
              key={i.slug}
              to={i.slug === "ukulele" ? "/ukulele" : i.slug === "kitara" ? "/kitara" : "/basso"}
              className="card-soft flex flex-col items-center gap-2 p-3 transition-transform hover:scale-[1.03] sm:p-4"
            >
              <img
                src={i.cover}
                alt={`Konna virittää ${i.name.toLowerCase()}a`}
                className="h-32 w-auto object-contain sm:h-44"
              />
              <span className="font-display text-lg font-extrabold text-primary sm:text-xl">
                {i.name}
              </span>
            </Link>
          ))}
          {COMING.map((i) => (
            <div
              key={i.slug}
              className="card-soft flex flex-col items-center gap-2 p-3 opacity-60 sm:p-4"
            >
              <img
                src={kannelKonna.url}
                alt="Konna ja kannel"
                className="h-32 w-auto object-contain sm:h-44"
              />
              <span className="font-display text-lg font-extrabold text-primary sm:text-xl">
                {i.name}
              </span>
              <span className="text-xs font-bold text-muted-foreground">Tulossa pian</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
        <p>
          Mikrofonin ääntä käsitellään vain tällä laitteella. Ääntä ei tallenneta eikä lähetetä
          palvelimelle.
        </p>
      </footer>
    </main>
  );
}
