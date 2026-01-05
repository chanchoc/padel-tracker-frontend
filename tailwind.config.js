/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6", // Azul (principal, botones)
                secondary: "#10B981", // Verde (acentos, success)
                accent: "#F59E0B", // Naranja (highlights, warnings)
                // Para texto
                textPrimary: "#1F2937", // Gris oscuro (texto principal)
                textSecondary: "#6B7280", // Gris medio (texto secundario)
                textLight: "#9CA3AF", // Gris claro (hints, placeholders)
                // Backgrounds
                background: "#F8FAFC", // Gris muy claro
                surface: "#FFFFFF", // Blanco
                border: "#E5E7EB", // Bordes sutiles
            },
            fontFamily: {
                poppins: ["Poppins"],
                "poppins-semibold": ["Poppins-SemiBold"],
                "poppins-bold": ["Poppins-Bold"],
                "poppins-italic": ["Poppins-Italic"],
            },
        },
    },
    plugins: [],
};
