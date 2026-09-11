# ✦ Artisan Connect

> **Where heritage finds its next chapter.**

Artisan Connect is a modern, multilingual platform built to connect Indian artisans, traditional and contemporary art forms, and buyers through technology and AI.

## 🌾 What Artisan Connect Does

Artisan Connect brings multiple art forms into one platform so artisans can present their work, understand their products, discover potential markets, and connect with buyers.

### Core experiences

- **Explore Art Forms** — discover Indian crafts and artistic traditions.
- **AI Catalog** — upload an artwork image and generate a structured product catalog.
- **AI Market Linkage** — estimate how well a product matches a selected buyer category.
- **Artisan Stories** — give makers a space to share the story behind their work.
- **Marketplace** — showcase products to potential buyers and collectors.
- **Role-based access** — separate artisan and buyer experiences.
- **Multilingual interface** — English plus major Indian languages.

## ✨ AI Catalog

The AI cataloging flow analyzes an uploaded product image and can return:

- Product title
- Craft / art form
- Possible origin
- Visible or likely materials
- Technique
- Product description
- Artisan/product story
- Search tags
- Selected buyer category
- Estimated market-match percentage
- Market-match reasoning
- AI confidence
- Items requiring artisan confirmation

The system is intentionally conservative. It should not invent provenance, identity, exact origin, cultural claims, certifications, materials, or techniques that cannot be established from the available information. Uncertain information is marked for artisan confirmation.

> **Important:** Market-match percentages are recommendations based on visible product characteristics and the selected buyer category. They are not guaranteed sales predictions.

## 🌍 Languages

The interface is designed for multilingual access and currently supports:

- English
- हिन्दी (Hindi)
- বাংলা (Bengali)
- मराठी (Marathi)
- ગુજરાતી (Gujarati)
- தமிழ் (Tamil)
- తెలుగు (Telugu)
- ಕನ್ನಡ (Kannada)
- മലയാളം (Malayalam)
- ଓଡ଼ିଆ (Odia)
- ਪੰਜਾਬੀ (Punjabi)
- অসমীয়া (Assamese)

The selected language is stored locally so it remains active after refresh. The login experience is also translated.

## 🎨 Design Direction

Artisan Connect uses a warm, premium Indian-inspired visual language based on natural materials, textiles, handicrafts, and traditional craft aesthetics.

### Palette

- Warm Cream — `#F7F0E5`
- Ivory — `#FFF9F0`
- Sand Beige — `#DCC8AD`
- Terracotta — `#B85C38`
- Rust — `#93442E`
- Burnt Orange — `#C66A3D`
- Deep Chocolate — `#4A2C22`
- Espresso — `#241612`
- Muted Burgundy — `#713B3B`
- Soft Peach — `#F2C4AE`

The interface deliberately avoids green and uses restrained AI accents rather than a generic blue/purple AI-dashboard aesthetic.

## 🧱 Tech Stack

- **React** — UI and application state
- **Vite** — development and production build tooling
- **Node.js / Vercel serverless functions** — AI API endpoint
- **OpenAI API** — image understanding and catalog generation
- **Formidable** — multipart image upload parsing
- **CSS** — custom responsive visual system

## 📁 Project Structure

```text
.
├── api/
│   └── catalog.js          # Server-side AI catalog endpoint
├── public/                 # Static assets
├── src/
│   ├── main.jsx            # Main React application
│   ├── styles.css          # Application styling
│   ├── i18n.js             # Translation dictionary/runtime
│   └── i18n-runtime.js     # Runtime translation support
├── .env.example            # Environment variable template
├── index.html              # Vite entry HTML
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/avikkaaa/AC.git
cd AC
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the AI API key

Create a `.env` file based on `.env.example`:

```env
OPENAI_API_KEY=your_server_side_openai_api_key
```

Keep the API key server-side. Do **not** expose it in client-side React code.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## 🔐 Authentication

The current login/dashboard experience is a frontend demonstration with role selection and local browser state. It is not a production authentication system.

For production, connect the role-based interface to a secure authentication provider and persistent database.

## 🤖 AI API

The catalog endpoint is available at:

```text
POST /api/catalog
```

It accepts a multipart image upload and a buyer-category preference. The server processes the image and returns structured catalog information and a market-match recommendation.

The buyer category is treated as a **preference signal**, not as evidence about the product itself.

## 🛍️ Buyer Categories

The demo includes categories such as:

- Home Decor & Interiors
- Art Collectors
- Museum & Cultural Spaces
- Fashion & Textiles
- Gifting & Lifestyle
- Contemporary Art Buyers
- Ethical / Handmade Shoppers
- Hospitality & Boutique Hotels

## 📱 Responsive Design

The interface is designed for desktop and mobile layouts, with responsive navigation, cards, forms, AI catalog results, login UI, and dashboard experiences.

## 🧭 Roadmap

Potential next steps include:

- Production authentication
- Artisan profiles and verification
- Persistent artwork/product database
- Real marketplace checkout
- Buyer–artisan messaging
- Saved searches and recommendations
- Location-aware market opportunities
- Human review workflow for AI-generated catalog data
- More complete translation coverage for dynamic content
- Analytics and impact reporting

## ⚠️ Current Demo Limitations

This repository contains a working product/demo experience. Some marketplace data, opportunities, profiles, and dashboard content are currently demonstration data rather than a production database.

AI-generated catalog information should be reviewed by the artisan before publication, especially for origin, materials, technique, cultural context, and provenance.

## 🤝 Contributing

Contributions and improvements are welcome. When adding features, keep the platform accessible to artisans with different levels of digital literacy and preserve the multilingual, culturally respectful design direction.

## 📄 License

Add the project's chosen license here before public distribution.
