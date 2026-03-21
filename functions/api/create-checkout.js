/**
 * Cloudflare Function — Create Stripe Checkout Session
 * POST /api/create-checkout
 * Body: { courseId: "starter" | "ai" | "ultimate" }
 *
 * Environment variables needed (set in Cloudflare Dashboard):
 *   STRIPE_SECRET_KEY — sk_test_... or sk_live_...
 *   SITE_URL — https://your-site.pages.dev
 */

const COURSES = {
    starter: {
        name: 'Dropshipping from Zero with AI',
        price: 999, // in cents ($9.99)
        description: '15 modules · 10+ hours · AI prompts included',
    },
    ai: {
        name: 'AI for E-commerce: Automate Everything',
        price: 1999, // $19.99
        description: '12 modules · 8 hours · Ready-made templates',
    },
    ultimate: {
        name: 'Scale to $10K/mo with Paid Ads — Ultimate Blueprint',
        price: 4999, // $49.99
        description: '18 modules · 14 hours · 1-on-1 support · Lifetime updates',
    },
};

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': env.SITE_URL || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const { courseId, email } = await request.json();

        // Validate course
        const course = COURSES[courseId];
        if (!course) {
            return new Response(JSON.stringify({ error: 'Invalid course.' }), {
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

        const siteUrl = env.SITE_URL || 'https://digital-income-blueprint-courses.tim3sane.workers.dev';

        // Create Stripe Checkout Session via API (no SDK needed)
        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('success_url', `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`);
        params.append('cancel_url', `${siteUrl}/index.html#courses`);
        params.append('line_items[0][price_data][currency]', 'usd');
        params.append('line_items[0][price_data][product_data][name]', course.name);
        params.append('line_items[0][price_data][product_data][description]', course.description);
        params.append('line_items[0][price_data][unit_amount]', course.price.toString());
        params.append('line_items[0][quantity]', '1');
        params.append('metadata[courseId]', courseId);
        params.append('allow_promotion_codes', 'true');

        if (email) {
            params.append('customer_email', email);
        }

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        const session = await stripeRes.json();

        if (session.error) {
            return new Response(JSON.stringify({ error: session.error.message }), {
                status: 400,
                headers,
            });
        }

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
            status: 500,
            headers,
        });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
