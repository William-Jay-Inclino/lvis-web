// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    app: {
        head: {
            title: "Leyeco V Integrated System",
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                // Add any other meta tags here
            ],
            link: [
                { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' },
                { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
            ],
            script: [
                { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js", type: "text/javascript" }
            ],
        }
    },
    plugins: [
        { src: '~/plugins/vue-toastification.ts', mode: 'client' },
        { src: '~/plugins/vue-select.ts', mode: 'client' },
        { src: '~/plugins/vuedraggable.ts', mode: 'client' },
    ],
    css: [
        '~/assets/css/main.css'
    ]
})
