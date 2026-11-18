import { Link } from "react-router";
import NexoraLogo from "../components/brand/NexoraLogo";
import CampusArtwork from "../components/brand/CampusArtwork";
import AppIcon from "../components/ui/AppIcon";
import type { AppIconName } from "../types/navigation";

const whatsappUrl =
  "https://wa.me/591611700006?text=" +
  encodeURIComponent(
    "Hola, quiero información sobre la formación y los horarios de NEXORA.",
  );

const areas: {
  number: string;
  title: string;
  icon: AppIconName;
  description: string;
  detail: string;
}[] = [
  {
    number: "01",
    title: "Programación",
    icon: "code",
    description:
      "Desarrolla tu pensamiento lógico y aprende a construir soluciones mediante código.",
    detail: "Lógica · Desarrollo de software · Resolución de problemas",
  },
  {
    number: "02",
    title: "Bases de datos",
    icon: "database",
    description:
      "Comprende cómo organizar, consultar y trabajar con la información que utilizan las aplicaciones.",
    detail: "Datos · Consultas · Organización de información",
  },
  {
    number: "03",
    title: "Matemáticas y ciencias",
    icon: "science",
    description:
      "Refuerza los conceptos que necesitas y aborda tus ejercicios con mayor comprensión.",
    detail: "Apoyo académico · Matemáticas · Ciencias puras",
  },
];
const benefits = [
  {
    title: "Aprende a tu ritmo de vida",
    description:
      "Modalidad virtual y opciones de horario en la mañana, tarde y noche.",
  },
  {
    title: "Acompañamiento para avanzar",
    description:
      "Tutorías gratuitas para resolver dudas y reforzar tu aprendizaje.",
  },
  {
    title: "Una formación a tu alcance",
    description:
      "Mensualidades accesibles. Consulta los costos y requisitos con nuestro equipo.",
  },
];

export default function PublicHomePage() {
  return (
    <div className="public-campus">
      <a href="#contenido-publico" className="skip-link">
        Saltar al contenido
      </a>
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" aria-label="NEXORA, inicio">
            <NexoraLogo />
          </Link>
          <nav aria-label="Navegación pública" className="public-nav">
            <div className="public-section-nav">
              <a href="#formacion" className="nav-section-link">
                Formación
              </a>
              <a href="#nosotros" className="nav-section-link">
                Nosotros
              </a>
              <a href="#contacto" className="nav-section-link">
                Contacto
              </a>
            </div>
            <div className="public-account-nav">
              <Link to="/login" className="nav-campus">
                Aula virtual
              </Link>
              <Link to="/registro" className="btn-primary">
                Postularme <AppIcon name="arrow" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="contenido-publico" tabIndex={-1}>
        <section className="public-hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">DESDE LA PAZ, HACIA TU FUTURO</p>
            <h1 id="hero-title">
              Tu talento.
              <br />
              Nuevas ideas.
              <br />
              <span>Más posibilidades.</span>
            </h1>
            <p className="hero-description">
              Formación técnica en programación y bases de datos, con apoyo
              académico en matemáticas y ciencias. Conecta lo que te apasiona
              con lo que viene.
            </p>
            <div className="hero-actions">
              <Link to="/registro" className="btn-primary">
                Quiero ser parte <AppIcon name="arrow" />
              </Link>
              <a href="#formacion" className="hero-link">
                Explorar formación <AppIcon name="arrow" />
              </a>
            </div>
            <p className="hero-note">
              <AppIcon name="check" /> Modalidad virtual. Acompañamiento real.
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <div className="hero-image-top" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <img
                src="/images/nexora-hero.png"
                alt="Ilustración de tecnología y ciencias con una computadora, bases de datos y montañas andinas"
                width={1536}
                height={1024}
                fetchPriority="high"
              />
              <div className="hero-image-caption">
                <span>TECNOLOGÍA · CIENCIA · FUTURO</span>
                <AppIcon name="arrow" />
              </div>
            </div>
            <div className="hero-sticker">
              <span>
                <AppIcon name="book" />
              </span>
              <div>
                <strong>Un siguiente paso, contigo.</strong>
                <small>Formación técnica desde Bolivia</small>
              </div>
            </div>
          </div>
        </section>

        <div
          className="benefit-strip"
          aria-label="Beneficios de estudiar en NEXORA"
        >
          <div>
            <p>
              <AppIcon name="grid" /> Modalidad virtual
            </p>
            <p>
              <AppIcon name="calendar" /> Tres turnos disponibles
            </p>
            <p>
              <AppIcon name="wallet" /> Mensualidades accesibles
            </p>
            <p>
              <AppIcon name="users" /> Tutorías gratuitas
            </p>
          </div>
        </div>

        <section
          id="formacion"
          className="public-section"
          aria-labelledby="formation-title"
        >
          <div className="section-intro">
            <div>
              <p className="eyebrow">ENCUENTRA TU CAMINO</p>
              <h2 id="formation-title">Conocimiento que abre puertas.</h2>
            </div>
            <p>
              Explora nuestras áreas de formación técnica y apoyo académico.
              Consulta los programas, niveles y horarios disponibles.
            </p>
          </div>
          <div className="formation-grid">
            {areas.map((area) => (
              <article key={area.number} className="formation-card">
                <div className="formation-card-top">
                  <AppIcon name={area.icon} />
                  <span>ÁREA / {area.number}</span>
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <p className="formation-detail">{area.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="nosotros"
          className="public-section about-section"
          aria-labelledby="about-title"
        >
          <div className="about-art">
            <p>NEXORA / LA PAZ, BOLIVIA</p>
            <CampusArtwork />
            <strong>Aprende. Conecta. Avanza.</strong>
          </div>
          <div className="about-copy">
            <p className="eyebrow">UNA COMUNIDAD PARA CRECER</p>
            <h2 id="about-title">
              Tu próxima oportunidad empieza aprendiendo.
            </h2>
            <p>
              Desde La Paz, Bolivia, acercamos la formación técnica y el apoyo
              académico a quienes quieren desarrollar nuevas habilidades y
              fortalecer sus conocimientos.
            </p>
            <div className="about-benefits">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <AppIcon name="check" />
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contacto"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="contact-inner">
            <div>
              <p className="eyebrow">HABLEMOS DE TU SIGUIENTE PASO</p>
              <h2 id="contact-title">
                Las buenas ideas
                <br />
                empiezan conversando.
              </h2>
              <p>
                Cuéntanos qué te gustaría aprender. Te orientamos sobre
                requisitos, costos y horarios antes de iniciar tu postulación.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Conversar por WhatsApp <AppIcon name="arrow" />
              </a>
            </div>
            <address className="contact-details">
              <dl>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +591 611700006
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>
                    <a href="mailto:nexora@edu.bo">nexora@edu.bo</a>
                  </dd>
                </div>
                <div>
                  <dt>Ubicación</dt>
                  <dd>La Paz, Bolivia</dd>
                </div>
                <div>
                  <dt>Turnos</dt>
                  <dd>Mañana · Tarde · Noche</dd>
                </div>
              </dl>
            </address>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <NexoraLogo />
        <p>NEXORA · La Paz, Bolivia</p>
        <Link to="/login">Acceder al aula virtual →</Link>
      </footer>
    </div>
  );
}
