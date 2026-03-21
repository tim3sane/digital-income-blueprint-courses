/**
 * Cloudflare Function — Verify a Stripe purchase
 * GET /api/verify-purchase?session_id=cs_test_...
 *
 * Used on success.html to confirm payment and show course access.
 */

export async function onRequestGet(context) {
    const { request, env } = context;

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': env.SITE_URL || '*',
    };

    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('session_id');

        if (!sessionId || !sessionId.startsWith('cs_')) {
            return new Response(JSON.stringify({ error: 'Invalid session.' }), {
                status: 400,
                headers,
            });
        }

        if (!env.STRIPE_SECRET_KEY) {
            return new Response(JSON.stringify({ error: 'Payment system not configured.' }), {
                status: 500,
                headers,
            });
        }

        // Retrieve session from Stripe
        const stripeRes = await fetch(
            `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
            {
                headers: {
                    'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                },
            }
        );

        const session = await stripeRes.json();

        if (session.error) {
            return new Response(JSON.stringify({ error: 'Session not found.' }), {
                status: 404,
                headers,
            });
        }

        if (session.payment_status !== 'paid') {
            return new Response(JSON.stringify({ error: 'Payment not completed.' }), {
                status: 402,
                headers,
            });
        }

        return new Response(JSON.stringify({
            ok: true,
            courseId: session.metadata?.courseId,
            email: session.customer_email || session.customer_details?.email,
            amount: session.amount_total,
            currency: session.currency,
        }), {
            status: 200,
            headers,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Verification failed.' }), {
            status: 500,
            headers,
        });
    }
}
