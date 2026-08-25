import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "./payload.config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const FRONTEND_ASSETS = path.resolve(
  dirname,
  "../../studio-kreando-website/src/assets",
);

function readAsset(filename: string) {
  const filePath = path.join(FRONTEND_ASSETS, filename);
  const data = fs.readFileSync(filePath);
  return {
    data,
    mimetype: "image/jpeg",
    name: filename,
    size: data.length,
  };
}

function richTextFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        children: [{ type: "text", text }],
      })),
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
    },
  };
}

async function run() {
  const payload = await getPayload({ config });

  console.log("Seeding categories...");
  const categoryNames = ["Residencial", "Comercial", "Interiorismo", "Urbano"];
  const categoryIds: Record<string, number> = {};
  for (const name of categoryNames) {
    const doc = await payload.create({ collection: "categories", data: { name } });
    categoryIds[name] = doc.id as number;
  }

  console.log("Seeding projects...");

  async function uploadMedia(filename: string, alt: string) {
    const file = readAsset(filename);
    const doc = await payload.create({ collection: "media", data: { alt }, file });
    return doc.id as number;
  }

  // 1/8 — Casa Adobe
  const casaAdobeCover = await uploadMedia(
    "project-1.jpg",
    "Fachada de hormigón de Casa Adobe al atardecer con alero profundo",
  );
  const casaAdobeGallery = [
    await uploadMedia("detail-1.jpg", "Detalle de encuentro entre hormigón encofrado y roble"),
    await uploadMedia("detail-3.jpg", "Galería interior con vanos rítmicos y luz rasante"),
    await uploadMedia("detail-2.jpg", "Baño de travertino con lavabo monolítico"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "casa-adobe",
      name: "Casa Adobe",
      category: categoryIds["Residencial"],
      year: 2025,
      location: "Cieneguilla, Lima",
      area: "410 m²",
      program: "Vivienda unifamiliar",
      team: "M. Ríos, A. Solano, C. Peña",
      status: "Construido",
      intro: "Una casa de hormigón visto que se abre al valle con un alero profundo.",
      body: richTextFromParagraphs([
        "El encargo pedía una vivienda que soportara el sol seco del valle sin recurrir a cerramientos opacos. La respuesta fue un volumen macizo perforado por un único gesto: un alero de nueve metros que sombrea toda la fachada norte y convierte la terraza en la habitación más usada de la casa.",
        "Los materiales se reducen a tres: hormigón encofrado con tabla, carpintería de acero negro y piso continuo pulido. La vegetación nativa hace el resto del trabajo.",
      ]),
      cover: casaAdobeCover,
      coverAlt: "Fachada de hormigón de Casa Adobe al atardecer con alero profundo",
      gallery: casaAdobeGallery.map((image, i) => ({
        image,
        alt: ["Detalle de encuentro entre hormigón encofrado y roble", "Galería interior con vanos rítmicos y luz rasante", "Baño de travertino con lavabo monolítico"][i],
      })),
      featured: true,
      order: 0,
    },
  });

  // 2/8 — Patio Olivo
  const patioOlivoCover = await uploadMedia(
    "project-2.jpg",
    "Patio interior encalado con olivo centenario y piso de piedra",
  );
  const patioOlivoGallery = [
    await uploadMedia("detail-2.jpg", "Baño de travertino iluminado por una ventana ranura"),
    await uploadMedia("detail-1.jpg", "Detalle de hormigón y madera bajo luz rasante"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "patio-olivo",
      name: "Patio Olivo",
      category: categoryIds["Residencial"],
      year: 2024,
      location: "Pachacámac, Lima",
      area: "285 m²",
      program: "Vivienda con patio central",
      team: "M. Ríos, L. Vergara",
      status: "Construido",
      intro: "Muros de cal encalada alrededor de un olivo centenario trasplantado.",
      body: richTextFromParagraphs([
        "Todo el proyecto gira alrededor de un árbol existente. Las habitaciones se ordenan en una U que abraza el patio, y cada una recibe luz por dos orientaciones distintas para cruzar ventilación durante el verano.",
        "La albañilería de piedra recuperada del terreno aparece solo en el muro perimetral, marcando el límite entre lo construido y lo encontrado.",
      ]),
      cover: patioOlivoCover,
      coverAlt: "Patio interior encalado con olivo centenario y piso de piedra",
      gallery: patioOlivoGallery.map((image, i) => ({
        image,
        alt: ["Baño de travertino iluminado por una ventana ranura", "Detalle de hormigón y madera bajo luz rasante"][i],
      })),
      featured: true,
      order: 1,
    },
  });

  // 3/8 — Casa Pinar
  const casaPinarCover = await uploadMedia(
    "project-3.jpg",
    "Sala minimalista con ventanales al bosque de pinos",
  );
  const casaPinarGallery = [
    await uploadMedia("detail-3.jpg", "Corredor con luz proyectada sobre piso de hormigón"),
    await uploadMedia("detail-1.jpg", "Detalle constructivo de hormigón y roble"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "casa-pinar",
      name: "Casa Pinar",
      category: categoryIds["Residencial"],
      year: 2024,
      location: "Cañete, Lima",
      area: "320 m²",
      program: "Casa de retiro",
      team: "A. Solano, D. Quiroz",
      status: "Construido",
      intro: "Un pabellón acristalado que desaparece dentro del bosque de pinos.",
      body: richTextFromParagraphs([
        "La casa se plantea como un único plano horizontal sostenido por cuatro apoyos. El vidrio de piso a techo elimina la frontera entre sala y bosque: el paisaje entra completo y el mobiliario se mantiene bajo para no interrumpirlo.",
        "El programa privado se hunde medio nivel en la pendiente, dejando la planta social como el único volumen visible desde el acceso.",
      ]),
      cover: casaPinarCover,
      coverAlt: "Sala minimalista con ventanales al bosque de pinos",
      gallery: casaPinarGallery.map((image, i) => ({
        image,
        alt: ["Corredor con luz proyectada sobre piso de hormigón", "Detalle constructivo de hormigón y roble"][i],
      })),
      featured: true,
      order: 2,
    },
  });

  // 4/8 — Museo de la Costa
  const museoCostaCover = await uploadMedia(
    "project-4.jpg",
    "Escalera de hormigón iluminada por un lucernario en el museo",
  );
  const museoCostaGallery = [
    await uploadMedia("detail-3.jpg", "Corredor de exposición con vanos rítmicos"),
    await uploadMedia("detail-1.jpg", "Detalle de hormigón encofrado con tabla"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "museo-costa",
      name: "Museo de la Costa",
      category: categoryIds["Comercial"],
      year: 2023,
      location: "Barranco, Lima",
      area: "1 850 m²",
      program: "Museo y archivo",
      team: "M. Ríos, C. Peña, equipo completo",
      status: "Construido",
      intro: "Salas de hormigón donde la luz cenital ordena el recorrido.",
      body: richTextFromParagraphs([
        "El museo trabaja con una sola herramienta: la luz. Un lucernario recorre el eje longitudinal y va marcando los cambios de sala; los muros de hormigón encofrado quedan sin tratamiento para recibir esa luz como única textura.",
        "La circulación es una espiral descendente que devuelve al visitante al vestíbulo sin repetir recorrido.",
      ]),
      cover: museoCostaCover,
      coverAlt: "Escalera de hormigón iluminada por un lucernario en el museo",
      gallery: museoCostaGallery.map((image, i) => ({
        image,
        alt: ["Corredor de exposición con vanos rítmicos", "Detalle de hormigón encofrado con tabla"][i],
      })),
      featured: true,
      order: 3,
    },
  });

  // 5/8 — Bloque Terracota
  const bloqueTerracotaCover = await uploadMedia(
    "project-5.jpg",
    "Fachada urbana con celosía vertical de terracota al atardecer",
  );
  const bloqueTerracotaGallery = [
    await uploadMedia("detail-3.jpg", "Corredor interior con luz controlada"),
    await uploadMedia("detail-1.jpg", "Detalle de materiales cálidos y hormigón"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "bloque-terracota",
      name: "Bloque Terracota",
      category: categoryIds["Comercial"],
      year: 2025,
      location: "San Isidro, Lima",
      area: "6 400 m²",
      program: "Uso mixto: oficinas y comercio",
      team: "A. Solano, L. Vergara, D. Quiroz",
      status: "En obra",
      intro: "Una celosía cerámica vertical que regula el sol de la avenida.",
      body: richTextFromParagraphs([
        "El edificio resuelve la orientación oeste con una celosía de piezas cerámicas extruidas que filtra la radiación directa sin cerrar las vistas. La cerámica se fabricó localmente en tres profundidades distintas según la altura.",
        "La planta baja se retira para donar una vereda ancha y sombreada a la ciudad, con locales que abren en toda su longitud.",
      ]),
      cover: bloqueTerracotaCover,
      coverAlt: "Fachada urbana con celosía vertical de terracota al atardecer",
      gallery: bloqueTerracotaGallery.map((image, i) => ({
        image,
        alt: ["Corredor interior con luz controlada", "Detalle de materiales cálidos y hormigón"][i],
      })),
      featured: true,
      order: 4,
    },
  });

  // 6/8 — Tienda Cal
  const tiendaCalCover = await uploadMedia(
    "project-6.jpg",
    "Interior de tienda minimalista en microcemento con luz indirecta",
  );
  const tiendaCalGallery = [
    await uploadMedia("detail-2.jpg", "Superficie monolítica de piedra en el probador"),
    await uploadMedia("detail-1.jpg", "Detalle de textura de microcemento y madera"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "tienda-cal",
      name: "Tienda Cal",
      category: categoryIds["Interiorismo"],
      year: 2024,
      location: "Miraflores, Lima",
      area: "140 m²",
      program: "Retail de autor",
      team: "C. Peña, L. Vergara",
      status: "Construido",
      intro: "Microcemento, curvas suaves y luz indirecta para una tienda de autor.",
      body: richTextFromParagraphs([
        "El local se resolvió con un único material continuo en muros y techos, de manera que la geometría curva se lea sin juntas. Todo el mobiliario expositivo es de acero inoxidable cepillado, deliberadamente frío frente al fondo cálido.",
        "La iluminación es indirecta salvo dos puntos: la mesa central y el nicho de novedades.",
      ]),
      cover: tiendaCalCover,
      coverAlt: "Interior de tienda minimalista en microcemento con luz indirecta",
      gallery: tiendaCalGallery.map((image, i) => ({
        image,
        alt: ["Superficie monolítica de piedra en el probador", "Detalle de textura de microcemento y madera"][i],
      })),
      featured: true,
      order: 5,
    },
  });

  // 7/8 — Plaza Abierta
  const plazaAbiertaCover = await uploadMedia(
    "project-7.jpg",
    "Pabellón público con columnas de acero y techo de madera en la plaza",
  );
  const plazaAbiertaGallery = [
    await uploadMedia("detail-3.jpg", "Recorrido cubierto con sombras alargadas"),
    await uploadMedia("detail-1.jpg", "Detalle de madera y hormigón del pórtico"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "plaza-abierta",
      name: "Plaza Abierta",
      category: categoryIds["Urbano"],
      year: 2023,
      location: "Trujillo, La Libertad",
      area: "3 200 m²",
      program: "Espacio público y pabellón",
      team: "M. Ríos, D. Quiroz",
      status: "Construido",
      intro: "Un pórtico de acero y madera que da sombra a la vida de barrio.",
      body: richTextFromParagraphs([
        "La intervención sustituye un estacionamiento por una plaza continua de losas de concreto y arbolado nuevo. El único elemento construido es un pórtico ligero que produce sombra durante todo el día y aloja ferias, clases y mercados.",
        "La estructura de acero se dejó vista, con cubierta de vigas de madera laminada a la vista para bajar la temperatura percibida.",
      ]),
      cover: plazaAbiertaCover,
      coverAlt: "Pabellón público con columnas de acero y techo de madera en la plaza",
      gallery: plazaAbiertaGallery.map((image, i) => ({
        image,
        alt: ["Recorrido cubierto con sombras alargadas", "Detalle de madera y hormigón del pórtico"][i],
      })),
      featured: false,
      order: 6,
    },
  });

  // 8/8 — Casa Niebla
  const casaNieblaCover = await uploadMedia(
    "project-8.jpg",
    "Casa de madera oscura en voladizo sobre acantilado con neblina",
  );
  const casaNieblaGallery = [
    await uploadMedia("detail-2.jpg", "Interior de piedra con luz filtrada"),
    await uploadMedia("detail-3.jpg", "Pasillo con secuencia de vanos hacia el mar"),
  ];
  await payload.create({
    collection: "projects",
    data: {
      slug: "casa-niebla",
      name: "Casa Niebla",
      category: categoryIds["Residencial"],
      year: 2026,
      location: "Asia, Cañete",
      area: "265 m²",
      program: "Casa de acantilado",
      team: "A. Solano, C. Peña",
      status: "En proyecto",
      intro: "Un volumen oscuro en voladizo sobre un zócalo de piedra del lugar.",
      body: richTextFromParagraphs([
        "La casa se apoya en un zócalo de piedra extraída del propio corte del terreno y lanza el nivel social en voladizo sobre la pendiente, buscando el horizonte por encima de la neblina costera.",
        "El revestimiento de madera quemada envejecerá igualando el tono de la roca, hasta que la casa se lea como parte del acantilado.",
      ]),
      cover: casaNieblaCover,
      coverAlt: "Casa de madera oscura en voladizo sobre acantilado con neblina",
      gallery: casaNieblaGallery.map((image, i) => ({
        image,
        alt: ["Interior de piedra con luz filtrada", "Pasillo con secuencia de vanos hacia el mar"][i],
      })),
      featured: false,
      order: 7,
    },
  });

  console.log("Seeding home global...");
  const heroImageId = await uploadMedia(
    "project-1.jpg",
    "Casa Adobe: fachada de hormigón visto al atardecer entre vegetación",
  );
  const serviceAId = await uploadMedia("project-3.jpg", "Diseño arquitectónico");
  const serviceBId = await uploadMedia("detail-2.jpg", "Interiorismo");
  const serviceCId = await uploadMedia("project-7.jpg", "Espacio público");
  const serviceDId = await uploadMedia("studio-team.jpg", "Dirección de obra");

  await payload.updateGlobal({
    slug: "home",
    data: {
      heroHeadline: "Diseñamos espacios que inspiran y perduran",
      heroSubtext:
        "Convertimos visiones en arquitectura atemporal, uniendo diseño sensible con una ejecución impecable en obra.",
      heroImage: heroImageId,
      heroCtaPrimaryLabel: "Agendar una consulta gratuita",
      heroCtaSecondaryLabel: "Ver portafolio",
      aboutHeading: "Sobre el estudio",
      aboutText:
        "En KreanDDo Arquitectos creemos que la arquitectura es más que construir: se trata de crear entornos que mejoran la manera en que vivimos. Trabajamos pocos encargos al año para estar en obra cada semana.",
      aboutCtaLabel: "Conocer el estudio",
      stats: [
        { value: "15+", label: "Años de excelencia en arquitectura y diseño" },
        { value: "38", label: "Proyectos construidos y entregados" },
        { value: "96%", label: "De clientes que vuelven con un segundo encargo" },
        { value: "5", label: "Regiones del país con obra nuestra" },
      ],
      services: [
        { number: "01", title: "Diseño arquitectónico", description: "Desde el análisis de sitio hasta el proyecto definitivo.", image: serviceAId },
        { number: "02", title: "Interiorismo", description: "Espacios interiores coherentes, con mobiliario a medida.", image: serviceBId },
        { number: "03", title: "Espacio público", description: "Diseñamos lo que ocurre entre los edificios y el paisaje.", image: serviceCId },
        { number: "04", title: "Dirección de obra", description: "Supervisión semanal, control de acabados y cierre técnico.", image: serviceDId },
      ],
      credits: [{ name: "Bienal Peruana" }, { name: "Arquine" }, { name: "Casacor" }, { name: "ArchDaily" }],
      portfolioHeading: "Nuestro portafolio de diseño",
      portfolioText:
        "Una selección de obra que muestra nuestro compromiso con la excelencia del detalle y la satisfacción de cada cliente.",
      ctaHeading: "¿Tienes un terreno, una idea o un espacio por transformar?",
      ctaText: "Escríbenos y agendamos una primera conversación sin costo.",
      ctaButtonLabel: "Hablemos de tu proyecto",
    },
  });

  console.log("Seeding about global...");
  const aboutHeroId = await uploadMedia(
    "studio-team.jpg",
    "Equipo del estudio trabajando con maquetas y planos sobre una mesa larga",
  );
  const aboutDetailId = await uploadMedia(
    "detail-1.jpg",
    "Detalle de hormigón encofrado en contacto con paneles de roble",
  );

  await payload.updateGlobal({
    slug: "about",
    data: {
      heroImage: aboutHeroId,
      heroHeadline: "Seis personas, un método y muchas horas en obra",
      heroSubtext:
        "No perseguimos un estilo: perseguimos que una casa esté fresca en verano, que un muro envejezca bien y que la obra se parezca al plano.",
      introParagraphs: [
        { text: "KreanDDo Arquitectos se fundó en Lima en 2011. Somos seis personas y trabajamos con un número deliberadamente bajo de encargos al año para poder estar en obra cada semana." },
        { text: "Nos interesan los proyectos donde el material está disponible cerca: piedra del corte, cerámica extruida en la región, maderas de la costa. Eso define más el resultado que cualquier referencia visual." },
        { text: "Trabajamos con especialistas estructurales, paisajistas y de iluminación desde la primera semana del proyecto, no al final." },
      ],
      services: [
        { number: "01", title: "Anteproyecto y diseño", description: "Análisis de sitio, programa y volumetría hasta el proyecto definitivo." },
        { number: "02", title: "Proyecto ejecutivo", description: "Planos, detalles constructivos, especificaciones y coordinación de especialidades." },
        { number: "03", title: "Dirección de obra", description: "Supervisión semanal, control de acabados y cierre técnico." },
        { number: "04", title: "Interiorismo y mobiliario", description: "Diseño a medida, materiales y desarrollo con carpinterías locales." },
      ],
      milestones: [
        { year: "2011", text: "Fundación del estudio en Barranco" },
        { year: "2017", text: "Primer proyecto público construido" },
        { year: "2021", text: "Mención en la Bienal de Arquitectura Peruana" },
        { year: "2025", text: "38 proyectos construidos en cinco regiones" },
      ],
      detailImage: aboutDetailId,
      ctaLabel: "Conversemos un proyecto",
    },
  });

  console.log("Seeding contact global...");
  await payload.updateGlobal({
    slug: "contact",
    data: {
      address: "Av. Pedro de Osma 214, piso 3\nBarranco, Lima, Perú",
      email: "estudio@kreanddo.com",
      phone: "+51 1 234 567",
      hours: "Lunes a viernes\n9:00 — 18:00",
    },
  });

  console.log("Seeding siteSettings global...");
  await payload.updateGlobal({
    slug: "siteSettings",
    data: {
      siteName: "KreanDDo Arquitectos",
      siteUrl: "https://www.kreanddo.com",
      defaultSeoDescription:
        "Estudio de arquitectura en Lima: vivienda, comercio, interiorismo y espacio público.",
    },
  });

  console.log("Seed complete.");
  process.exit(0);
}

// `payload run` dynamically imports this module and treats the import as
// finished as soon as top-level synchronous execution completes — it does
// NOT wait for a fire-and-forget promise. Without a top-level await here,
// the CLI would call process.exit(0) before run() ever reaches its first
// `await`, so the seed silently never executes.
await run().catch((err) => {
  console.error(err);
  process.exit(1);
});
