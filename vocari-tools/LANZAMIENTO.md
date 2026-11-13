# Lanzar Vocari: guía paso a paso

Cómo funciona el dinero:

```
Cliente (cualquier país) ──paga──▶ Paddle (vende por ti, cobra impuestos, emite factura)
                                      │
                                      └──te transfiere──▶ Payoneer (cuenta en USD) ──▶ tu banco en Chile
```

Paddle es el *Merchant of Record*: el vendedor legal frente al cliente. Cobra y declara el IVA y los
impuestos de cada país, maneja reembolsos y contracargos. Tú recibes el neto (≈ 5% + USD 0,50 menos por venta).

---

## 1. Payoneer (recibir el dinero)
1. En tu cuenta Payoneer → **Recibir → Cuentas de recepción** (Receiving accounts).
2. Activa la **cuenta en USD (Estados Unidos)**. Anota: nombre del banco, número de cuenta, routing (ABA) y tipo de cuenta.
3. Esos datos los pondrás en Paddle en el paso 2.6.

## 2. Paddle (cobrar)
1. Crea tu cuenta en **paddle.com** → "Get started". Elige **Paddle Billing**.
2. Primero prueba todo en **sandbox** (sandbox-vendors.paddle.com) y luego repite en producción.
3. **Verificación del negocio:** Paddle revisa tu identidad y tu sitio. Necesitará:
   - El dominio publicado (paso 3) con la landing, precios, **Términos**, **Privacidad** y **Reembolsos** visibles. Ya están hechos.
   - Una descripción del producto: *"Vocari: app web de comunicación aumentativa (CAA) gratuita con membresías opcionales (Plus/Profesional) y un libro digital en PDF."*
4. **Developer tools → Authentication:**
   - Crea una **API key** (permisos: transactions, subscriptions, customers, customer portal sessions). Es **secreta**.
   - Crea un **client-side token** (empieza con `live_` o `test_`). Es pública.
5. **Checkout → Checkout settings → Default payment link:** pon `https://TU-DOMINIO/app.html`. Sin esto, Paddle no permite crear transacciones.
6. **Payouts → Payout settings:** método **transferencia bancaria (wire / ACH en USD)** con los datos de tu cuenta USD de Payoneer.
7. **(Opcional) Tax category "ebooks"** para la guía: pídela en Paddle. Mientras tanto se usa "standard". Cuando la aprueben, agrega la variable `PADDLE_EBOOK_TAX_CATEGORY=ebooks`.
8. **Customer portal:** viene activado. Tus clientes cancelan desde la app (⚙️ → Membresía → Administrar).
9. **Becas:** crea un **descuento** del 100% (Catalog → Discounts) con código, por ejemplo `BECA-XXXX`, de uso único. Envíalo por correo a quien lo pida.

No necesitas crear productos ni precios en Paddle: la app los envía en cada compra (Plus, Profesional, Guía).

## 3. Vercel (publicar)
1. vercel.com → **Add New → Project** → importa `tim3sane/digital-income-blueprint-courses`.
2. **Root Directory:** `vocari`. **Project name:** `vocari`. Framework: *Other*.
3. **Environment Variables:**

   | Variable | Valor |
   |---|---|
   | `PADDLE_API_KEY` | tu API key (secreta) |
   | `PADDLE_CLIENT_TOKEN` | tu client-side token |
   | `PADDLE_ENV` | `sandbox` para probar, `production` al lanzar |
   | `VOCARI_TOKEN_SECRET` | una cadena larga aleatoria (por ejemplo, de un generador de contraseñas de 40+ caracteres) |

4. **Deploy.** Tu link será `https://vocari.vercel.app` (o similar). Después puedes conectar un dominio propio en Settings → Domains.
5. Vuelve a Paddle y aprueba ese dominio en **Checkout → Website approval**.

> ⚠️ Define `VOCARI_TOKEN_SECRET` antes de vender y no lo cambies después: invalida los códigos de membresía ya entregados.

## 4. Prueba antes de lanzar (en sandbox)
Usa la tarjeta de prueba de Paddle: `4242 4242 4242 4242`, cualquier fecha futura, CVC `100`.
- [ ] Landing → Plus → pagar → vuelve a la app con "Tu plan: Vocari Plus".
- [ ] ⚙️ → Membresía → Administrar → abre el portal de Paddle.
- [ ] Copiar el código de restauración y pegarlo en otro navegador → se activa.
- [ ] guia.html → Comprar → aparece "Descargar la guía (PDF)" → descarga.

Cuando todo funcione: cambia en Vercel `PADDLE_ENV=production` y pon la API key y el token **de producción**. Redeploy.

## 5. Datos legales
En `vocari/site.js` agrega tu **nombre legal y RUT** (o los de tu empresa) en `owner`. La ley chilena del
consumidor y el RGPD piden identificar al responsable. Declara en el SII los ingresos que recibes de Paddle.

## 6. Regenerar la guía (si la editas)
```
cd vocari-tools/guia
node build.cjs        # crea guia-vocari.pdf y actualiza vocari/api/_ebook.js
```
Las páginas legales se regeneran con `python3 vocari-tools/build-legal.py` (desde la carpeta `vocari`).
