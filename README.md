<div align="center">

# 🎮 PokéDex Explorer

### _Pokémon Encyclopedia untuk Mengeksplorasi Dunia Pokémon_

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![PokéAPI](https://img.shields.io/badge/PokéAPI-v2-EF5350?style=for-the-badge)](https://pokeapi.co)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" width="200" />

**Aplikasi web modern untuk menjelajahi data Pokémon lengkap dengan fitur interaktif.**

[🚀 Live Demo](https://pokemonv1.vercel.app/) • [📖 Dokumentasi](#features) • [🐛 Report Bug](../../issues) • [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

**PokéDex Explorer** adalah aplikasi web yang dibangun menggunakan React + Vite untuk menyediakan informasi lengkap tentang Pokémon. Aplikasi ini memanfaatkan [PokéAPI](https://pokeapi.co) untuk mengambil data dan menampilkannya dengan UI/UX yang modern dan responsif.

Dibuat dengan tujuan keperluan frontend dan untuk Kinanti Indah P dan pembelajaran sekaligus showcase kemampuan dalam membangun aplikasi frontend yang kompleks dengan state management, API integration, dan responsive design.

---

## ✨ Features

### 🏠 Homepage
| Feature | Deskripsi |
|---------|-----------|
| **Pokémon Grid** | Menampilkan 20+ Pokémon dengan card yang menarik |
| **Search Bar** | Pencarian real-time berdasarkan nama Pokémon |
| **Generation Filter** | Filter berdasarkan generasi (Gen I - Gen IX) |
| **Pagination** | Navigasi halaman untuk melihat Pokémon lainnya |

### 📄 Detail Page
| Feature | Deskripsi |
|---------|-----------|
| **Basic Info** | Nama, ID, tipe, height, dan weight |
| **✨ Shiny Toggle** | Lihat versi shiny dengan efek glow emas |
| **🔊 Pokémon Cry** | Dengarkan suara asli Pokémon |
| **Species Info** | Flavor text, habitat, egg groups, gender ratio |
| **Abilities** | Kemampuan normal dan hidden ability |
| **Base Stats** | HP, Attack, Defense, Sp.Atk, Sp.Def, Speed |
| **Evolution Chain** | Rantai evolusi dengan trigger (level, item, trade) |
| **Moves List** | Jurus yang bisa dipelajari dengan type, power, accuracy |
| **Location Encounters** | Lokasi di mana Pokémon bisa ditemukan |

### � Compare Page
| Feature | Deskripsi |
|---------|-----------|
| **Side-by-Side** | Bandingkan 2 Pokémon sekaligus |
| **Stats Comparison** | Visual bar untuk membandingkan stats |
| **Winner Declaration** | Menampilkan pemenang berdasarkan total stats |

### 🎨 Type Chart Page
| Feature | Deskripsi |
|---------|-----------|
| **Type Selector** | Klik tipe untuk melihat detail keefektifan |
| **Attacking/Defending** | Toggle mode menyerang atau bertahan |
| **Full Chart Table** | Tabel 18×18 tipe dengan warna effectiveness |

---

## 🛠 Tech Stack

### Frontend
```
React 19          → UI Library
Vite 7            → Build Tool & Dev Server
React Router 7    → Client-side Routing
```

### Styling
```
Vanilla CSS       → Custom Design System
CSS Variables     → Theming & Colors
CSS Grid/Flexbox  → Responsive Layout
```

### API
```
PokéAPI v2        → Pokémon Data Source
Fetch API         → HTTP Requests
```

### Development
```
ESLint            → Code Linting
Rolldown          → Production Bundler
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan kamu sudah menginstall:
- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**

### Installation

```bash
# Clone repository
git clone https://github.com/username/pokedex-explorer.git

# Masuk ke direktori project
cd pokedex-explorer

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build for Production

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
pokedex-explorer/
├── public/
│   ├── loading.gif          # Custom loading animation
│   └── pokeball.svg         # Favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Page footer
│   │   ├── SearchBar.jsx    # Search input
│   │   ├── PokemonCard.jsx  # Pokemon card component
│   │   ├── Pagination.jsx   # Page navigation
│   │   ├── GenerationFilter.jsx  # Gen filter buttons
│   │   ├── StatBar.jsx      # Stats visualization
│   │   ├── EvolutionChain.jsx    # Evolution display
│   │   ├── AbilitiesInfo.jsx     # Abilities section
│   │   ├── SpeciesInfo.jsx       # Species data section
│   │   ├── MovesList.jsx         # Moves table
│   │   ├── LocationEncounters.jsx # Location data
│   │   ├── Loading.jsx      # Loading state
│   │   └── Error.jsx        # Error state
│   ├── hooks/
│   │   └── usePokemon.js    # Custom hooks for API calls
│   ├── pages/
│   │   ├── HomePage.jsx     # Main listing page
│   │   ├── DetailPage.jsx   # Pokemon detail page
│   │   ├── ComparePage.jsx  # Compare pokemon page
│   │   └── TypeChartPage.jsx # Type effectiveness page
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & design system
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## � API Reference

Aplikasi ini menggunakan [PokéAPI](https://pokeapi.co/docs/v2) sebagai sumber data.

### Endpoints yang Digunakan

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /pokemon?limit=20&offset=0` | Daftar Pokémon dengan pagination |
| `GET /pokemon/{id}` | Detail Pokémon by ID |
| `GET /pokemon-species/{id}` | Species info (flavor text, habitat, dll) |
| `GET /pokemon/{id}/encounters` | Location encounters |
| `GET /ability/{id}` | Ability details |
| `GET /move/{id}` | Move details |
| `GET /type` | Semua tipe Pokémon |
| `GET /type/{id}` | Detail tipe dengan damage relations |

### Custom Hooks

```javascript
// Fetch paginated pokemon list
usePokemonList(page)

// Fetch single pokemon detail
usePokemonDetail(id)

// Fetch all pokemon for search/filter
useAllPokemon()

// Fetch evolution chain
useEvolutionChain(pokemonId)

// Fetch abilities with descriptions
useAbilities(pokemon)

// Fetch species info
useSpecies(pokemonId)

// Fetch moves data
useMoves(pokemon, limit)

// Fetch encounter locations
useEncounters(pokemonId)

// Fetch all types for type chart
useTypes()
```

---

## 📸 Screenshots

### Homepage
> Halaman utama dengan grid Pokémon, search bar, dan generation filter

### Detail Page
> Informasi lengkap Pokémon dengan shiny toggle dan cry audio

### Compare Page
> Perbandingan stats 2 Pokémon side-by-side

### Type Chart
> Tabel keefektifan tipe yang interaktif

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut langkah-langkahnya:

1. **Fork** repository ini
2. **Create branch** untuk feature baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Development Guidelines

- Gunakan **Conventional Commits** untuk pesan commit
- Pastikan kode sudah di-lint sebelum commit
- Tambahkan dokumentasi untuk fitur baru

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) - Free Pokémon API
- [React](https://react.dev/) - UI Library
- [Vite](https://vite.dev/) - Build Tool
- [Pokémon](https://www.pokemon.com/) - The Pokémon Company

---

<div align="center">

**Created by Yusuf Efendi**

<br />

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/dicresoyusuf)

</div>
