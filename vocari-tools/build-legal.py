import os
def page(fn, lang, title, desc, other, body):
    es = lang=='es'
    nav = (f'<a href="{other}" hreflang="en" lang="en">EN</a><a href="app.html"><b>Abrir app</b></a>' if es
           else f'<a href="{other}" hreflang="es" lang="es">ES</a><a href="app.html"><b>Open app</b></a>')
    home = './' if es else 'en.html'
    foot = (f'<a href="./">Inicio</a><a href="privacidad.html">Privacidad</a><a href="terminos.html">Términos</a><a href="reembolsos.html">Reembolsos</a><a data-site="mailto">Contacto</a>' if es
            else f'<a href="en.html">Home</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="refunds.html">Refunds</a><a data-site="mailto">Contact</a>')
    upd = 'Última actualización: <span data-site="updated"></span>' if es else 'Last updated: <span data-site="updatedEn"></span>'
    html = f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Vocari</title>
<meta name="description" content="{desc}">
<link rel="alternate" hreflang="{'en' if es else 'es'}" href="{other}">
<link rel="icon" href="icon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="stylesheet" href="site.css">
</head>
<body>
<div class="wrap"><header class="top"><a class="logo" href="{home}"><img src="icon.svg" alt=""> Vocari</a><nav>{nav}</nav></header></div>
<main class="legal">
<h1>{title}</h1>
<p class="upd">{upd}</p>
{body.strip()}
</main>
<footer><div class="wrap"><p>{foot}</p><p>© 2026 <span data-site="owner"></span> · Chile</p></div></footer>
<script src="site.js"></script>
</body>
</html>
'''
    open(fn,'w').write(html)

MAIL='<a data-site="mailto"></a>'

# ---------------- PRIVACIDAD (ES) ----------------
page('privacidad.html','es','Política de privacidad','Cómo Vocari trata tus datos: sin cuentas, sin rastreo, todo en tu dispositivo.','privacy.html',f'''
<div class="box"><b>En resumen:</b> Vocari no tiene cuentas, ni anuncios, ni analítica, ni cookies de seguimiento. Lo que escribes, las fotos que agregas y las frases que dices <b>se quedan en tu dispositivo y nunca nos llegan</b>. Si compras una membresía o la guía, el pago lo procesa nuestro revendedor Paddle y nosotros solo recibimos los datos mínimos para darte el servicio. No vendemos ni compartimos datos con fines publicitarios.</div>

<h2>1. Responsable y contacto</h2>
<p>El responsable del tratamiento es <b>Vocari</b>, proyecto con domicilio en <b>Chile</b> (en adelante, "Vocari", "nosotros"). Para cualquier consulta o para ejercer tus derechos escribe a {MAIL}. No estamos obligados a designar un delegado de protección de datos; este correo cumple esa función de contacto.</p>

<h2>2. Normas que aplicamos</h2>
<p>Vocari está disponible en todo el mundo. Esta política está pensada para cumplir, en lo que corresponda a cada usuario, con: la Ley N° 19.628 sobre Protección de la Vida Privada de Chile y la Ley N° 21.719 que la reemplaza a partir de su entrada en vigencia; el Reglamento General de Protección de Datos de la UE (RGPD) y el UK GDPR; la Ley General de Protección de Datos de Brasil (LGPD); la California Consumer Privacy Act modificada por la CPRA (CCPA) y la Children's Online Privacy Protection Act (COPPA) de EE. UU.; y las leyes de protección de datos de Argentina (Ley 25.326), Colombia (Ley 1581 de 2012), México (LFPDPPP), Perú (Ley 29733) y demás países de Latinoamérica. Si la ley de tu país te da más derechos, se aplican esos.</p>

<h2>3. Datos que se quedan en tu dispositivo (no los recibimos)</h2>
<ul>
  <li>Perfiles, tableros, botones, fotos, frases guardadas, historial reciente y estadísticas de uso.</li>
  <li>Ajustes: idioma, voz, velocidad, tamaño, tema y bloqueo.</li>
</ul>
<p>Se guardan en el almacenamiento local del navegador. Este contenido puede revelar información sensible (por ejemplo, sobre salud o discapacidad), y por eso decidimos <b>no recibirlo nunca</b>. La voz la genera el motor de texto a voz de tu sistema operativo (Google, Apple, Microsoft u otro), que se rige por sus propias políticas. Si borras los datos del navegador o desinstalas la app, esta información se pierde: usa "Exportar todo" para tener un respaldo.</p>

<h2>4. Datos que tratamos y para qué</h2>
<table class="compare">
<tr><th>Datos</th><th>Finalidad</th><th>Base legal</th></tr>
<tr><td>Correo, nombre, país y datos de la compra que nos comparte Paddle (nunca vemos el número de tu tarjeta)</td><td>Activar tu membresía o entregarte la guía, dar soporte y atender reembolsos</td><td>Ejecución del contrato (RGPD art. 6.1.b; LGPD art. 7.V)</td></tr>
<tr><td>Identificadores internos de Paddle (suscripción y cliente) y tu plan, guardados en tu "código de membresía"</td><td>Comprobar, como máximo una vez al día, que tu membresía sigue activa</td><td>Ejecución del contrato</td></tr>
<tr><td>Registros de ventas y pagos recibidos</td><td>Cumplir obligaciones contables y tributarias en Chile</td><td>Obligación legal (RGPD art. 6.1.c)</td></tr>
<tr><td>Dirección IP y datos técnicos de conexión (registros del servidor)</td><td>Seguridad y prevención de abusos y fraude</td><td>Interés legítimo (RGPD art. 6.1.f)</td></tr>
<tr><td>Correos que nos envías (soporte, becas)</td><td>Responderte y, si corresponde, otorgar una beca</td><td>Tu solicitud / consentimiento</td></tr>
</table>
<p>No usamos tus datos para publicidad, no creamos perfiles y no tomamos decisiones automatizadas que te afecten.</p>

<h2>5. Proveedores y transferencias internacionales</h2>
<p>No vendemos, alquilamos ni "compartimos" (en el sentido de la CCPA) datos personales. Solo intervienen:</p>
<ul>
  <li><b>Paddle.com Market Ltd</b> (Reino Unido) y sus filiales: es nuestro revendedor y "Merchant of Record". Vende la membresía y la guía en nuestro nombre, procesa los pagos, calcula y declara los impuestos y emite las facturas. Para esos fines, Paddle actúa como responsable independiente de tus datos de pago. <a href="https://www.paddle.com/legal/privacy" rel="noopener">Política de privacidad de Paddle</a>.</li>
  <li><b>Vercel Inc.</b> (EE. UU.): alojamiento del sitio y de las funciones de pago. <a href="https://vercel.com/legal/privacy-policy" rel="noopener">Política de Vercel</a>.</li>
</ul>
<p>Estos proveedores pueden tratar datos fuera de tu país, incluido EE. UU. Las transferencias se protegen con las garantías que ellos ofrecen, como el Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión Europea. También podemos revelar datos si una autoridad competente lo exige conforme a la ley.</p>

<h2>6. Conservación</h2>
<ul>
  <li>Datos de facturación: mientras tengas una suscripción y luego durante el plazo que exige la ley tributaria chilena (en general, 6 años).</li>
  <li>Correos de soporte y becas: hasta 24 meses.</li>
  <li>Registros técnicos del servidor: el plazo breve que define el proveedor de alojamiento.</li>
</ul>

<h2>7. Tus derechos</h2>
<p>Según tu país, puedes pedir <b>acceso</b>, <b>rectificación</b>, <b>supresión</b>, <b>oposición</b>, <b>portabilidad</b>, <b>limitación</b> del tratamiento y <b>no ser objeto de decisiones automatizadas</b> (derechos ARCO y derechos del RGPD, la LGPD y la Ley 21.719). Si estás en California, tienes derecho a saber qué datos tratamos, a corregirlos, a eliminarlos y a no ser discriminado por ejercer tus derechos; como no vendemos ni compartimos datos, no hace falta que pidas la exclusión. Escribe a {MAIL} desde el correo con el que pagaste. Respondemos en un máximo de 30 días, o en el plazo menor que fije tu ley. Ejercer tus derechos es gratis.</p>
<p>Si no quedas conforme, puedes reclamar ante la autoridad de control de tu país: en Chile, la Agencia de Protección de Datos Personales cuando entre en funciones (y, mientras tanto, los tribunales de justicia); en la UE, la autoridad de protección de datos de tu Estado; en Brasil, la ANPD; en Argentina, la AAIP; en Colombia, la SIC.</p>

<h2>8. Niños y niñas</h2>
<p>Vocari puede ser usada por niños, niñas y personas con discapacidad, bajo la supervisión de un adulto. Como no creamos cuentas ni recibimos el contenido de la app, <b>no recopilamos datos personales de menores</b> (COPPA, art. 8 del RGPD y normas equivalentes). Solo adultos con capacidad legal pueden contratar membresías: padres, tutores, terapeutas o instituciones. Si crees que un menor nos envió datos, escríbenos y los eliminaremos.</p>

<h2>9. Seguridad</h2>
<p>Usamos conexiones cifradas (HTTPS) y códigos de membresía firmados criptográficamente, y no guardamos datos de tarjetas. Ningún sistema es 100% seguro. Si ocurriera una brecha que afecte tus datos, te avisaremos a ti y a las autoridades en los plazos legales.</p>

<h2>10. Cookies y almacenamiento local</h2>
<p>Vocari no usa cookies propias de seguimiento ni de publicidad. Solo usa el almacenamiento local del navegador, estrictamente necesario para que la app funcione. Durante el pago, Paddle puede usar sus propias cookies, necesarias para el checkout y la prevención del fraude.</p>

<h2>11. Cambios</h2>
<p>Si cambiamos esta política, actualizaremos la fecha de arriba. Si el cambio es relevante y tienes una membresía, te avisaremos por correo antes de que entre en vigor.</p>
''')

# ---------------- PRIVACY (EN) ----------------
page('privacy.html','en','Privacy Policy',"How Vocari handles your data: no accounts, no tracking, everything on your device.",'privacidad.html',f'''
<div class="box"><b>In short:</b> Vocari has no accounts, ads, analytics or tracking cookies. What you type, the photos you add and the phrases you speak <b>stay on your device and never reach us</b>. If you buy a membership or the guide, payment is handled by our reseller Paddle and we only receive the minimum data needed to provide the service. We do not sell or share data for advertising.</div>

<h2>1. Controller and contact</h2>
<p>The data controller is <b>Vocari</b>, a project based in <b>Chile</b> ("Vocari", "we"). For any question or to exercise your rights, email {MAIL}. We are not required to appoint a Data Protection Officer; this address serves as our privacy contact.</p>

<h2>2. Laws we follow</h2>
<p>Vocari is available worldwide. This policy is designed to comply, as applicable to each user, with Chile's Law 19,628 on the Protection of Private Life and Law 21,719 replacing it once in force; the EU General Data Protection Regulation (GDPR) and UK GDPR; Brazil's LGPD; the California Consumer Privacy Act as amended by the CPRA (CCPA) and the Children's Online Privacy Protection Act (COPPA); and the data protection laws of Argentina, Colombia, Mexico, Peru and other countries. If your local law gives you more rights, those apply.</p>

<h2>3. Data that stays on your device (we never receive it)</h2>
<ul>
  <li>Profiles, boards, buttons, photos, saved phrases, recent history and usage statistics.</li>
  <li>Settings: language, voice, speed, size, theme and lock.</li>
</ul>
<p>It is stored in your browser's local storage. Because this content may reveal sensitive information (for example about health or disability), we chose <b>never to receive it</b>. Speech is generated by your operating system's text-to-speech engine (Google, Apple, Microsoft or other), governed by their own policies. If you clear your browser data or uninstall the app, this information is lost: use "Export all" to keep a backup.</p>

<h2>4. Data we process and why</h2>
<table class="compare">
<tr><th>Data</th><th>Purpose</th><th>Legal basis</th></tr>
<tr><td>Email, name, country and purchase details shared with us by Paddle (we never see your card number)</td><td>Activate your membership or deliver the guide, support and refunds</td><td>Performance of contract (GDPR 6.1.b; LGPD 7.V)</td></tr>
<tr><td>Internal Paddle identifiers (subscription and customer) and your plan, stored in your "membership code"</td><td>Check, at most once a day, that your membership is active</td><td>Performance of contract</td></tr>
<tr><td>Sales and payout records</td><td>Accounting and tax obligations in Chile</td><td>Legal obligation (GDPR 6.1.c)</td></tr>
<tr><td>IP address and technical connection data (server logs)</td><td>Security, abuse and fraud prevention</td><td>Legitimate interest (GDPR 6.1.f)</td></tr>
<tr><td>Emails you send us (support, scholarships)</td><td>Reply to you and, where applicable, grant a scholarship</td><td>Your request / consent</td></tr>
</table>
<p>We do not use your data for advertising, profiling or automated decisions that affect you.</p>

<h2>5. Service providers and international transfers</h2>
<p>We do not sell, rent or "share" (as defined by the CCPA) personal information. Only these providers are involved:</p>
<ul>
  <li><b>Paddle.com Market Ltd</b> (UK) and its affiliates: our reseller and Merchant of Record. Paddle sells the membership and the guide on our behalf, processes payments, handles sales taxes and issues invoices, acting as an independent controller of your payment data for those purposes. <a href="https://www.paddle.com/legal/privacy" rel="noopener">Paddle's privacy policy</a>.</li>
  <li><b>Vercel Inc.</b> (USA): website and payment function hosting. <a href="https://vercel.com/legal/privacy-policy" rel="noopener">Vercel's policy</a>.</li>
</ul>
<p>These providers may process data outside your country, including in the USA, protected by safeguards such as the EU-U.S. Data Privacy Framework and the European Commission's Standard Contractual Clauses. We may disclose data if legally required by a competent authority.</p>

<h2>6. Retention</h2>
<ul>
  <li>Billing data: while you have a subscription and afterwards for the period required by Chilean tax law (generally 6 years).</li>
  <li>Support and scholarship emails: up to 24 months.</li>
  <li>Server logs: the short period set by our hosting provider.</li>
</ul>

<h2>7. Your rights</h2>
<p>Depending on where you live, you may request <b>access</b>, <b>correction</b>, <b>deletion</b>, <b>objection</b>, <b>portability</b>, <b>restriction</b> and <b>not to be subject to automated decisions</b>. California residents have the right to know, correct and delete their personal information and not to be discriminated against for exercising these rights; since we do not sell or share personal information, there is nothing to opt out of. Email {MAIL} from the address you paid with. We reply within 30 days, or sooner if your law requires. Exercising your rights is free.</p>
<p>You may also complain to your local data protection authority (for example your EU/UK supervisory authority, Brazil's ANPD, or Chile's Personal Data Protection Agency once operational).</p>

<h2>8. Children</h2>
<p>Vocari may be used by children and people with disabilities under adult supervision. Because we create no accounts and never receive app content, <b>we do not collect personal information from children</b> (COPPA, GDPR art. 8 and equivalent laws). Only adults with legal capacity (parents, guardians, therapists or institutions) may buy memberships. If you believe a child sent us data, contact us and we will delete it.</p>

<h2>9. Security</h2>
<p>We use encrypted connections (HTTPS) and cryptographically signed membership codes, and we never store card data. No system is 100% secure. If a breach affecting your data occurs, we will notify you and the authorities within legal deadlines.</p>

<h2>10. Cookies and local storage</h2>
<p>Vocari uses no tracking or advertising cookies, only the browser's local storage, which is strictly necessary for the app to work. During checkout, Paddle may use its own cookies needed for checkout and fraud prevention.</p>

<h2>11. Changes</h2>
<p>If we change this policy we will update the date above. If the change is material and you have a membership, we will email you before it takes effect.</p>
<p class="note">This is a translation of the Spanish version. In case of discrepancy, the version most favorable to you applies.</p>
''')

# ---------------- TÉRMINOS (ES) ----------------
page('terminos.html','es','Términos y condiciones','Condiciones de uso de Vocari y de las membresías Plus y Profesional.','terms.html',f'''
<h2>1. Quiénes somos y aceptación</h2>
<p>Vocari es un servicio ofrecido desde <b>Chile</b> (contacto: {MAIL}). Al usar Vocari o contratar una membresía aceptas estos términos, junto con la <a href="privacidad.html">Política de privacidad</a> y la <a href="reembolsos.html">Política de reembolsos</a>. Para contratar una membresía debes ser mayor de edad y tener capacidad legal para hacerlo. Los menores pueden usar la app bajo la supervisión de un adulto.</p>

<h2 id="salud">2. Aviso de salud y seguridad</h2>
<div class="box">
<p><b>Vocari es una herramienta de apoyo a la comunicación. No es un dispositivo médico</b>: no diagnostica ni trata ninguna condición y no reemplaza la evaluación ni el acompañamiento de profesionales de la salud o del lenguaje.</p>
<p><b>No es un sistema de emergencias</b> y no llama ni avisa a nadie automáticamente. Puede no funcionar si el dispositivo está sin batería o sin volumen, si el navegador borra los datos o si la voz del sistema no está disponible. Quien dependa de Vocari para comunicarse debería tener siempre un método alternativo, como un tablero impreso o señas acordadas. En una emergencia, contacta a los servicios de emergencia locales.</p>
</div>

<h2>3. Uso gratuito y licencia</h2>
<p>Las funciones de comunicación (vocabulario, voz, teclado, frases rápidas, un tablero propio y respaldo) son gratuitas, sin límite de tiempo y sin anuncios. Te damos una licencia no exclusiva e intransferible para usar Vocari con fines personales, familiares, educativos, terapéuticos o institucionales. El nombre, el logo, el diseño y el código de Vocari son de su titular.</p>

<h2>4. Membresías Plus y Profesional</h2>
<ul>
  <li><b>Precios:</b> Plus cuesta USD 3,99 al mes o USD 29 al año. Profesional cuesta USD 9,99 al mes o USD 79 al año. Se cobra en dólares estadounidenses y tu banco puede aplicar conversión o comisiones. Si en tu país corresponden impuestos, Paddle los agrega y muestra el total exacto antes de pagar.</li>
  <li><b>Prueba gratuita de 7 días.</b> No se cobra nada durante la prueba. Si no cancelas antes de que termine, se cobra el primer periodo automáticamente.</li>
  <li><b>Renovación automática:</b> la suscripción se renueva al final de cada periodo (mes o año), con el mismo medio de pago, hasta que la canceles. Recibirás un recibo por correo en cada cobro.</li>
  <li><b>Cancelación en línea, en cualquier momento:</b> desde la app (⚙️ Ajustes → Membresía → Administrar o cancelar suscripción) o escribiéndonos. La cancelación surte efecto al final del periodo pagado y conservas los beneficios hasta entonces.</li>
  <li><b>Cambios de precio:</b> te avisaremos por correo con al menos 30 días de anticipación. El nuevo precio aplica desde la siguiente renovación y puedes cancelar antes sin costo.</li>
  <li><b>Pagos fallidos:</b> si un cobro falla, Paddle reintentará durante algunos días. Si no se logra cobrar, la suscripción se cancela.</li>
  <li><b>Al terminar la membresía no se borra nada:</b> los perfiles, tableros y fotos que creaste siguen funcionando; solo dejas de poder crear nuevos elementos de las funciones de pago.</li>
  <li><b>Revendedor:</b> nuestro proceso de pedidos lo realiza nuestro revendedor en línea Paddle.com. Paddle.com es el Merchant of Record de todos nuestros pedidos. Paddle atiende las consultas de servicio al cliente sobre pagos y gestiona las devoluciones. Al comprar también aceptas los <a href="https://www.paddle.com/legal/checkout-buyer-terms" rel="noopener">términos para compradores de Paddle</a>.</li>
</ul>

<h2>4 bis. Guía Vocari para familias (libro digital)</h2>
<ul>
  <li>Precio: USD 1,99, pago único, más impuestos locales si corresponden. No es una suscripción.</li>
  <li>Se entrega como PDF para descargar inmediatamente después del pago. Guarda el archivo y el enlace de tu recibo.</li>
  <li>Es para tu uso personal, familiar o profesional. Puedes imprimir los tableros para la persona o el aula con quien trabajas, pero no puedes revender ni publicar el PDF.</li>
  <li>La guía es material informativo y no reemplaza la evaluación de un fonoaudiólogo o terapeuta del lenguaje.</li>
  <li>Tiene la misma garantía de reembolso de 14 días que las membresías.</li>
</ul>

<h2>5. Derecho de retracto y garantía</h2>
<p>Ofrecemos a todos los usuarios, en cualquier país, una <b>garantía de reembolso del 100% dentro de 14 días</b> desde cualquier cobro. Esta garantía cubre e iguala o supera el derecho de retracto de 10 días del artículo 3 bis de la Ley N° 19.496 de Chile, el derecho de desistimiento de 14 días de la Unión Europea y otras normas equivalentes. Los detalles están en la <a href="reembolsos.html">Política de reembolsos</a>.</p>

<h2>6. Código de membresía y uso justo</h2>
<p>Al pagar recibes un código de restauración para activar la membresía en tus dispositivos. Plus está pensado para una familia u hogar, y Profesional para un profesional o un aula. No publiques ni revendas tu código. Podemos desactivar códigos usados de forma claramente abusiva, avisándote previamente.</p>

<h2>7. Becas</h2>
<p>Podemos otorgar códigos gratuitos o con descuento a personas e instituciones que lo necesiten, a nuestra discreción y según disponibilidad.</p>

<h2>8. Tu contenido</h2>
<p>Las fotos, textos y tableros que agregas son tuyos y se guardan solo en tu dispositivo. Eres responsable de tener derecho a usar las fotos que agregues, especialmente las de terceros, y de hacer respaldos. No podemos recuperar datos borrados de tu dispositivo.</p>

<h2>9. Uso aceptable</h2>
<p>No intentes vulnerar el sistema de pagos o de membresías, atacar el servicio, ni usar Vocari para fines ilegales. Puedes compartir libremente el enlace a Vocari.</p>

<h2>10. Accesibilidad</h2>
<p>Nos esforzamos por seguir las pautas WCAG 2.1 nivel AA. Si encuentras una barrera de accesibilidad, escríbenos y la priorizaremos.</p>

<h2>11. Disponibilidad y cambios del servicio</h2>
<p>Hacemos lo posible para que Vocari funcione bien, pero no podemos garantizar que funcione sin interrupciones en todos los dispositivos, navegadores o voces del sistema. Podemos mejorar, cambiar o retirar funciones. Si retiramos una función de pago esencial, podrás cancelar y pedir el reembolso proporcional del periodo no usado.</p>

<h2>12. Responsabilidad</h2>
<p>En la medida en que la ley lo permita, y salvo dolo o culpa grave, nuestra responsabilidad total frente a ti se limita a lo que nos hayas pagado en los 12 meses anteriores al reclamo. Nada en estos términos excluye ni limita los derechos irrenunciables que te otorgan las leyes de protección al consumidor, incluida la Ley N° 19.496 de Chile y las normas de tu país de residencia.</p>

<h2>13. Ley aplicable y reclamos</h2>
<p>Estos términos se rigen por las leyes de la República de Chile. Si eres consumidor, también te protegen las normas imperativas de tu país de residencia y puedes reclamar ante los tribunales de tu domicilio. En Chile puedes acudir al SERNAC (<a href="https://www.sernac.cl" rel="noopener">sernac.cl</a>). Antes de cualquier reclamo, te invitamos a escribirnos a {MAIL}: respondemos en un máximo de 10 días hábiles.</p>

<h2>14. Cambios e idioma</h2>
<p>Podemos actualizar estos términos. Si un cambio afecta tu membresía, te avisaremos por correo con al menos 30 días de anticipación. Existe una versión en inglés; en caso de discrepancia, se aplica la versión más favorable para ti.</p>
''')

# ---------------- TERMS (EN) ----------------
page('terms.html','en','Terms of Service','Terms of use for Vocari and its Plus and Professional memberships.','terminos.html',f'''
<h2>1. Who we are and acceptance</h2>
<p>Vocari is a service provided from <b>Chile</b> (contact: {MAIL}). By using Vocari or buying a membership you accept these terms, together with our <a href="privacy.html">Privacy Policy</a> and <a href="refunds.html">Refund Policy</a>. To buy a membership you must be an adult with legal capacity to contract. Minors may use the app under adult supervision.</p>

<h2 id="health">2. Health and safety notice</h2>
<div class="box">
<p><b>Vocari is a communication support tool. It is not a medical device</b>: it does not diagnose or treat any condition and does not replace assessment or support by health or speech-language professionals.</p>
<p><b>It is not an emergency system</b> and does not call or alert anyone automatically. It may not work if the device has no battery or volume, if the browser clears its data, or if the system voice is unavailable. Anyone who relies on Vocari to communicate should always have a backup method, such as a printed board or agreed signs. In an emergency, contact your local emergency services.</p>
</div>

<h2>3. Free use and license</h2>
<p>Communication features (vocabulary, voice, keyboard, quick phrases, one custom board and backup) are free, with no time limit and no ads. We grant you a non-exclusive, non-transferable license to use Vocari for personal, family, educational, therapeutic or institutional purposes. Vocari's name, logo, design and code belong to its owner.</p>

<h2>4. Plus and Professional memberships</h2>
<ul>
  <li><b>Prices:</b> Plus costs USD 3.99/month or USD 29/year. Professional costs USD 9.99/month or USD 79/year. You are charged in US dollars and your bank may apply conversion fees. If taxes apply in your country, Paddle adds them and shows the exact total before you pay.</li>
  <li><b>7-day free trial.</b> You are not charged during the trial. If you don't cancel before it ends, the first period is charged automatically.</li>
  <li><b>Automatic renewal:</b> your subscription renews at the end of each period (month or year) using the same payment method until you cancel. You will receive an emailed receipt for every charge.</li>
  <li><b>Cancel online, anytime:</b> from the app (⚙️ Settings → Membership → Manage or cancel subscription) or by emailing us. Cancellation takes effect at the end of the paid period, and you keep your benefits until then.</li>
  <li><b>Price changes:</b> we will email you at least 30 days in advance. The new price applies from the next renewal and you may cancel before then at no cost.</li>
  <li><b>Failed payments:</b> if a charge fails, Paddle will retry for a few days. If payment cannot be collected, the subscription is canceled.</li>
  <li><b>When a membership ends, nothing is deleted:</b> the profiles, boards and photos you created keep working; you just can't create new paid items.</li>
  <li><b>Reseller:</b> our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries regarding payments and handles returns. By purchasing you also accept <a href="https://www.paddle.com/legal/checkout-buyer-terms" rel="noopener">Paddle's buyer terms</a>.</li>
</ul>

<h2>4 bis. Vocari Family Guide (ebook)</h2>
<ul>
  <li>Price: USD 1.99, one-time, plus local taxes where applicable. It is not a subscription.</li>
  <li>Delivered as a PDF to download immediately after payment. Keep the file and your receipt link.</li>
  <li>For your personal, family or professional use. You may print the boards for the person or class you work with, but you may not resell or publish the PDF.</li>
  <li>The guide is informational and does not replace assessment by a speech-language therapist.</li>
  <li>It has the same 14-day money-back guarantee as memberships.</li>
</ul>

<h2>5. Right of withdrawal and guarantee</h2>
<p>We offer every user, in every country, a <b>100% money-back guarantee within 14 days</b> of any charge. This guarantee covers and matches or exceeds the 10-day withdrawal right under Article 3 bis of Chile's Law 19,496, the EU's 14-day right of withdrawal and other equivalent rights. See the <a href="refunds.html">Refund Policy</a>.</p>

<h2>6. Membership code and fair use</h2>
<p>When you pay you receive a restore code to activate your membership on your devices. Plus is intended for one family or household, and Professional for one professional or classroom. Don't publish or resell your code. We may deactivate codes used in a clearly abusive way, with prior notice.</p>

<h2>7. Scholarships</h2>
<p>We may grant free or discounted codes to people and institutions in need, at our discretion and subject to availability.</p>

<h2>8. Your content</h2>
<p>The photos, text and boards you add are yours and are stored only on your device. You are responsible for having the right to use the photos you add, especially photos of other people, and for making backups. We cannot recover data deleted from your device.</p>

<h2>9. Acceptable use</h2>
<p>Don't attempt to circumvent the payment or membership system, attack the service, or use Vocari for illegal purposes. Feel free to share the link to Vocari.</p>

<h2>10. Accessibility</h2>
<p>We aim to follow WCAG 2.1 level AA. If you encounter an accessibility barrier, let us know and we'll prioritize it.</p>

<h2>11. Availability and changes</h2>
<p>We do our best to keep Vocari working well, but we can't guarantee uninterrupted operation on every device, browser or system voice. We may improve, change or remove features. If we remove an essential paid feature, you may cancel and request a pro-rata refund for the unused period.</p>

<h2>12. Liability</h2>
<p>To the extent permitted by law, and except for willful misconduct or gross negligence, our total liability to you is limited to what you paid us in the 12 months before the claim. Nothing in these terms excludes or limits non-waivable rights under consumer protection laws, including Chile's Law 19,496 and the laws of your country of residence.</p>

<h2>13. Governing law and complaints</h2>
<p>These terms are governed by the laws of the Republic of Chile. If you are a consumer, you also keep the protection of the mandatory laws of your country of residence and may bring claims before the courts of your domicile. Before any complaint, please email us at {MAIL}: we reply within 10 business days.</p>

<h2>14. Changes and language</h2>
<p>We may update these terms. If a change affects your membership, we will email you at least 30 days in advance. These terms are also available in Spanish; in case of discrepancy, the version most favorable to you applies.</p>
''')

# ---------------- REEMBOLSOS (ES) ----------------
page('reembolsos.html','es','Política de reembolsos','Garantía de 14 días y cómo pedir un reembolso de tu membresía de Vocari.','refunds.html',f'''
<div class="box"><b>En resumen:</b> pruébala 7 días gratis. Si igual te cobramos y no te sirvió, te devolvemos el 100% si lo pides dentro de los 14 días siguientes a cualquier cobro, estés donde estés.</div>

<h2>1. Prueba gratuita</h2>
<p>Las membresías Plus y Profesional incluyen 7 días gratis. Si cancelas durante la prueba, no se cobra nada.</p>

<h2>2. Garantía de 14 días (incluye el derecho de retracto)</h2>
<p>Si pagas una membresía (mensual, anual o una renovación) o la Guía Vocari, y no quedas conforme, escríbenos dentro de los <b>14 días corridos</b> siguientes al cobro y te devolvemos el <b>100%</b> de ese cobro, sin necesidad de dar explicaciones. Esta garantía cumple y supera el derecho de retracto de 10 días de la Ley N° 19.496 de Chile (art. 3 bis) y el derecho de desistimiento de 14 días de la Unión Europea. No lo pierdes por haber empezado a usar las funciones de pago.</p>

<h2>3. Después de 14 días</h2>
<ul>
  <li><b>Planes mensuales:</b> puedes cancelar cuando quieras para que no se renueven. No hacemos reembolsos parciales del mes en curso.</li>
  <li><b>Planes anuales:</b> te devolvemos la parte proporcional de los meses completos que no hayas usado.</li>
</ul>

<h2>4. Cobros por error</h2>
<p>Si se te cobró dos veces, si se renovó una suscripción que ya habías cancelado o si hubo cualquier error nuestro, te devolvemos el importe completo sin importar el plazo.</p>

<h2>5. Cómo pedirlo</h2>
<p>Escribe a <a data-site="mailto" data-subject="Reembolso Vocari"></a> desde el correo con el que pagaste e indica la fecha del cobro. También puedes pedirlo directamente a Paddle desde el enlace de tu recibo o en paddle.net. Procesamos el reembolso en un máximo de 5 días hábiles, al mismo medio de pago. Tu banco puede tardar de 5 a 10 días hábiles más en reflejarlo. El reembolso no tiene costo para ti.</p>

<h2>6. Tus derechos legales</h2>
<p>Esta política no reduce los derechos que te da la ley de tu país. Si la ley te reconoce un derecho más amplio, se aplica ese.</p>
''')

# ---------------- REFUNDS (EN) ----------------
page('refunds.html','en','Refund Policy','14-day guarantee and how to request a refund for your Vocari membership.','reembolsos.html',f'''
<div class="box"><b>In short:</b> try it free for 7 days. If you were charged and it didn't work for you, we refund 100% if you ask within 14 days of any charge, wherever you live.</div>

<h2>1. Free trial</h2>
<p>Plus and Professional memberships include 7 days free. If you cancel during the trial, you are not charged.</p>

<h2>2. 14-day guarantee (includes your right of withdrawal)</h2>
<p>If you pay for a membership (monthly, yearly or a renewal) or the Vocari Guide, and aren't satisfied, email us within <b>14 calendar days</b> of the charge and we will refund <b>100%</b> of it, no questions asked. This meets and exceeds the 10-day withdrawal right under Chile's Law 19,496 (art. 3 bis) and the EU's 14-day right of withdrawal. You don't lose it by having started to use paid features.</p>

<h2>3. After 14 days</h2>
<ul>
  <li><b>Monthly plans:</b> cancel anytime so they don't renew. We don't give partial refunds for the current month.</li>
  <li><b>Yearly plans:</b> we refund the pro-rata share of the full months you haven't used.</li>
</ul>

<h2>4. Charges made in error</h2>
<p>If you were charged twice, if a subscription you had already canceled renewed, or if we made any other mistake, we refund the full amount regardless of timing.</p>

<h2>5. How to request a refund</h2>
<p>Email <a data-site="mailto" data-subject="Vocari refund"></a> from the address you paid with, stating the charge date. You can also request it directly from Paddle via your receipt link or at paddle.net. We process refunds within 5 business days, to the same payment method. Your bank may take another 5–10 business days to show it. Refunds are free of charge.</p>

<h2>6. Your statutory rights</h2>
<p>This policy does not reduce your rights under the law of your country. If the law grants you a broader right, that right applies.</p>
''')
print('ok')
