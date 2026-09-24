export type Marker = {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  blurb: string;
};

export const LOCATIONS: Marker[] = [
  {
    id: "madrid",
    name: "VANT HQ",
    city: "Madrid",
    region: "EU",
    lat: 40.4168,
    lon: -3.7038,
    blurb: "Núcleo operativo. Cultura, tickets y control plane.",
  },
  {
    id: "mexico",
    name: "LATAM North",
    city: "Ciudad de México",
    region: "LATAM",
    lat: 19.4326,
    lon: -99.1332,
    blurb: "Comunidad y tryouts de la franja norte.",
  },
  {
    id: "bogota",
    name: "Andes Desk",
    city: "Bogotá",
    region: "LATAM",
    lat: 4.711,
    lon: -74.0721,
    blurb: "Scouting y roster de montaña.",
  },
  {
    id: "buenosaires",
    name: "Sur",
    city: "Buenos Aires",
    region: "LATAM",
    lat: -34.6037,
    lon: -58.3816,
    blurb: "Scrims nocturnos y contenido.",
  },
  {
    id: "saopaulo",
    name: "Atlantic",
    city: "São Paulo",
    region: "LATAM",
    lat: -23.5505,
    lon: -46.6333,
    blurb: "Circuito abierto y cupos de bracket.",
  },
  {
    id: "nyc",
    name: "Atlantic West",
    city: "Nueva York",
    region: "NA",
    lat: 40.7128,
    lon: -74.006,
    blurb: "Puente NA · eventos y partners.",
  },
  {
    id: "london",
    name: "North Sea",
    city: "Londres",
    region: "EU",
    lat: 51.5074,
    lon: -0.1278,
    blurb: "Ranked EU y briefings de temporada.",
  },
  {
    id: "berlin",
    name: "Central",
    city: "Berlín",
    region: "EU",
    lat: 52.52,
    lon: 13.405,
    blurb: "Ops de torneo y legal OS.",
  },
  {
    id: "tokyo",
    name: "Pacific",
    city: "Tokio",
    region: "APAC",
    lat: 35.6762,
    lon: 139.6503,
    blurb: "Ventana APAC y VOD review.",
  },
  {
    id: "seoul",
    name: "Han",
    city: "Seúl",
    region: "APAC",
    lat: 37.5665,
    lon: 126.978,
    blurb: "Alta densidad competitiva.",
  },
  {
    id: "dubai",
    name: "Gulf",
    city: "Dubái",
    region: "MENA",
    lat: 25.2048,
    lon: 55.2708,
    blurb: "Nodo MENA y invitational.",
  },
  {
    id: "capetown",
    name: "Cape",
    city: "Ciudad del Cabo",
    region: "AF",
    lat: -33.9249,
    lon: 18.4241,
    blurb: "Puerta africana al circuito.",
  },
];
