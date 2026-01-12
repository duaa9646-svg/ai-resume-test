<a href="https://github.com/duaa9646-svg/ai-resume-test">
  <h1 align="center">AI Resume & Cover Letter Generator</h1>
</a>

<p align="center">
    An AI-powered tool to help developers create professional resumes and cover letters tailored to their target roles.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#pricing-plans"><strong>Pricing Plans</strong></a>
</p>
<br/>

## Features

- **AI-Powered Generation**: Leverages OpenAI's GPT models to create tailored resumes and cover letters
- **Developer-Focused**: Specialized templates and prompts for various developer roles (Frontend, Backend, Full Stack, DevOps, etc.)
- **Professional PDF Export**: Download your generated documents as formatted PDFs using jspdf and html2canvas
- **Subscription Management**: Integrated with Stripe for free and premium tier management
- **Modern Tech Stack**: Built with Next.js 16, React 19, TypeScript, and Tailwind CSS
- **Authentication**: Secure authentication powered by Auth.js (NextAuth.js)
- **Database Integration**: PostgreSQL with Drizzle ORM for user data and subscription tracking
- **Fully Responsive**: Mobile-friendly design that works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (can use [Neon](https://neon.tech) for free)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Stripe account for payment processing ([Sign up](https://dashboard.stripe.com/register))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/duaa9646-svg/ai-resume-test.git
cd ai-resume-test
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY`: Your OpenAI API key
- `POSTGRES_URL`: Your PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `STRIPE_PRICE_ID_PREMIUM`: Your Stripe price ID for premium plan

4. Set up the database:
```bash
pnpm db:migrate
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/
│   │   ├── generate/        # AI content generation endpoint
│   │   └── stripe/          # Stripe payment webhooks and checkout
│   ├── generator/           # Resume & cover letter form page
│   ├── profile/             # User profile & subscription management
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   └── ...                  # Other components
├── lib/
│   ├── ai/                  # AI model configuration
│   ├── db/                  # Database schema and migrations
│   └── subscription/        # Subscription tier logic
└── public/                  # Static assets
```

## Pricing Plans

### Free Plan
- 3 resume generations per month
- 3 cover letter generations per month
- PDF export
- Basic templates

### Premium Plan ($9.99/month)
- Unlimited resume generations
- Unlimited cover letter generations
- PDF export
- Premium templates
- Advanced AI customization
- Priority support

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

For Stripe webhooks, configure the webhook endpoint in your Stripe Dashboard:
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events to listen for: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) built on Radix UI
- **AI**: [AI SDK](https://ai-sdk.dev) with OpenAI integration
- **Authentication**: [Auth.js](https://authjs.dev)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Payments**: [Stripe](https://stripe.com)
- **PDF Generation**: jspdf and html2canvas
- **Deployment**: [Vercel](https://vercel.com)

## Extending for Other Niches

This application is designed to be easily extensible for other professional niches beyond developers:

1. **Update Target Roles**: Modify the role options in `app/generator/page.tsx`
2. **Customize AI Prompts**: Edit the prompt templates in `app/api/generate/route.ts`
3. **Add New Templates**: Create additional document templates in the components
4. **Adjust Branding**: Update metadata and copy throughout the application

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
