/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DATA_API_KEY: string
    readonly VITE_KAKAO_MAP_KEY: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
