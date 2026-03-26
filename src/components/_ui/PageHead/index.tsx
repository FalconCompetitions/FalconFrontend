import Head from 'next/head';
import React from 'react';

interface PageHeadProps {
    title: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
}

/**
 * Componente para adicionar meta tags SEO de forma consistente
 * @example
 * <PageHead 
 *   title="Ranking da Competição" 
 *   description="Acompanhe o ranking em tempo real" 
 * />
 */
const PageHead: React.FC<PageHeadProps> = ({
    title,
    description = 'Plataforma oficial da Maratona de Programação da FHO',
    keywords = ['programação', 'competição', 'maratona', 'FHO', 'Falcon'],
    ogImage = '/teamplate/preview.png',
    noIndex = false,
}) => {
    const fullTitle = `${title} | Falcon - FHO`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            
            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content="website" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            
            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            
            {/* Viewport */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
    );
};

export default PageHead;
